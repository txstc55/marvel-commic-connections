from datetime import datetime
import pymongo
import requests
from bs4 import BeautifulSoup
import time
import random
import json
characterInfos = {}
comicInfos = {}
authorInfos = {}


with open("characters.json", 'r') as outfile:
    characterInfos = json.load(outfile)


with open("comics.json", 'r') as outfile:
    comicInfos = json.load(outfile)

with open("authors.json", 'r') as outfile:
    authorInfos = json.load(outfile)


myclient = pymongo.MongoClient("mongodb://localhost:27017/")
# myclient.drop_database("marvel")
mydb = myclient["marvel"]

characterCollections = mydb["characters"]
characterCollections.drop()
characterCollections = mydb["characters"]
characterIDToName = {}  # record the id to name info

for character in characterInfos:
    characterIDToName[characterInfos[character]["id"]] = character
    characterInfos[character]["relatives"] = 0
    characterInfos[character]["closest_characters"] = []

authorIDToURL = {}
for item in authorInfos:
    authorIDToURL[authorInfos[item]["id"]] = item

comicIDToName = {}
for item in comicInfos:
    comicIDToName[comicInfos[item]["id"]] = item

for character in characterInfos:
    # get the list of comics
    comics = list(set(characterInfos[character]["comicIDs"]))
    currentid = characterInfos[character]["id"]  # we want to exclude itself
    character_appearance = {}
    for comic in comicInfos:
        if comicInfos[comic]["id"] in comics:
            # get all the character ids
            tmplist = list(set(comicInfos[comic]["characterIDs"]))
            # for each character, we want to check how many appearance it has
            for characterid in tmplist:
                if characterid != currentid:
                    if not characterid in character_appearance:
                        character_appearance[characterid] = 0
                    character_appearance[characterid] += 1
    # find the most appearing id
    maximum = -1
    maximum_ids = [currentid]
    for cid in character_appearance:
        if character_appearance[cid] > maximum:
            maximum = character_appearance[cid]
            maximum_ids = [cid]
        elif character_appearance[cid] == maximum:
            oldname = characterIDToName[maximum_ids[0]]
            newname = characterIDToName[cid]
            new_comic_count = len(
                list(set(characterInfos[newname]["comicIDs"])))
            old_comic_count = len(
                list(set(characterInfos[oldname]["comicIDs"])))
            if (new_comic_count > old_comic_count):
                maximum_ids = [cid]
            elif (new_comic_count == old_comic_count):
                maximum_ids.append(cid)

    for maximum_id in maximum_ids:
        name = characterIDToName[maximum_id]
        if maximum_id != currentid:
            characterInfos[character]["closest_characters"].append(maximum_id)
            characterInfos[name]["relatives"] += 1
print("Finished getting all relatives")

for character in characterInfos:
    # we want to see what is the most
    comicList = list(set(characterInfos[character]["comicIDs"]))
    comicList.sort(
        key=lambda x: datetime.strptime(comicInfos[comicIDToName[x]]["date"], "%B %d, %Y"))
    characterItem = {"_id": characterInfos[character]["id"], "character_name": character, "relatives": characterInfos[character]["relatives"],
                     "closest_characters": characterInfos[character]["closest_characters"], "url": characterInfos[character]["url"], "comic_ids": comicList}
    characterCollections.insert_one(characterItem)
print("Finished storing characters")

# record for each author, how many comics he takes part in
author_comic_count = {}
comicCollections = mydb["comics"]
comicCollections.drop()
comicCollections = mydb["comics"]
for comic in comicInfos:
    comicItem = {"_id": comicInfos[comic]["id"], "cover": comicInfos[comic]["cover"], "comic_name": comic, "author_ids": list(set(
        comicInfos[comic]["authorIDs"])), "url": comicInfos[comic]["url"], "character_ids": list(set(comicInfos[comic]["characterIDs"])), "date": comicInfos[comic]["date"]}
    for item in list(set(comicInfos[comic]["authorIDs"])):
        if not item in author_comic_count:
            author_comic_count[item] = 0
        author_comic_count[item] += 1
    comicCollections.insert_one(comicItem)
print("Finished storing all comics")

authorCollections = mydb["authors"]
authorCollections.drop()
authorCollections = mydb["authors"]


author_collaborators = {}
for item in comicInfos:
    creators = list(set(comicInfos[item]["authorIDs"]))
    for cid in creators:
        if not cid in author_collaborators:
            author_collaborators[cid] = {}

        for nid in creators:
            # author_collaborators[cid][cid] will give us the number
            # of comics this creator participates in
            if not nid in author_collaborators[cid]:
                author_collaborators[cid][nid] = 0

            author_collaborators[cid][nid] += 1

network = {}
for url in authorInfos:
    authorInfos[url]["relatives"] = 0
    authorInfos[url]["closest_authors"] = []

for key in author_collaborators:
    value = author_collaborators[key]
    closest_authors = []
    maximum_collaborations = -1

    for cid in value:
        count = value[cid]
        if cid != key:
            # we want to exclude itself
            if count > maximum_collaborations:
                # if has more collaborations
                # replace
                closest_authors = [cid]
                maximum_collaborations = count
            elif count == maximum_collaborations:
                # if number of collaborations is equal
                # we want to check the total number of works
                # if it has more, then replace
                # otherwise, join the list
                total_work = author_collaborators[cid][cid]
                other_total_work = author_collaborators[closest_authors[0]
                                                        ][closest_authors[0]]
                if total_work > other_total_work:
                    closest_authors = [cid]
                elif total_work == other_total_work:
                    closest_authors.append(cid)
    authorInfos[authorIDToURL[key]]["closest_authors"] = closest_authors
    for cid in closest_authors:
        # add the relatives
        authorInfos[authorIDToURL[cid]]["relatives"] += 1
print("Finished getting all author closest collaborators")

for author in authorInfos:
    authorItem = {"_id": authorInfos[author]["id"], "author_name": authorInfos[author]
                  ["name"], "url": author, "comic_count": author_comic_count[authorInfos[author]["id"]], "relatives": authorInfos[author]["relatives"], "closest_authors": authorInfos[author]["closest_authors"]}
    authorCollections.insert_one(authorItem)

if not "metadata" in mydb.list_collection_names():
    metadata = mydb["metadata"]
    metadata.insert_one({"_id": 0, "query_count": 1})
print("Finished storing all authors")
