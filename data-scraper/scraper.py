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
                        "https://www.marvel.com/comics/", ""), "characterIDs": [], "cover": "", "date": "November 30, 2999"}
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
                        date = rawText
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
