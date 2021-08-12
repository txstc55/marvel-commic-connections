import requests
from bs4 import BeautifulSoup
import time
import random
import json


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
                        "https://www.marvel.com/comics/", ""), "characterIDs": [], "cover": ""}
                    comicInd += 1

                    authorP = item.p
                    if authorP != None:
                        authors = item.p.findAll('a')
                        for authorItem in authors:
                            authorURL = authorItem['href'].replace(
                                "https://www.marvel.com/comics/", "")
                            authorName = authorItem.text.strip()
                            if not authorURL in authorInfos:
                                authorInfos[authorURL] = {
                                    "name": authorName, "id": authorInd}
                                authorInd += 1
                            comicInfos[comicTitle]["authorIDs"].append(
                                authorInfos[authorURL]["id"])

                comicBookIDs.append(comicInfos[comicTitle]["id"])
                comicInfos[comicTitle]["characterIDs"].append(
                    characterInfos[character]["id"])

            characterInfos[character]["comicIDs"] = comicBookIDs
            time.sleep(random.random() * 2)

        def getComicCover(comic):
            print(comic)
            comicURL = "https://www.marvel.com/comics/" + comicInfos[comic]["url"]
            print(comicURL)
            comicPage = requests.get(comicURL)
            comicSoup = BeautifulSoup(comicPage.content, "html.parser")
            imgSrc = comicSoup.find("img", {"class": "frame-img"})["src"]
            comicInfos[comic]["cover"] = imgSrc
            print(imgSrc)
        
        from multiprocessing.pool import ThreadPool as Pool
        # from multiprocessing import Pool

        pool_size = 10  # your "parallelness"
        pool = Pool(pool_size)
        for comic in comicInfos:
            pool.apply_async(getComicCover, (comic, ))
            # getComicCover(comic)

        pool.close()
        pool.join()

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


# getInfoToJson()


characterInfos = {}
comicInfos = {}
authorInfos = {}


with open("characters.json", 'r') as outfile:
    characterInfos = json.load(outfile)


with open("comics.json", 'r') as outfile:
    comicInfos = json.load(outfile)

with open("authors.json", 'r') as outfile:
    authorInfos = json.load(outfile)


import pymongo
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["marvel"]

characterCollections = mydb["characters"]
for character in characterInfos:
    characterItem = {"_id": characterInfos[character]["id"], "character_name": character, "url":characterInfos[character]["url"], "comic_ids":list(set(characterInfos[character]["comicIDs"]))}
    characterCollections.insert_one(characterItem)

comicCollections = mydb["comics"]
for comic in comicInfos:
    comicItem = {"_id": comicInfos[comic]["id"],"cover":comicInfos[comic]["cover"], "comic_name": comic, "author_ids": list(set(comicInfos[comic]["authorIDs"])), "url": comicInfos[comic]["url"], "character_ids":list(set(comicInfos[comic]["characterIDs"]))}
    comicCollections.insert_one(comicItem)

authorCollections = mydb["authors"]
for author in authorInfos:
    authorItem = {"_id": authorInfos[author]["id"], "author_name": authorInfos[author]["name"], "url": author}
    authorCollections.insert_one(authorItem)
