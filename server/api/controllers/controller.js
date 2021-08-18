const mongoose = require('mongoose');
const characters = mongoose.model('characters');
const comics = mongoose.model('comics');
const authors = mongoose.model('authors');
const metadata = mongoose.model('metadata')

exports.list_all_characters = async (_, res) => {
    // return all the id and character names
    return await characters.find({}, { _id: 1, character_name: 1 }, (err, allCharacters) => {
        if (err) res.send(err);
        res.json(allCharacters);
        res.end();
        res.connection.end();
    });
};

exports.list_all_characters_with_relatives = async (_, res) => {
    // return all the id and character names
    return await characters.find({}, { _id: 1, character_name: 1, relatives: 1, closest_characters: 1 }, (err, allCharacters) => {
        if (err) res.send(err);
        res.json(allCharacters);
        res.end();
        res.connection.end();
    });
};

exports.list_all_comic_authors = async (_, res) => {
    // list all comics' authors
    return await comics.find({}, { author_ids: 1, _id: 0 }, (err, allComics) => {
        if (err) res.send(err);
        res.json(allComics);
        console.log("all comic authors sent:", allComics.length);
        res.end();
        res.connection.end();
    });
};

exports.list_all_authors_light = async (_, res) => {
    return await authors.find({}, { author_name: 1, _id: 1 }, (err, result) => {
        if (err) res.send(err);
        res.json(result);
        res.end();
        res.connection.end();
    })
}

exports.get_query_count = async (_, res) => {
    // get how many searches we got
    return await metadata.find({ _id: 0 }, (err, result) => {
        if (err) res.send(err);
        res.json(result);
        res.end();
        res.connection.end();
    })
}

exports.list_all_comics = async (_, res) => {
    // list all comics
    return await comics.find({}, (err, allComics) => {
        if (err) res.send(err);
        res.json(allComics);
    });
};

exports.list_all_authors = async (_, res) => {
    // list all authors
    return await authors.find({}, (err, allAuthors) => {
        if (err) res.send(err);
        res.json(allAuthors);
        res.end();
        res.connection.end();
    });
};

async function get_one_character_info(id) {
    // get one character's information
    chid = id;
    return await characters.findById(chid).select({ relatives: 0, closest_characters: 0 })
        .then(data => {
            if (!data) {
                return null;
            } else {
                return data;
            }
        }).catch(err => {
            console.log("Error when retrieving one character with id= " + chid);
            console.log(err);
        })

}

async function get_one_comic_info(id) {
    // get one comic's information
    cmid = id;
    return await comics.findById(cmid)
        .then(data => {
            if (!data) {
                return null;
            } else {
                return data;
            }
        }).catch(err => {
            console.log("Error when retrieving one comic with id= " + cmid);
            console.log(err);
        })

}

async function get_one_author_info(id) {
    auid = id;
    return await authors.findById(auid)
        .then(data => {
            if (!data) {
                return null;
            } else {
                return data;
            }
        }).catch(err => {
            console.log("Error when retrieving one author with id= " + auid);
            console.log(err);
        })

}

exports.show_one_character = async (req, res) => {
    // information we need to send:
    // the character info and its comics ids
    // 1. the item in db
    // 2. all the comic in db that are in this character's comicIDs
    // 3. all the characters that are in those comics
    // 4. all the authors

    const characterID = req.params.id;
    return await characters.findById(characterID)
        .then(async data => {
            if (!data) {
                res.status(404).send({ message: "Not found Character with id " + id });
            }
            else {
                result = {}
                result["character"] = { "name": data.character_name, "url": data.url, "id": parseInt(characterID) };

                // get all the comic items
                comicIDs = data.comic_ids;
                comicItems = await comicIDs.map(async id => {
                    return await get_one_comic_info(id).then(data => { return { "name": data.comic_name, "url": data.url, "characters": data.character_ids, "authors": data.author_ids, "id": parseInt(data.id), "cover": data.cover }; });
                });
                result["comics"] = await Promise.all(comicItems);

                // get ids for authors and characters
                characterIDs = [];
                authorIDs = []
                for (const comicItem of result["comics"]) {
                    characterIDs = characterIDs.concat(comicItem.characters);
                    authorIDs = authorIDs.concat(comicItem.authors);
                }
                characterIDs = [...new Set(characterIDs)];
                authorIDs = [...new Set(authorIDs)];

                // get all the connected characters
                characterItems = await characterIDs.map(async id => {
                    return await get_one_character_info(id).then(data => { return { "name": data.character_name, "url": data.url, "id": id, "comic_count": data.comic_ids.length } });
                })
                result["connected_characters"] = await Promise.all(characterItems);

                // get all the authors
                authorItems = await authorIDs.map(async id => {
                    return await get_one_author_info(id).then(data => { return { "name": data.author_name, "url": data.url, "id": id, "comic_count": data.comic_count } });
                })
                result["authors"] = await Promise.all(authorItems);

                res.send(result);
                console.log(characterID, ": ", result["character"]["name"]);
                metadata.findOneAndUpdate({ _id: 0 }, { $inc: { 'query_count': 1 } }, (err, brote) => {    // callback
                    // console.log(err, brote);
                });
                res.end();
                res.connection.end();
            }
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving character with id= " + characterID + ", Error: " + err });
        });
};