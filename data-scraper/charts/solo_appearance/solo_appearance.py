import json
from datetime import datetime
from collections import Counter
from operator import add
import pandas as pd

name_pic_map = {"Thor": "https://static.wikia.nocookie.net/marveldatabase/images/3/3a/Thor_Odinson_%28Earth-TRN517%29_from_Marvel_Contest_of_Champions_001.png",
                "Hulk": "https://static.wikia.nocookie.net/marvel-contestofchampions/images/d/d7/Hulk_portrait.png",
                "Two-Gun Kid": "https://upload.wikimedia.org/wikipedia/en/a/ac/Two-Gun_Kid_01.jpg",
                "Captain America": "https://static.wikia.nocookie.net/marvel-contestofchampions/images/1/1a/Captain_America_featured.png",
                "Sub-Mariner": "https://static.wikia.nocookie.net/marvel-contestofchampions/images/b/b1/Namor_featured.png",
                "Rawhide Kid": "https://static.wikia.nocookie.net/marveldatabase/images/e/ec/Rawhide_Kid_Vol_4_1_Textless.jpg", "Werewolf By Night": "https://static.wikia.nocookie.net/marveldatabase/images/a/ac/Legion_of_Monsters_Werewolf_by_Night_Vol_1_1_Textless.jpg",
                "Dracula": "https://static.wikia.nocookie.net/marveldatabase/images/0/04/Vlad_Dracula_%28Earth-616%29_from_Avengers_Vol_8_45_001.jpg",
                "Doctor Strange": "https://static.wikia.nocookie.net/marvel-contestofchampions/images/8/83/Doctor_Strange_portrait.png",
                "Shang-Chi": "https://static.wikia.nocookie.net/marveldatabase/images/e/e0/Shang-Chi_Vol_1_1_Textless.jpg",
                "Frankenstein's Monster": "https://static.wikia.nocookie.net/marveldatabase/images/0/0f/Frankenstein%27s_Monster_%28Battleworld%29_%28Earth-616%29_from_Fantastic_Four_Vol_1_274.jpg",
                "Millie the Model": "https://static.wikia.nocookie.net/marveldatabase/images/b/b9/Models%2C_Inc._Vol_1_1_page_00_Millicent_Collins_%28Earth-616%29.jpg",
                "Man-Thing": "https://static.wikia.nocookie.net/marveldatabase/images/3/3d/Man-Thing_Vol_5_2_Deodato_Variant_Textless.jpg",
                "Human Torch": "https://static.wikia.nocookie.net/marveldatabase/images/8/88/Fantastic_Four_Vol_6_1_Human_Torch_Variant_Textless.jpg",
                "Morbius": "https://static.wikia.nocookie.net/marveldatabase/images/5/5a/Mobius_M._Mobius_%28Null-Time_Zone%29_from_She-Hulk_Vol_2_3_001.jpg",
                "Iron Man": "https://static.wikia.nocookie.net/marvel-contestofchampions/images/b/b7/Iron_Man_%28Infinity_War%29_portrait.png",
                "Killraven": "https://static.wikia.nocookie.net/marveldatabase/images/a/ac/Jonathan_Raven_%28Earth-691%29_from_All-New_Invaders_Vol_1_12_001.png",
                "Luke Cage": "https://static.wikia.nocookie.net/marveldatabase/images/7/71/Marvel%27s_Voices_Legacy_Vol_1_1_ComicTom101_Exclusive_Variant_Textless.jpg",
                "Hank Pym": "https://static.wikia.nocookie.net/marveldatabase/images/2/25/Avengers_Academy_Vol_1_7_Textless.jpg",
                "Adam Warlock": "https://static.wikia.nocookie.net/marveldatabase/images/f/f0/Adam_Warlock_%28Earth-616%29_from_Infinity_Wars_Infinity_Vol_1_1_001.jpg",
                "Deathlok": "https://static.wikia.nocookie.net/marveldatabase/images/f/fd/All-New_Invaders_Vol_1_9_Textless.png",
                "Daredevil": "https://static.wikia.nocookie.net/marvel-contestofchampions/images/b/b6/Daredevil_%28Classic%29_portrait.png",
                "Captain Britain": "https://pm1.narvii.com/7265/0985a9af4faa35c8afd009b3b86dcf86367d3faar1-250-296v2_128.jpg",
                "Punisher": "https://auntm.ai/resources/ui/uigacha/featured/gachachaseprize_256x256_punisher.png",
                "Deadpool": "https://static.wikia.nocookie.net/marvel-contestofchampions/images/b/b1/Deadpool_portrait.png",
                "Wolverine": "https://static.wikia.nocookie.net/marvel-contestofchampions/images/b/b4/Wolverine_portrait.png",
                "Spider-Girl (May Parker)": "https://pm1.narvii.com/6271/1a306dc0284ecd945405b9c21bdcface991e94df_128.jpg",
                "Silver Surfer": "https://static.wikia.nocookie.net/marvel-contestofchampions/images/d/d7/Silver_Surfer_portrait.png",
                "Menace": "https://static.wikia.nocookie.net/marveldatabase/images/c/ce/Lily_Hollister_%28Earth-616%29_from_AXIS_Hobgoblin_Vol_1_3_001.jpg",
                "Ka-Zar": "https://static.wikia.nocookie.net/marveldatabase/images/5/53/Marvel_Comics_Presents_Vol_2_5_Textless.jpg",
                "Howard The Duck": "https://static.wikia.nocookie.net/marvel-contestofchampions/images/c/cd/Howard_the_Duck_portrait.png",
                "Ghost Rider (Johnny Blaze)": "https://static.wikia.nocookie.net/marvel-contestofchampions/images/e/e5/Ghost_Rider_featured.png",
                "Dazzler": "https://static.wikia.nocookie.net/marveldatabase/images/2/22/Alison_Blaire_%28Earth-616%29_from_Astonishing_X-Men_Vol_4_14_001.jpg",
                "Thing": "https://static.wikia.nocookie.net/marvel-contestofchampions/images/b/b7/Thing_featured.png",
                "She-Hulk (Jennifer Walters)": "https://static.wikia.nocookie.net/marvel-contestofchampions/images/7/74/She-Hulk_featured.png",
                "Quasar (Phyla-Vell)": "https://static.wikia.nocookie.net/marveldatabase/images/b/bf/Phyla-Vell_%28Earth-8096%29_from_Avengers-_Earth%27s_Mightiest_Heroes_%28Animated_Series%29_Season_2_6_001.png",
                "Cable": "https://static.wikia.nocookie.net/marvel-contestofchampions/images/4/49/Cable_portrait.png",
                "Spider-Man (Ultimate)": "https://static.wikia.nocookie.net/marveldatabase/images/8/87/Ultimate_Spider-Man_Vol_1_156_Textless.jpg",
                "Wonder Man": "https://static.wikia.nocookie.net/marveldatabase/images/8/81/Simon_Williams_%28Earth-616%29_from_Uncanny_Avengers_Vol_1_9_0002.png",
                "Black Panther": "https://static.wikia.nocookie.net/marveldatabase/images/e/e4/T%27Challa_%28Earth-616%29_from_Official_Handbook_of_the_Marvel_Universe_Vol_1_2_001.jpg",
                "Spider-Man (Miles Morales)": "https://static.wikia.nocookie.net/marveldatabase/images/0/05/Miles_Morales_%28Earth-1610%29_from_Miles_Morales_Spider-Man_Vol_1_29_001.jpg",
                "Eddie Brock": "https://static.wikia.nocookie.net/marvel-contestofchampions/images/4/4b/Venom_portrait.png",
                }

ban_list = ["Fantastic Four", "Defenders",
            "Invaders", "X-Men", "Exiles", "Avengers", "Thunderbolts", "Alpha Flight", "Power Pack", "New Mutants", "Excalibur", "Generation X", "Guardians of the Galaxy", ]

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
    if (len(comicInfos[item]["characterIDs"]) == 1):
        if year < min_year:
            time_character_map[min_time].append(
                characterIDToName[comicInfos[item]["characterIDs"][0]])
        elif year >= 2021:
            pass
        else:
            time_character_map[datetime(year, month, 1, 0, 0)].append(
                characterIDToName[comicInfos[item]["characterIDs"][0]])

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

df.to_csv("solo_appearance.csv")

# print(df)
# bcr.bar_chart_race(df, "solo_appear.mp4", n_bars=20)
