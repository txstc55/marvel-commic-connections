import json
from datetime import datetime
from collections import Counter
from operator import add
import pandas as pd

name_pic_map = {}
with open("../name_pic_map.json", 'r') as outfile:
    name_pic_map = json.load(outfile)

ban_list = ["Fantastic Four", "Defenders",
            "Invaders", "X-Men", "Exiles", "Avengers", "Thunderbolts", "Alpha Flight", "Power Pack", "New Mutants", "Excalibur", "Generation X", "Guardians of the Galaxy", "Patriot"]

characterInfos = {}
comicInfos = {}
min_year = 1975
with open("../../characters.json", 'r') as outfile:
    characterInfos = json.load(outfile)


with open("../../comics.json", 'r') as outfile:
    comicInfos = json.load(outfile)


characterIDToName = {}
for item in characterInfos:
    characterIDToName[characterInfos[item]["id"]] = item


names = []
for i in range(len(characterInfos) + 1):
    names.append("")

for item in characterInfos:
    names[characterInfos[item]["id"]] = item


time_character_map = {}
time_total_count_map = {}
time_total_count_map["image"] = []

for _ in range(len(characterInfos) + 1):
    time_total_count_map["image"].append("")

for item in name_pic_map:
    time_total_count_map["image"][characterInfos[item]
                                  ["id"]] = name_pic_map[item]

for i in range(min_year, 2021):
    for j in range(1, 13):
        time = datetime(i, j, 1, 0, 0)
        time_character_map[time] = []
        time_total_count_map[time] = []
        for _ in range(len(characterInfos) + 1):
            # because marvel created two Jean Greys
            # kinda thought I was fucked with my database
            # but then I checked, apparently
            # one of them is the superset of the other
            # so im fine
            # marvel get your shit together
            time_total_count_map[time].append(0)

min_time = datetime(min_year, 1, 1, 0, 0)
for item in comicInfos:
    time = datetime.strptime(comicInfos[item]["date"], "%B %d, %Y")
    year = time.year
    month = time.month
    if (len(comicInfos[item]["characterIDs"]) > 1):
        if year < min_year:
            for i in range(len(comicInfos[item]["characterIDs"])):
                time_character_map[min_time].append(
                    characterIDToName[comicInfos[item]["characterIDs"][i]])
        elif year >= 2021:
            pass
        else:
            for i in range(len(comicInfos[item]["characterIDs"])):
                time_character_map[datetime(year, month, 1, 0, 0)].append(
                    characterIDToName[comicInfos[item]["characterIDs"][i]])

    # print(year, month)
    # print(datetime.strptime(comicInfos[item]["date"], "%B %d, %Y").month)


# list(map(add, l1, l2))
last_month = min_time
for i in range(min_year, 2021):
    for j in range(1, 13):
        current_time = datetime(i, j, 1, 0, 0)
        counts = Counter(time_character_map[current_time])
        for character in counts:
            if not character in ban_list:
                time_total_count_map[current_time][characterInfos[character]
                                                   ["id"]] = counts[character]
        if i == min_year and current_time.month == 1:
            pass
        else:
            time_total_count_map[current_time] = list(
                map(add, time_total_count_map[current_time], time_total_count_map[last_month]))
        last_month = current_time
        # print(time_total_count_map[current_time])

df = pd.DataFrame.from_dict(
    time_total_count_map, orient="index", columns=names)

df = df.T


new_header = []


for item in df.columns:
    if item == "image":
        new_header.append("image")
    else:
        year = item.year
        month = item.month
        new_format = item.strftime("%Y-%b")
        new_header.append(new_format)
        # print(new_format)

df.columns = new_header

df.to_csv("co_appearance.csv")

# print(df)
# bcr.bar_chart_race(df, "solo_appear.mp4", n_bars=20)
