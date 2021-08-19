from datetime import datetime
import pymongo
import requests
from bs4 import BeautifulSoup
import time
import random
import json
# months = ["January", "February", "March", "April", "May", "June",
#           "July", "August", "September", "October", "November", "December"]


def getInfoToJson():
    baseURL = "https://www.marvel.com/comics/"
    URL = "https://www.marvel.com/comics/characters"
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, "html.parser")
    listItems = soup.findAll("li")

    characterInfos = {}
    comicInfos = {}
    authorInfos = {}
    urls = []

    # with open("characters.json", 'r') as outfile:
    #     characterInfos = json.load(outfile)

    # with open("comics.json", 'r') as outfile:
    #     comicInfos = json.load(outfile)

    # with open("authors.json", 'r') as outfile:
    #     authorInfos = json.load(outfile)

    characterInd = 0
    comicInd = 0
    authorInd = 0
    for li in listItems:
        link = li.a['href'].replace("/comics/", "")
        name = li.text
        characterInfos[name] = {"comicIDs": [],
                                "url": link, "id": characterInd}
        urls.append(link)
        characterInd += 1

    try:
        for character in characterInfos:
            print(character)
            url = characterInfos[character]["url"]
            trueURL = baseURL + url + "?totalcount=5000"
            page = requests.get(trueURL)
            soup = BeautifulSoup(page.content, "html.parser")
            comicItems = soup.findAll("div", {"class": "comic-item"})

            comicBookIDs = []

            for comic in comicItems:
                item = comic.find("div", {"class": "row-item-text"})
                comicURL = item.h5.a['href']
                comicTitle = item.h5.text.strip()

                if not comicTitle in comicInfos:
                    comicInfos[comicTitle] = {"id": comicInd, "authorIDs": [], "url": comicURL.replace(
                        "https://www.marvel.com/comics/", ""), "characterIDs": [], "cover": "", "date": ""}
                    comicInd += 1

                comicBookIDs.append(comicInfos[comicTitle]["id"])
                comicInfos[comicTitle]["characterIDs"].append(
                    characterInfos[character]["id"])

            characterInfos[character]["comicIDs"] = comicBookIDs
            # time.sleep(random.random() * 2)

        from multiprocessing.pool import ThreadPool as Pool
        tmp_author_array = {}
        for item in comicInfos:
            tmp_author_array[item] = []

        # get comic cover and author
        def getComicDetail(comic):
            comicURL = "https://www.marvel.com/comics/" + \
                comicInfos[comic]["url"]
            # print(comic, comicURL)
            comicPage = requests.get(comicURL)
            comicSoup = BeautifulSoup(comicPage.content, "html.parser")
            imgSrc = comicSoup.find("img", {"class": "frame-img"})["src"]
            comicInfos[comic]["cover"] = imgSrc
            # print(imgSrc)

            detailWrap = comicSoup.findAll("div", {"class": "detail-wrap"})

            # get the authors, creators
            for item in detailWrap:
                authors = item.findAll("a", href=True)
                for author in authors:
                    href = author["href"]
                    name = author.text.strip()
                    if "creators" in href:
                        tmp_author_array[comic].append([href, name])

            featuredItemWrap = comicSoup.find(
                "div", {"class": "featured-item-meta"})
            date = ""
            if featuredItemWrap:
                divs = featuredItemWrap.findAll("div", recursive=False)
                for item in divs:
                    if item.text.strip() != "Published:":
                        rawText = item.text.strip()
                        if rawText.endswith("-0001"):
                            rawText = "November 30, 2999"
                        date = datetime.strptime(rawText, "%B %d, %Y")
                        print(comic, comicURL, date)
            if date == "":
                print(comic, comicURL)
            comicInfos[comic]["date"] = date

        pool_size = 20  # your "parallelness"
        pool = Pool(pool_size)
        for comic in comicInfos:
            pool.apply_async(getComicDetail, (comic, ))

        pool.close()
        pool.join()

        for comic in tmp_author_array:
            item = tmp_author_array[comic]
            authorids = []
            for authors in item:
                link = authors[0].replace("/comics/", "")
                name = authors[1]
                if not link in authorInfos:
                    authorInfos[link] = {"name": name, "id": authorInd}
                    print("Created author: ", name, link, authorInd)
                    authorInd += 1
                authorids.append(authorInfos[link]["id"])
            comicInfos[comic]["authorIDs"] = authorids

    except:
        with open("characters.json", 'w') as outfile:
            json.dump(characterInfos, outfile)

        with open("comics.json", 'w') as outfile:
            json.dump(comicInfos, outfile)

        with open("authors.json", 'w') as outfile:
            json.dump(authorInfos, outfile)

    with open("characters.json", 'w') as outfile:
        json.dump(characterInfos, outfile)

    with open("comics.json", 'w') as outfile:
        json.dump(comicInfos, outfile)

    with open("authors.json", 'w') as outfile:
        json.dump(authorInfos, outfile)


getInfoToJson()


# characterInfos = {}
# comicInfos = {}
# authorInfos = {}


# with open("characters.json", 'r') as outfile:
#     characterInfos = json.load(outfile)


# with open("comics.json", 'r') as outfile:
#     comicInfos = json.load(outfile)

# with open("authors.json", 'r') as outfile:
#     authorInfos = json.load(outfile)


# myclient = pymongo.MongoClient("mongodb://localhost:27017/")
# # myclient.drop_database("marvel")
# mydb = myclient["marvel"]

# characterCollections = mydb["characters"]
# characterCollections.drop()
# characterCollections = mydb["characters"]
# characterIDToName = {}  # record the id to name info

# for character in characterInfos:
#     characterIDToName[characterInfos[character]["id"]] = character
#     characterInfos[character]["relatives"] = 0
#     characterInfos[character]["closest_characters"] = []

# for character in characterInfos:
#     # get the list of comics
#     comics = list(set(characterInfos[character]["comicIDs"]))
#     currentid = characterInfos[character]["id"]  # we want to exclude itself
#     character_appearance = {}
#     for comic in comicInfos:
#         if comicInfos[comic]["id"] in comics:
#             # get all the character ids
#             tmplist = list(set(comicInfos[comic]["characterIDs"]))
#             # for each character, we want to check how many appearance it has
#             for characterid in tmplist:
#                 if characterid != currentid:
#                     if not characterid in character_appearance:
#                         character_appearance[characterid] = 0
#                     character_appearance[characterid] += 1
#     # find the most appearing id
#     maximum = -1
#     maximum_ids = [currentid]
#     for cid in character_appearance:
#         if character_appearance[cid] > maximum:
#             maximum = character_appearance[cid]
#             maximum_ids = [cid]
#         elif character_appearance[cid] == maximum:
#             oldname = characterIDToName[maximum_ids[0]]
#             newname = characterIDToName[cid]
#             new_comic_count = len(
#                 list(set(characterInfos[newname]["comicIDs"])))
#             old_comic_count = len(
#                 list(set(characterInfos[oldname]["comicIDs"])))
#             if (new_comic_count > old_comic_count):
#                 maximum_ids = [cid]
#             elif (new_comic_count == old_comic_count):
#                 maximum_ids.append(cid)

#     for maximum_id in maximum_ids:
#         name = characterIDToName[maximum_id]
#         if maximum_id != currentid:
#             characterInfos[character]["closest_characters"].append(maximum_id)
#             characterInfos[name]["relatives"] += 1


# for character in characterInfos:
#     # we want to see what is the most
#     characterItem = {"_id": characterInfos[character]["id"], "character_name": character, "relatives": characterInfos[character]["relatives"],
#                      "closest_characters": characterInfos[character]["closest_characters"], "url": characterInfos[character]["url"], "comic_ids": list(set(characterInfos[character]["comicIDs"]))}
#     characterCollections.insert_one(characterItem)


# # record for each author, how many comics he takes part in
# author_comic_count = {}
# comicCollections = mydb["comics"]
# comicCollections.drop()
# comicCollections = mydb["comics"]
# for comic in comicInfos:
#     comicItem = {"_id": comicInfos[comic]["id"], "cover": comicInfos[comic]["cover"], "comic_name": comic, "author_ids": list(set(
#         comicInfos[comic]["authorIDs"])), "url": comicInfos[comic]["url"], "character_ids": list(set(comicInfos[comic]["characterIDs"]))}
#     for item in list(set(comicInfos[comic]["authorIDs"])):
#         if not item in author_comic_count:
#             author_comic_count[item] = 0
#         author_comic_count[item] += 1
#     comicCollections.insert_one(comicItem)

# authorCollections = mydb["authors"]
# authorCollections.drop()
# authorCollections = mydb["authors"]


# authorIDToURL = {}
# for item in authorInfos:
#     authorIDToURL[authorInfos[item]["id"]] = item

# author_collaborators = {}
# for item in comicInfos:
#     creators = list(set(comicInfos[item]["authorIDs"]))
#     for cid in creators:
#         if not cid in author_collaborators:
#             author_collaborators[cid] = {}

#         for nid in creators:
#             # author_collaborators[cid][cid] will give us the number
#             # of comics this creator participates in
#             if not nid in author_collaborators[cid]:
#                 author_collaborators[cid][nid] = 0

#             author_collaborators[cid][nid] += 1

# network = {}
# for url in authorInfos:
#     authorInfos[url]["relatives"] = 0
#     authorInfos[url]["closest_authors"] = []

# for key in author_collaborators:
#     value = author_collaborators[key]
#     closest_authors = []
#     maximum_collaborations = -1

#     for cid in value:
#         count = value[cid]
#         if cid != key:
#             # we want to exclude itself
#             if count > maximum_collaborations:
#                 # if has more collaborations
#                 # replace
#                 closest_authors = [cid]
#                 maximum_collaborations = count
#             elif count == maximum_collaborations:
#                 # if number of collaborations is equal
#                 # we want to check the total number of works
#                 # if it has more, then replace
#                 # otherwise, join the list
#                 total_work = author_collaborators[cid][cid]
#                 other_total_work = author_collaborators[closest_authors[0]
#                                                         ][closest_authors[0]]
#                 if total_work > other_total_work:
#                     closest_authors = [cid]
#                 elif total_work == other_total_work:
#                     closest_authors.append(cid)
#     authorInfos[authorIDToURL[key]]["closest_authors"] = closest_authors
#     for cid in closest_authors:
#         # add the relatives
#         authorInfos[authorIDToURL[cid]]["relatives"] += 1


# for author in authorInfos:
#     authorItem = {"_id": authorInfos[author]["id"], "author_name": authorInfos[author]
#                   ["name"], "url": author, "comic_count": author_comic_count[authorInfos[author]["id"]], "relatives": authorInfos[author]["relatives"], "closest_authors": authorInfos[author]["closest_authors"]}
#     authorCollections.insert_one(authorItem)

# if not "metadata" in mydb.list_collection_names():
#     metadata = mydb["metadata"]
#     metadata.insert_one({"_id": 0, "query_count": 1})
