import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const port = process.env.PORT || 5000; // the port we will be using
const api_url = "http://localhost:" + port + "/"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    characterNameAndID: { 'A-Bomb (HAS)': 0, 'A.I.M.': 1, 'Aaron Stack': 2, 'Abomination (Emil Blonsky)': 3, 'Abomination (Ultimate)': 4, 'Absorbing Man': 5, 'Abyss': 6, 'Abyss (Age of Apocalypse)': 7, 'Adam Destine': 8, 'Adam Warlock': 9, 'Aegis (Trey Rollins)': 10, 'Agent Brand': 11, 'Agent X (Nijo)': 12, 'Agent Zero': 13, 'Agents of Atlas': 14, 'Aginar': 15, 'Air-Walker (Gabriel Lan)': 16, 'Ajak': 17, 'Ajaxis': 18, 'Akemi': 19, 'Alain': 20, 'Albert Cleary': 21, 'Albion': 22, 'Alex Power': 23, 'Alex Wilder': 24, 'Alexa Mendez': 25, 'Alexander Pierce': 26, 'Alice': 27, 'Alicia Masters': 28, 'Alpha Flight': 29, 'Alpha Flight (Ultimate)': 30, 'Alvin Maker': 31, 'Amadeus Cho': 32, 'Amanda Sefton': 33, 'Amazoness': 34, 'American Eagle (Jason Strongbow)': 35, 'Amiko': 36, 'Amora': 37, 'Amphibian (Earth-712)': 38, 'Amun': 39, 'Ancient One': 40, 'Ancient One (Ultimate)': 41, 'Angel (Thomas Halloway)': 42, 'Angel (Ultimate)': 43, 'Angel (Warren Worthington III)': 44, 'Angela (Aldrif Odinsdottir)': 45, 'Anita Blake': 46, 'Anne Marie Hoag': 47, 'Annihilus': 48, 'Anole': 49, "Ant-Man (Eric O'Grady)": 50, 'Ant-Man (Scott Lang)': 51, 'Anthem': 52, 'Apocalypse': 53, 'Apocalypse (Ultimate)': 54, 'Aqueduct': 55, 'Arachne': 56, 'Araña': 57, 'Arcade': 58, 'Arcana': 59, 'Archangel': 60, 'Arclight': 61, 'Ares': 62, 'Argent': 63, 'Armadillo': 64, 'Armor (Hisako Ichiki)': 65, 'Armory': 66, 'Arnim Zola': 67, 'Arsenic': 68, 'Artiee': 69, 'Asgardian': 70, 'Askew-Tronics': 71, 'Asylum': 72, 'Atlas (Team)': 73, 'Aurora': 74, 'Avalanche': 75, 'Avengers': 76, 'Avengers (Ultimate)': 77, 'Azazel (Mutant)': 78, 'Banshee': 79, 'Banshee (Theresa Rourke)': 80, 'Baron Strucker': 81, 'Baron Zemo (Heinrich Zemo)': 82, 'Baron Zemo (Helmut Zemo)': 83, "Baroness S'Bak": 84, 'Barracuda': 85, 'Bart Rozum': 86, 'Bastion': 87, 'Batroc the Leaper': 88, 'Battering Ram': 89, 'Beak': 90, 'Beast': 91, 'Beast (Earth-311)': 92, 'Beast (Ultimate)': 93, 'Becatron': 94, 'Bedlam': 95, 'Beef': 96, 'Beetle (Abner Jenkins)': 97, 'Ben Grimm': 98, 'Ben Parker': 99, 'Ben Reilly': 100, 'Ben Urich': 101, 'Bengal': 102, 'Beta-Ray Bill': 103, 'Betty Brant': 104, 'Betty Ross': 105, 'Beyonder': 106, 'Bi-Beast': 107, 'Big Bertha': 108, 'Big Wheel': 109, 'Bill Hollister': 110, 'Bishop': 111, 'Bishop (Ultimate)': 112, 'Black Bird': 113, 'Black Bolt': 114, 'Black Bolt (Marvel War of Heroes)': 115, 'Black Cat': 116, 'Black Cat (Ultimate)': 117, 'Black Crow': 118, 'Black Knight (Sir Percy of Scandia)': 119, 'Black Panther': 120, 'Black Panther (Ultimate)': 121, 'Black Queen': 122, 'Black Tarantula': 123, 'Black Tom': 124, 'Black Widow': 125, 'Black Widow (LEGO Marvel Super Heroes)': 126, 'Black Widow (Ultimate)': 127, 'Black Widow/Natasha Romanoff (MAA)': 128, 'Blackheart': 129, 'Blacklash': 130, 'Blackout': 131, 'Blade': 132, 'Blastaar': 133, 'Blazing Skull': 134, 'Blindfold': 135, 'Blink': 136, 'Blizzard': 137, 'Blob': 138, 'Blob (Ultimate)': 139, 'Blockbuster': 140, 'Blok': 141, 'Bloke': 142, 'Blonde Phantom': 143, 'Bloodaxe': 144, 'Bloodscream': 145, 'Bloodstorm': 146, 'Bloodstrike': 147, 'Blue Blade': 148, 'Blue Marvel': 149, 'Blue Shield': 150, 'Blur': 151, 'Bob, Agent of Hydra': 152, 'Boom Boom': 153, 'Boomer': 154, 'Boomerang': 155, 'Box': 156, 'Bride of Nine Spiders (Immortal Weapons)': 157, 'Bromley': 158, 'Brood': 159, 'Brother Voodoo': 160, 'Brotherhood of Evil Mutants': 161, 'Brotherhood of Mutants (Ultimate)': 162, 'Bruce Banner': 163, 'Brute': 164, 'Bucky': 165, 'Bug': 166, 'Bulldozer': 167, 'Bullseye': 168, 'Bushwacker': 169, 'Butterfly': 170, 'Cable': 171, 'Cable (Deadpool)': 172, 'Cable (Marvel: Avengers Alliance)': 173, 'Cable (Ultimate)': 174, 'Cable (X-Men: Battle of the Atom)': 175, 'Calamity': 176, 'Caliban': 177, 'Callisto': 178, 'Callisto (Age of Apocalypse)': 179, 'Calypso': 180, 'Cammi': 181, 'Cannonball': 182, "Cap'n Oz": 183, 'Captain America': 184, 'Captain America (House of M)': 185, 'Captain America (LEGO Marvel Super Heroes)': 186, 'Captain America (Marvel War of Heroes)': 187, 'Captain America (Sam Wilson)': 188, 'Captain America (Ultimate)': 189, 'Captain America/Steve Rogers (MAA)': 190, 'Captain Britain': 191, 'Captain Britain (Ultimate)': 192, 'Captain Cross': 193, 'Captain Flint': 194, 'Captain Marvel (Carol Danvers)': 195, 'Captain Marvel (Genis-Vell)': 196, 'Captain Marvel (Mar-Vell)': 197, 'Captain Marvel (Monica Rambeau)': 198, 'Captain Marvel (Phyla-Vell)': 199, 'Captain Midlands': 200, 'Captain Stacy': 201, 'Captain Universe': 202, 'Cardiac': 203, 'Caretaker': 204, 'Cargill': 205, 'Carlie Cooper': 206, 'Carmella Unuscione': 207, 'Carnage': 208, 'Carnage (Ultimate)': 209, 'Carol Danvers': 210, 'Carol Hines': 211, 'Cassandra Nova': 212, 'Catseye': 213, 'Cecilia Reyes': 214, 'Celestials': 215, 'Centennial': 216, 'Centurions': 217, 'Cerebro': 218, 'Cerise': 219, "Ch'od": 220, 'Chamber': 221, 'Chameleon': 222, 'Champions': 223, 'Changeling': 224, 'Charles Xavier': 225, 'Charlie Campion': 226, 'Chase Stein': 227, 'Chat': 228, 'Chimera': 229, 'Chores MacGillicudy': 230, 'Christian Walker': 231, 'Chronomancer': 232, 'ClanDestine': 233, 'Clea': 234, 'Clea (Ultimate)': 235, 'Clint Barton': 236, 'Cloak': 237, 'Cloud 9': 238, 'Cobalt Man': 239, 'Colleen Wing': 240, 'Colonel America': 241, 'Colossus': 242, 'Colossus (Ultimate)': 243, 'Confederates of the Curious': 244, 'Constrictor': 245, 'Contessa (Vera Vidal)': 246, 'Controller': 247, 'Cornelius': 248, 'Corsair': 249, 'Cosmo (dog)': 250, 'Cottonmouth': 251, 'Count Nefaria': 252, 'Countess': 253, 'Crimson Crusader': 254, 'Crimson Dynamo': 255, 'Crimson Dynamo (Iron Man 3 - The Official Game)': 256, 'Crimson King': 257, 'Crossbones': 258, 'Crule': 259, 'Crusher Hogan': 260, 'Crusher Hogan (Ultimate)': 261, 'Crystal': 262, 'Cuckoo': 263, 'Curt Conners': 264, 'Cuthbert': 265, 'Cyber': 266, 'Cyclops': 267, 'Cyclops (Ultimate)': 268, 'Cyclops (X-Men: Battle of the Atom)': 269, 'Cypher': 270, "D'Ken Neramani": 271, 'Dagger': 272, 'Daily Bugle': 273, 'Daimon Hellstrom': 274, 'Daken': 275, 'Dakota North': 276, 'Damage Control': 277, 'Dani Moonstar': 278, 'Danny Rand': 279, 'Daredevil': 280, 'Daredevil (LEGO Marvel Super Heroes)': 281, 'Daredevil (Marvel Heroes)': 282, 'Daredevil (Ultimate)': 283, 'Dargo Ktor': 284, 'Dark Avengers': 285, 'Dark Beast': 286, 'Dark Phoenix': 287, 'Dark X-Men': 288, 'Darkhawk': 289, 'Darkstar': 290, 'Darwin': 291, 'Dazzler': 292, 'Dazzler (Ultimate)': 293, 'Deacon Frost': 294, 'Dead Girl': 295, 'Deadpool': 296, 'Deadpool (Deadpool)': 297, 'Deadpool (LEGO Marvel Super Heroes)': 298, 'Deadpool (X-Men: Battle of the Atom)': 299, 'Death': 300, 'Deathbird': 301, 'Deathcry': 302, 'Deathlok': 303, 'Deathstrike (Ultimate)': 304, 'Debra Whitman': 305, 'Debrii': 306, 'Deena Pilgrim': 307, 'Defenders': 308, 'Demogoblin': 309, 'Destiny': 310, 'Detective Soap': 311, 'Deviants': 312, 'Devil Dinosaur (Devil Dinosaur)': 313, 'Devil Dinosaur (HAS)': 314, 'Devos': 315, 'Dexter Bennett': 316, 'Diablo': 317, 'Diamondback (Rachel Leighton)': 318, 'Dinah Soar': 319, 'Dirk Anger': 320, 'Doc Samson': 321, 'Doctor Doom': 322, 'Doctor Doom (Ultimate)': 323, 'Doctor Faustus': 324, 'Doctor Octopus': 325, 'Doctor Octopus (Ultimate)': 326, 'Doctor Spectrum': 327, 'Doctor Strange': 328, 'Doctor Strange (Ultimate)': 329, 'Dog Brother #1': 330, 'Domino': 331, 'Donald Blake': 332, 'Doomsday Man': 333, 'Doop': 334, 'Doorman': 335, 'Dorian Gray': 336, 'Dormammu': 337, 'Dormammu (Ultimate)': 338, 'Dr. Strange (Marvel: Avengers Alliance)': 339, 'Dracula': 340, 'Dragon Lord': 341, 'Dragon Man': 342, 'Drax': 343, 'Dreadnoughts': 344, 'Dreaming Celestial': 345, 'Druig': 346, 'Dum Dum Dugan': 347, 'Dust': 348, 'Earthquake': 349, 'Echo': 350, 'Eddie Brock': 351, 'Eddie Lau': 352, 'Edward "Ted" Forrester': 353, 'Edwin Jarvis': 354, 'Ego': 355, 'Electro': 356, 'Electro (Ultimate)': 357, 'Elektra': 358, 'Elektra (Ultimate)': 359, 'Elements of Doom': 360, 'Elite': 361, 'Elixir': 362, 'Elloe Kaifi': 363, 'Elsa Bloodstone': 364, 'Emma Frost': 365, 'Empath': 366, 'Emplate': 367, 'Enchantress (Amora)': 368, 'Enchantress (Sylvie Lushton)': 369, 'Ender Wiggin': 370, 'Energizer': 371, 'Epoch': 372, 'Erik the Red': 373, 'Eternals': 374, 'Eternity': 375, 'Excalibur': 376, 'Exiles': 377, 'Exodus': 378, 'Expediter': 379, 'Ezekiel': 380, 'Ezekiel Stane': 381, 'Fabian Cortez': 382, 'Falcon': 383, 'Falcon/Sam Wilson (MAA)': 384, 'Fallen One': 385, 'Famine': 386, 'Fantastic Four': 387, 'Fantastic Four (Ultimate)': 388, 'Fantastick Four': 389, 'Fantomex': 390, 'Fat Cobra': 391, 'Felicia Hardy': 392, 'Fenris': 393, 'Feral': 394, 'Fin Fang Foom': 395, 'Firebird': 396, 'Firebrand': 397, 'Firedrake': 398, 'Firelord': 399, 'Firestar': 400, 'Firestar (Ultimate)': 401, 'Fixer (Paul Norbert Ebersol)': 402, 'Flatman': 403, 'Flying Dutchman': 404, 'Foggy Nelson': 405, 'Force Works': 406, 'Forearm': 407, 'Forge': 408, 'Forge (Ultimate)': 409, 'Forgotten One': 410, 'Frank Castle': 411, "Frankenstein's Monster": 412, 'Franklin Richards': 413, 'Franklin Storm': 414, 'Freak': 415, 'Frightful Four': 416, 'Frog Thor': 417, 'Frog-Man': 418, 'Gabe Jones': 419, 'Galactus': 420, 'Galia': 421, 'Gambit': 422, 'Gamma Corps': 423, 'Gamora': 424, 'Gamora (Marvel War of Heroes)': 425, 'Gargoyle': 426, 'Gargoyle (Yuri Topolov)': 427, 'Garia': 428, 'Garrison Kane': 429, 'Gateway': 430, 'Gauntlet (Joseph Green)': 431, 'Geiger': 432, 'Gene Sailors': 433, 'Generation X': 434, 'Genesis': 435, 'Genis-Vell': 436, 'George Stacy (Ultimate)': 437, 'Gertrude Yorkes': 438, 'Ghost Rider (Daniel Ketch)': 439, 'Ghost Rider (Johnny Blaze)': 440, 'Ghost Rider (Marvel War of Heroes)': 441, 'Giant Girl': 442, 'Giant Man': 443, 'Giant-dok': 444, 'Giant-Man (Ultimate)': 445, 'Gideon': 446, 'Git Hoskins': 447, 'Gladiator (Kallark)': 448, 'Gladiator (Melvin Potter)': 449, 'Glenn Talbot': 450, 'Glorian': 451, 'Goblin Queen': 452, 'Golden Guardian': 453, 'Goliath (Bill Foster)': 454, 'Gorgon': 455, 'Gorilla Man': 456, 'Grandmaster': 457, 'Gravity': 458, 'Great Lakes Avengers': 459, 'Green Goblin (Barry Norman Osborn)': 460, 'Green Goblin (Harry Osborn)': 461, 'Green Goblin (Ultimate)': 462, 'Gressill': 463, 'Grey Gargoyle': 464, 'Greymalkin': 465, 'Grim Reaper': 466, 'Groot': 467, 'Guardian': 468, 'Guardians of the Galaxy': 469, 'Guardsmen': 470, 'Gunslinger': 471, 'GW Bridge': 472, 'Gwen Stacy': 473, 'Gwen Stacy (Ultimate)': 474, 'H.A.M.M.E.R.': 475, 'H.E.R.B.I.E.': 476, 'Hairball': 477, 'Half-Life (Tony Masterson)': 478, 'Hammerhead': 479, 'Hammerhead (Ultimate)': 480, 'Hank Pym': 481, 'Hannibal King': 482, 'Happy Hogan': 483, 'Hardball': 484, 'Harley Davidson Cooper': 485, 'Harpoon': 486, 'Harrier': 487, 'Harry Heck': 488, 'Harry Osborn': 489, 'Harry Osborn (Ultimate)': 490, 'Hate-Monger (Adolf Hitler)': 491, 'Havok': 492, 'Hawkeye': 493, 'Hawkeye (Kate Bishop)': 494, 'Hawkeye (Marvel Heroes)': 495, 'Hawkeye (Ultimate)': 496, 'Hawkeye/Clint Barton (MAA)': 497, 'Hedge Knight': 498, 'Hellcat (Patsy Walker)': 499, 'Hellfire Club': 500, 'Hellfire Club (Ultimate)': 501, 'Hellion': 502, 'Hellions (Squad)': 503, 'Hemingway': 504, 'Henry Peter Gyrich': 505, 'Hepzibah': 506, 'Hercules': 507, 'Heroes For Hire': 508, 'Hex': 509, 'High Evolutionary': 510, 'Hindsight Lad': 511, 'Hiroim': 512, 'Hitman': 513, 'Hitomi Sakuma': 514, 'Hobgoblin (Jason Macendale)': 515, 'Hobgoblin (Robin Borne)': 516, 'Hobgoblin (Roderick Kingsley)': 517, 'Holocaust (Age of Apocalypse)': 518, 'Holy': 519, 'Hope Summers': 520, 'Howard Saint': 521, 'Howard The Duck': 522, 'Hulk': 523, 'Hulk (HAS)': 524, 'Hulk (LEGO Marvel Super Heroes)': 525, 'Hulk (Marvel Zombies)': 526, 'Hulk (Marvel: Avengers Alliance)': 527, 'Hulk (Ultimate)': 528, 'Hulk-dok': 529, 'Hulk/Bruce Banner (MAA)': 530, 'Hulkling': 531, 'Human Cannonball': 532, 'Human Fly (Richard Deacon)': 533, 'Human Robot': 534, 'Human Torch': 535, 'Human Torch (Jim Hammond)': 536, 'Human Torch (Ultimate)': 537, 'Humbug': 538, 'Husk': 539, 'Hussar': 540, 'Hydra': 541, 'Hydro-Man': 542, 'Hyperion (Earth-712)': 543, 'Hypno-Hustler': 544, 'Iceman': 545, 'Iceman (Ultimate)': 546, 'Iceman (X-Men: Battle of the Atom)': 547, 'Ikaris': 548, 'Illuminati': 549, 'Ilyana Rasputin': 550, 'Imp': 551, 'Imperfects': 552, 'Imperial Guard': 553, 'Impossible Man': 554, 'In-Betweener': 555, 'Inertia': 556, 'Infant Terrible': 557, 'Inhumans': 558, 'Ink': 559, 'Invaders': 560, 'Invisible Woman': 561, 'Invisible Woman (Marvel: Avengers Alliance)': 562, 'Invisible Woman (Ultimate)': 563, 'Iron Cross Army': 564, 'Iron Fist (Bei Bang-Wen)': 565, 'Iron Fist (Danny Rand)': 566, 'Iron Fist (Orson Randall)': 567, 'Iron Fist (Quan Yaozu)': 568, 'Iron Fist (USM)': 569, 'Iron Fist (Wu Ao-Shi)': 570, 'Iron Lad': 571, 'Iron Man': 572, 'Iron Man (Iron Man 3 - The Official Game)': 573, 'Iron Man (LEGO Marvel Super Heroes)': 574, 'Iron Man (Marvel Heroes)': 575, 'Iron Man (Marvel War of Heroes)': 576, 'Iron Man (Ultimate)': 577, 'Iron Man/Tony Stark (MAA)': 578, 'Iron Monger': 579, 'Iron Patriot': 580, 'Iron Patriot (James Rhodes)': 581, 'Ironclad': 582, 'J. Jonah Jameson': 583, 'Jack Flag': 584, 'Jack Murdock': 585, "Jack O' Lantern": 586, 'Jack Power': 587, 'Jackal': 588, 'Jackpot': 589, 'James Buchanan Barnes': 590, 'James Howlett': 591, 'Jamie Braddock': 592, 'Jane Foster': 593, 'Janus, the Nega-Man': 594, 'Jasper Sitwell': 595, 'Jazinda': 596, 'Jean Grey': 598, 'Jean Grey (Ultimate)': 599, 'Jennifer Smith': 600, 'Jeryn Hogarth': 601, 'Jessica Drew': 602, 'Jessica Jones': 603, 'Jetstream': 604, 'Jigsaw': 605, 'Jimmy Woo': 606, 'Joan the Mouse': 607, 'Jocasta': 608, 'John Farson': 609, 'John Jameson': 610, 'John Porter': 611, 'John Wraith': 612, 'Johnny Blaze': 613, 'Johnny Storm': 614, 'Joseph': 615, 'Joshua Kane': 616, 'Josiah X': 617, 'Joystick': 618, 'Jubilee': 619, 'Jubilee (Age of Apocalypse)': 620, 'Juggernaut': 621, 'Jule Carpenter': 622, 'Julian Keller': 623, 'Junta': 624, 'Justice': 625, 'Justin Hammer': 626, 'Ka-Zar': 627, 'Kabuki': 628, 'Kang': 629, "Karen O'Malley": 630, 'Karen Page': 631, 'Karma': 632, 'Karnak': 633, 'Karolina Dean ': 634, 'Kat Farrell': 635, 'Kate Bishop': 636, 'Katie Power': 637, 'Ken Ellis': 638, 'Khan': 639, 'Kid Colt': 640, 'Killer Shrike': 641, 'Killmonger': 642, 'Killraven': 643, 'King Bedlam': 644, 'King Cobra': 645, 'Kingpin': 646, 'Kinsey Walden': 647, 'Kitty Pryde': 648, 'Kitty Pryde (X-Men: Battle of the Atom)': 649, 'Klaw': 650, 'Komodo (Melati Kusuma)': 651, 'Korath': 652, 'Korg': 653, 'Korvac': 654, 'Kraven the Hunter': 655, 'Kree': 656, 'Krista Starr': 657, 'Kronos': 658, 'Kulan Gath': 659, 'Kylun': 660, 'La Nuit': 661, 'Lady Bullseye': 662, 'Lady Deathstrike': 663, 'Lady Mastermind': 664, 'Lady Ursula': 665, 'Lady Vermin': 666, 'Lake': 667, 'Landau': 668, 'Lava-Man': 669, 'Layla Miller': 670, 'Leader': 671, 'Leech': 672, 'Legion': 673, 'Lei Kung, The Thunderer': 674, 'Lenny Balinger': 675, 'Leo (Zodiac)': 676, 'Leopardon': 677, 'Leper Queen': 678, 'Lester': 679, 'Lethal Legion': 680, 'Lieutenant Marcus Stone': 681, 'Lifeguard': 682, 'Lightning Lords of Nepal': 683, 'Lightspeed': 684, 'Lila Cheney': 685, 'Lilandra': 686, 'Lilith': 687, 'Lily Hollister': 688, 'Lionheart': 689, 'Living Lightning': 690, 'Living Mummy': 691, 'Living Tribunal': 692, 'Liz Osborn': 693, 'Lizard': 694, 'Lizard (Ultimate)': 695, 'Loa': 696, 'Lockheed': 697, 'Lockjaw': 698, 'Logan': 699, 'Loki': 700, 'Loki (LEGO Marvel Super Heroes)': 701, 'Loners': 702, 'Longshot': 703, 'Longshot (Ultimate)': 704, 'Lord Hawal': 705, 'Lord Tyger': 706, 'Lords of Avalon': 707, 'Lorna Dane': 708, 'Luckman': 709, 'Lucky Pierre': 710, 'Lucy in the Sky': 711, 'Luke Cage': 712, 'Luminals': 713, 'Lyja': 714, 'M (Monet St. Croix)': 715, 'M.O.D.A.M.': 716, 'M.O.D.O.G.': 717, 'M.O.D.O.K.': 718, 'M.O.D.O.K. (Iron Man 3 - The Official Game)': 719, 'Ma Gnuci': 720, 'Mac Gargan': 721, 'Mach IV': 722, 'Machine Man': 723, 'Mad Thinker': 724, 'Madame Hydra': 725, 'Madame Masque': 726, 'Madame Web (Julia Carpenter)': 727, 'Maddog': 728, 'Madelyne Pryor': 729, 'Madripoor': 730, 'Madrox': 731, 'Maelstrom': 732, 'Maestro': 733, 'Magdalene': 734, 'Maggott': 735, 'Magik (Amanda Sefton)': 736, 'Magik (Illyana Rasputin)': 737, 'Maginty': 738, 'Magma (Amara Aquilla)': 739, 'Magneto': 740, 'Magneto (Age of Apocalypse)': 741, 'Magneto (House of M)': 742, 'Magneto (Ultimate)': 743, 'Magneto (X-Men: Battle of the Atom)': 744, 'Magus (Adam Warlock)': 745, 'Magus (Technarch)': 746, 'Major Mapleleaf': 747, 'Makkari': 748, 'Malcolm Colcord': 749, 'Malice (Earth-161)': 750, 'Man-Thing': 751, 'Man-Wolf': 752, 'Mandarin': 753, 'Mandrill': 754, 'Mandroid': 755, 'Manta': 756, 'Mantis': 757, 'Marauders': 758, 'Marcus Van Sciver': 759, 'Maria Hill': 760, 'Mariko Yashida': 761, 'Marrow': 762, 'Marten Broadcloak': 763, 'Martin Li': 764, 'Marvel Apes': 765, 'Marvel Boy': 766, 'Marvel Zombies': 767, 'Marvex': 768, 'Mary Jane Watson': 769, 'Mary Jane Watson (House of M)': 770, 'Mary Jane Watson (Ultimate)': 771, 'Masked Marvel (Unrevealed)': 772, 'Masque': 773, 'Master Chief': 774, 'Master Mold': 775, 'Mastermind': 776, 'Masters of Evil': 777, 'Mathemanic': 778, "Matsu'o Tsurayaba": 779, 'Matthew Murdock': 780, 'Mattie Franklin': 781, 'Mauler': 782, 'Maverick (Chris Bradley)': 783, 'Maverick (Christoph Nord)': 784, 'Maximus': 785, 'May Parker': 786, 'Medusa': 787, 'Meggan': 788, 'Meltdown': 789, 'Menace': 790, 'Mentallo': 791, 'Mentor': 792, 'Mephisto': 793, 'Mephistopheles': 794, 'Mercury': 795, 'Mesmero': 796, 'Metal Master': 797, 'Meteorite': 798, 'MI: 13': 799, 'Micro/Macro': 800, 'Microbe': 801, 'Microchip': 802, 'Micromax': 803, 'Midnight (Earth-811)': 804, 'Miek': 805, 'Mikhail Rasputin': 806, 'Millenium Guard': 807, 'Millie the Model': 808, 'Mimic': 809, 'Mindworm': 810, 'Miracleman': 811, 'Miss America': 812, 'Mister Fear': 813, 'Mister Sinister': 814, 'Mister Sinister (Deadpool)': 815, 'Mister Sinister (House of M)': 816, 'Mister Sinister (Ultimate)': 817, 'Misty Knight': 818, 'Mockingbird': 819, 'Moira MacTaggert': 820, 'Moira MacTaggert (Ultimate)': 821, 'Mojo': 822, 'Mole Man': 823, 'Molecule Man': 824, 'Molly Hayes': 825, 'Molly Von Richtofen': 826, 'Molten Man': 827, 'Mongoose': 828, 'Mongu (Unrevealed)': 829, 'Monster Badoon': 830, 'Moon Girl (Lunella Layfayette)': 831, 'Moon Knight': 832, 'Moon Knight (House of M)': 833, 'Moon Knight (Ultimate)': 834, 'Moondragon': 835, 'Moonstone': 836, 'Morbius': 837, 'Mordo': 838, 'Morg': 839, 'Morgan Stark': 840, 'Morlocks': 841, 'Morlun': 842, 'Morph': 843, 'Mother Askani': 844, 'Mr. Bumpo': 845, 'Mr. Fantastic': 846, 'Mr. Fantastic (Ultimate)': 847, 'Mr. Fish': 848, 'Mr. Fixit': 849, 'Mr. Hyde': 850, 'Mr. Immortal': 851, 'Mr. Meugniot': 852, 'Mr. Negative': 853, 'Mr. Payback': 854, 'Mr. X': 855, 'Ms. Marvel (Kamala Khan)': 856, 'MS2': 857, 'Mulholland Black': 858, 'Multiple Man': 859, 'MVP': 860, 'Mysterio': 861, 'Mysterio (Daniel Berkhart)': 862, 'Mysterio (Francis Klum)': 863, 'Mystique': 864, 'Mystique (Age of Apocalypse)': 865, 'Mystique (House of M)': 866, 'Mystique (Ultimate)': 867, 'Nakia (Nakia)': 868, 'Namor': 869, 'Namora': 870, 'Namorita': 871, 'Naoko': 872, 'Natasha Romanoff': 873, 'Nebula': 874, 'Nehzno': 875, 'Nekra': 876, 'Nemesis': 877, 'Network': 878, 'New Goblin': 879, 'New Mutants': 880, 'New Warriors': 881, 'New X-Men': 882, 'Newton Destine': 883, 'Next Avengers': 884, 'Nextwave': 885, 'Nick Fury': 886, 'Nick Fury (LEGO Marvel Super Heroes)': 887, 'Nick Fury (Ultimate)': 888, 'Nico Minoru': 889, 'Nicolaos': 890, 'Night Nurse (Earth-9997)': 891, 'Night Thrasher': 892, 'Night Thrasher (Dwayne Taylor)': 893, 'Nightcrawler': 894, 'Nightcrawler (Ultimate)': 895, 'Nighthawk': 896, 'Nightmare': 897, 'Nightshade': 898, 'Nine-Fold Daughters of Xao': 899, 'Nitro': 900, 'Nocturne': 901, 'Nomad': 902, 'Nomad (Rikki Barnes)': 903, 'Nomad (Steve Rogers)': 904, 'Norman Osborn': 905, 'Norrin Radd': 906, 'Northstar': 907, 'Nova': 908, 'Nova (Frankie Raye)': 909, 'Nova (Sam Alexander)': 910, 'Nova (USM)': 911, 'Nuke': 912, 'Obadiah Stane': 913, 'Odin': 914, 'Ogun': 915, 'Okoye': 916, 'Old Lace': 917, 'Omega Flight': 918, 'Omega Red': 919, 'Omega Sentinel': 920, 'Omega the Unknown': 921, 'Onslaught': 922, 'Onslaught (Ultimate)': 923, 'Oracle': 924, 'Ord': 925, 'Orphan': 926, 'Orphan-Maker': 927, 'Otto Octavius': 928, 'Outlaw Kid': 929, 'Overlord': 930, 'Owl': 931, 'Ozymandias': 932, 'Paibok': 933, 'Paladin': 934, 'Pandemic': 935, 'Paper Doll': 936, 'Patch': 937, 'Patriot': 938, 'Payback': 939, 'Penance (Robert Baldwin)': 940, 'Pepper Potts': 941, 'Pestilence': 942, 'Pet Avengers': 943, 'Pete Wisdom': 944, 'Peter Parker': 945, 'Peter Quill': 946, 'Phalanx': 947, 'Phantom Reporter': 948, 'Phil Coulson (Phil Coulson)': 949, 'Phil Sheldon': 950, 'Photon': 951, 'Phyla-Vell': 952, 'Piledriver': 953, 'Pip': 954, 'Pixie': 955, 'Plazm': 956, 'Polaris': 957, 'Post': 958, 'Power Man (USM)': 959, 'Power Pack': 960, 'Praxagora': 961, 'Preak': 962, 'Pretty Boy': 963, 'Pride': 964, 'Prima': 965, 'Prince of Orphans': 966, 'Princess Powerful': 967, 'Prism': 968, 'Prodigy': 969, 'Proemial Gods': 970, 'Professor Monster': 971, 'Professor X': 972, 'Professor X (Ultimate)': 973, 'Proteus': 974, 'Proteus (House of M)': 975, 'Proteus (Ultimate)': 976, 'Proudstar': 977, 'Prowler': 978, 'Prowler (Rick Lawson)': 979, 'Psycho-Man': 980, 'Psylocke': 981, 'PsyNapse': 982, 'Puck': 983, 'Puck (Zuzha Yu)': 984, 'Puff Adder': 985, 'pug': 986, 'Puma': 987, 'Punisher': 988, 'Punisher (2099)': 989, 'Punisher (Marvel: Avengers Alliance)': 990, 'Puppet Master': 991, 'Purifiers': 992, 'Purple Man': 993, 'Pyro': 994, 'Quake (Daisy Johnson)': 995, 'Quasar (Phyla-Vell)': 996, 'Quasar (Wendell Vaughn)': 997, 'Quasimodo': 998, 'Queen Noir': 999, 'Quentin Quire': 1000, 'Quicksilver': 1001, 'Quicksilver (Age of Apocalypse)': 1002, 'Quicksilver (Ultimate)': 1003, 'Rachel Grey': 1004, 'Radioactive Man': 1005, 'Rafael Vega': 1006, 'Rage': 1007, 'Raider': 1008, 'Randall': 1009, 'Randall Flagg': 1010, 'Random': 1011, 'Rattler': 1012, 'Ravenous': 1013, 'Rawhide Kid': 1014, 'Raza': 1015, 'Reaper': 1016, 'Reavers': 1017, 'Reavers (Ultimate)': 1018, 'Red 9': 1019, 'Red Ghost': 1020, 'Red Ghost (Ultimate)': 1021, 'Red Hulk': 1022, 'Red Hulk (HAS)': 1023, 'Red She-Hulk': 1024, 'Red Shift': 1025, 'Red Skull': 1026, 'Red Skull (Albert Malik)': 1027, 'Red Wolf': 1028, 'Redwing': 1029, 'Reptil': 1030, 'Retro Girl': 1031, 'Revanche': 1032, 'Rhino': 1033, 'Rhodey': 1034, 'Richard Fisk': 1035, 'Rick Jones': 1036, 'Rick Jones (Ultimate)': 1037, 'Ricochet': 1038, 'Rictor': 1039, 'Riptide': 1040, 'Risque': 1041, 'Robbie Robertson': 1042, 'Robert Baldwin ': 1043, 'Robin Chapel': 1044, 'Rocket Raccoon': 1045, 'Rocket Raccoon (Marvel Heroes)': 1046, 'Rocket Racer': 1047, 'Rockslide': 1048, 'Rogue': 1049, 'Rogue (Age of Apocalypse)': 1050, 'Rogue (Deadpool)': 1051, 'Rogue (Ultimate)': 1052, 'Rogue (X-Men: Battle of the Atom)': 1053, 'Roland Deschain': 1054, 'Romulus': 1055, 'Ronan': 1056, 'Roughhouse': 1057, 'Roulette': 1058, 'Roxanne Simpson': 1059, 'Rumiko Fujikawa': 1060, 'Runaways': 1061, 'Russian': 1062, 'S.H.I.E.L.D.': 1063, 'Sabra': 1064, 'Sabretooth': 1065, 'Sabretooth (Age of Apocalypse)': 1066, 'Sabretooth (House of M)': 1067, 'Sabretooth (Ultimate)': 1068, 'Sage': 1069, "Salem's Seven (Ultimate)": 1070, 'Sally Floyd': 1071, 'Salo': 1072, 'Sandman': 1073, 'Santa Claus': 1074, 'Saracen (Muzzafar Lambert)': 1075, 'Sasquatch (Walter Langkowski)': 1076, 'Satana': 1077, 'Sauron': 1078, 'Scalphunter': 1079, 'Scarecrow (Ebenezer Laughton)': 1080, 'Scarlet Spider (Ben Reilly)': 1081, 'Scarlet Spider (Kaine)': 1082, 'Scarlet Witch': 1083, 'Scarlet Witch (Age of Apocalypse)': 1084, 'Scarlet Witch (Marvel Heroes)': 1085, 'Scarlet Witch (Ultimate)': 1086, 'Scorpion (Carmilla Black)': 1087, 'Scorpion (Ultimate)': 1088, 'Scourge': 1089, 'Scrambler': 1090, 'Scream (Donna Diego)': 1091, 'Screwball': 1092, 'Sebastian Shaw': 1093, 'Secret Warriors': 1094, 'Selene': 1095, 'Senator Kelly': 1096, 'Sentinel': 1097, 'Sentinels': 1098, 'Sentry (Robert Reynolds)': 1099, 'Ser Duncan': 1100, 'Serpent Society': 1101, 'Sersi': 1102, 'Shadow King': 1103, 'Shadow King (Age of Apocalypse)': 1104, 'Shadowcat': 1105, 'Shadowcat (Age of Apocalypse)': 1106, 'Shadowcat (Ultimate)': 1107, 'Shadu the Shady': 1108, 'Shalla-bal': 1109, 'Shaman': 1110, 'Shane Yamada-Jones': 1111, 'Shang-Chi': 1112, 'Shang-Chi (Ultimate)': 1113, 'Shanna the She-Devil': 1114, 'Shape': 1115, 'Shard': 1116, 'Sharon Carter': 1117, 'Sharon Ventura': 1118, 'Shatterstar': 1119, 'She-Hulk (HAS)': 1120, 'She-Hulk (Jennifer Walters)': 1121, 'She-Hulk (Lyra)': 1122, 'She-Hulk (Marvel War of Heroes)': 1123, 'She-Hulk (Ultimate)': 1124, 'Shen': 1125, 'Sheva Callister': 1126, "Shi'Ar": 1127, 'Shinko Yamashiro': 1128, 'Shinobi Shaw': 1129, 'Shiva': 1130, 'Shiver Man': 1131, 'Shocker (Herman Schultz)': 1132, 'Shockwave': 1133, 'Shooting Star': 1134, 'Shotgun': 1135, 'Shriek': 1136, 'Sif': 1137, 'Silhouette': 1138, 'Silk Fever': 1139, 'Silver Centurion': 1140, 'Silver Fox': 1141, 'Silver Sable': 1142, 'Silver Samurai': 1143, 'Silver Samurai (Age of Apocalypse)': 1144, 'Silver Surfer': 1145, 'Silverclaw': 1146, 'Silvermane': 1147, 'Sin': 1148, 'Sinister Six': 1149, 'Sir Ram': 1150, 'Siren (Earth-93060)': 1151, 'Sister Grimm': 1152, 'Skaar': 1153, 'Skaar (HAS)': 1154, 'Skin': 1155, 'Skreet': 1156, 'Skrulls': 1157, 'Skrulls (Ultimate)': 1158, 'Skullbuster (Cylla Markham)': 1159, 'Slapstick': 1160, 'Slayback': 1161, 'Sleeper': 1162, 'Sleepwalker': 1163, 'Slipstream': 1164, 'Slyde': 1165, 'Smasher (Vril Rokk)': 1166, 'Smiling Tiger': 1167, 'Snowbird': 1168, 'Solo (James Bourne)': 1169, 'Songbird': 1170, 'Sons of the Tiger': 1171, 'Spacker Dave': 1172, 'Spectrum': 1173, 'Speed': 1174, 'Speed Demon': 1175, 'Speedball (Robert Baldwin)': 1176, 'Spencer Smythe': 1177, 'Sphinx (Anath-Na Mut)': 1178, 'Spider-dok': 1179, 'Spider-Girl (Anya Corazon)': 1180, 'Spider-Girl (May Parker)': 1181, 'Spider-Gwen (Gwen Stacy)': 1182, 'Spider-Ham (Larval Earth)': 1183, 'Spider-Man (1602)': 1184, 'Spider-Man (2099)': 1185, 'Spider-Man (Ai Apaec)': 1186, 'Spider-Man (Ben Reilly)': 1187, 'Spider-Man (House of M)': 1188, 'Spider-Man (LEGO Marvel Super Heroes)': 1189, 'Spider-Man (Marvel Zombies)': 1190, 'Spider-Man (Marvel: Avengers Alliance)': 1191, 'Spider-Man (Miles Morales)': 1192, 'Spider-Man (Noir)': 1193, 'Spider-Man (Peter Parker)': 1194, 'Spider-Man (Takuya Yamashiro)': 1195, 'Spider-Man (Ultimate)': 1196, 'Spider-Woman (Charlotte Witter)': 1197, 'Spider-Woman (Jessica Drew)': 1198, 'Spider-Woman (Mattie Franklin)': 1199, 'Spiral (Rita Wayword)': 1200, 'Spirit': 1201, 'Spitfire': 1202, 'Spot': 1203, 'Sprite': 1204, 'Spyke': 1205, 'Squadron Sinister': 1206, 'Squadron Supreme (Earth-712)': 1207, 'Squirrel Girl': 1208, 'Stacy X': 1209, 'Stacy X (Ultimate)': 1210, 'Star Brand': 1211, 'Star-Lord (Peter Quill)': 1212, 'Starbolt': 1213, 'Stardust': 1214, 'Starfox': 1215, 'Starhawk (Stakar Ogord)': 1216, 'Starjammers': 1217, 'Stark Industries': 1218, 'Stature': 1219, 'Steel Serpent (Davos)': 1220, 'Stellaris': 1221, 'Stepford Cuckoos': 1222, 'Stephanie de la Spiroza': 1223, 'Stephen Strange': 1224, 'Steve Rogers': 1225, 'Stick': 1226, 'Stilt-Man (Wibur Day)': 1227, 'Stingray (Walter Newell)': 1228, 'Stone Men': 1229, 'Storm': 1230, 'Storm (Age of Apocalypse)': 1231, 'Storm (Marvel Heroes)': 1232, 'Storm (Ultimate)': 1233, 'Stranger': 1234, 'Strong Guy': 1235, 'Stryfe': 1236, 'Stryfe (Ultimate)': 1237, 'Sub-Mariner': 1238, 'Sue Storm': 1239, 'Sugar Man': 1240, 'Sumo': 1241, 'Sunfire': 1242, 'Sunfire (Age of Apocalypse)': 1243, 'Sunset Bain': 1244, 'Sunspot': 1245, 'Super Hero Squad': 1246, 'Super-Adaptoid': 1247, 'Super-Skrull': 1248, 'Supernaut': 1249, 'Supreme Intelligence': 1250, 'Surge': 1251, 'Susan Delgado': 1252, 'Swarm': 1253, 'Sway': 1254, 'Switch': 1255, 'Swordsman': 1256, 'Swordsman (Jacques Duquesne)': 1257, 'Sym': 1258, 'Synch': 1259, "T'Challa": 1260, 'Tag': 1261, 'Talisman (Elizabeth Twoyoungmen)': 1262, 'Talkback (Chase Stein)': 1263, 'Talon (Fraternity of Raptors)': 1264, 'Talos': 1265, 'Tana Nile': 1266, 'Tarantula (Luis Alvarez)': 1267, 'Tarot': 1268, 'Taskmaster': 1269, 'Tattoo': 1270, 'Ted Forrester': 1271, 'Tempest': 1272, 'Tenebrous': 1273, 'Terrax': 1274, 'Terror': 1275, 'Texas Twister': 1276, 'Thaddeus Ross': 1277, 'Thanos': 1278, 'Thanos (Ultimate)': 1279, 'The 198': 1280, 'The Anarchist': 1281, 'The Call': 1282, 'The Captain': 1283, 'The Enforcers': 1284, 'The Executioner': 1285, 'The Fallen': 1286, 'The Fury': 1287, 'The Hand': 1288, 'The Hood': 1289, 'The Howling Commandos': 1290, 'The Hunter': 1291, 'The Initiative': 1292, 'The Leader (HAS)': 1293, 'The Liberteens': 1294, 'The Liberty Legion': 1295, 'The Order': 1296, 'The Phantom': 1297, 'The Professor': 1298, 'The Renegades': 1299, 'The Santerians': 1300, 'The Shiver Man': 1301, 'The Spike': 1302, 'The Stranger': 1303, 'The Twelve': 1304, 'The Watchers': 1305, 'Thena': 1306, 'Thing': 1307, 'Thing (Marvel Heroes)': 1308, 'Thing (Ultimate)': 1309, 'Thor': 1310, 'Thor (Goddess of Thunder)': 1311, 'Thor (MAA)': 1312, 'Thor (Marvel Heroes)': 1313, 'Thor (Marvel War of Heroes)': 1314, 'Thor (Marvel: Avengers Alliance)': 1315, 'Thor (Ultimate)': 1316, 'Thor Girl': 1317, 'Thunderball': 1318, 'Thunderbird (John Proudstar)': 1319, 'Thunderbird (Neal Shaara)': 1320, 'Thunderbolt (Bill Carver)': 1321, 'Thunderbolt Ross': 1322, 'Thunderbolts': 1323, 'Thundra': 1324, 'Tiger Shark': 1325, "Tiger's Beautiful Daughter": 1326, 'Tigra (Greer Nelson)': 1327, 'Timeslip': 1328, 'Tinkerer': 1329, 'Tippy Toe': 1330, 'Titania': 1331, 'Titanium Man (Topolov)': 1332, 'Toad': 1333, 'Toad Men': 1334, 'Tomas': 1335, 'Tombstone': 1336, 'Tomorrow Man': 1337, 'Tony Stark': 1338, 'Toro (Thomas Raymond)': 1339, 'Toxin': 1340, 'Toxin (Eddie Brock)': 1341, 'Trauma': 1342, 'Triathlon': 1343, 'Trish Tilby': 1344, 'Triton': 1345, 'True Believers': 1346, 'Turbo': 1347, 'Tusk': 1348, 'Two-Gun Kid': 1349, 'Tyger Tiger': 1350, 'Typhoid Mary': 1351, 'Tyrannus': 1352, 'U-Foes': 1353, 'U-Go Girl': 1354, 'U.S. Agent': 1355, 'Uatu The Watcher': 1356, 'Ulik': 1357, 'Ultimate Spider-Man (USM)': 1358, 'Ultimates': 1359, 'Ultimatum': 1360, 'Ultimo': 1361, 'Ultra-Adaptoid': 1362, 'Ultragirl (Earth-93060)': 1363, 'Ultron': 1364, 'Umar': 1365, 'Unicorn': 1366, 'Union Jack (Brian Falsworth)': 1367, 'Union Jack (Joseph Chapman)': 1368, 'Union Jack (Montgomery Falsworth)': 1369, 'Unus': 1370, 'Unus (Age of Apocalypse)': 1371, 'Unus (House of M)': 1372, 'Unus (Ultimate)': 1373, 'Valeria Richards': 1374, 'Valkyrie (Samantha Parrington)': 1375, 'Valkyrie (Ultimate)': 1376, 'Vampiro': 1377, 'Vance Astro': 1378, 'Vanisher (Age of Apocalypse)': 1379, 'Vanisher (Telford Porter)': 1380, 'Vanisher (Ultimate)': 1381, 'Vapor': 1382, 'Vargas': 1383, 'Vector': 1384, 'Veda': 1385, 'Vengeance (Michael Badilino)': 1386, 'Venom (Flash Thompson)': 1387, 'Venom (Mac Gargan)': 1388, 'Venom (Ultimate)': 1389, 'Venus (Siren)': 1390, 'Venus Dee Milo': 1391, 'Vermin (Edward Whelan)': 1392, 'Vertigo (Savage Land Mutate)': 1393, 'Victor Mancha': 1394, 'Victor Von Doom': 1395, 'Vin Gonzales': 1396, 'Vindicator': 1397, 'Violations': 1398, 'Viper': 1399, 'Virginia Dare': 1400, 'Vision': 1401, 'Vivisector': 1402, 'Vulcan (Gabriel Summers)': 1403, 'Vulture (Adrian Toomes)': 1404, 'Vulture (Blackie Drago)': 1405, 'Wallflower': 1406, 'Wallop': 1407, 'Wallow': 1408, 'War (Abraham Kieros)': 1409, 'War Machine (Iron Man 3 - The Official Game)': 1410, 'War Machine (Marvel: Avengers Alliance)': 1411, 'War Machine (Parnell Jacobs)': 1412, 'War Machine (Ultimate)': 1413, 'Warbird': 1414, 'Warbound': 1415, 'Warhawk (Mitchell Tanner)': 1416, 'Warlock (Janie Chin)': 1417, 'Warlock (Technarchy)': 1418, 'Warpath': 1419, 'Warren Worthington III': 1420, 'Warstar': 1421, 'Wasp': 1422, 'Wasp (Ultimate)': 1423, 'Weapon Omega': 1424, 'Weapon X': 1425, 'Wendell Rand': 1426, 'Wendell Vaughn': 1427, 'Wendigo': 1428, 'Werewolf By Night': 1429, 'Whiplash (Mark Scarlotti)': 1430, 'Whirlwind': 1431, 'Whistler': 1432, 'White Queen (Adrienne Frost)': 1433, 'White Tiger (Angela Del Toro)': 1434, 'White Tiger (USM)': 1435, 'Whizzer (Stanley Stewart)': 1436, 'Wiccan': 1437, 'Wild Child': 1438, 'Wild Child (Age of Apocalypse)': 1439, 'Wild Pack': 1440, 'Wildside': 1441, 'William Stryker': 1442, 'Wilson Fisk': 1443, 'Wind Dancer': 1444, 'Winter Soldier': 1445, 'Wither': 1446, 'Wolf Cub': 1447, 'Wolfpack': 1448, 'Wolfsbane': 1449, 'Wolfsbane (Age of Apocalypse)': 1450, 'Wolver-dok': 1451, 'Wolverine': 1452, 'Wolverine (LEGO Marvel Super Heroes)': 1453, 'Wolverine (Marvel War of Heroes)': 1454, 'Wolverine (Ultimate)': 1455, 'Wolverine (X-Men: Battle of the Atom)': 1456, 'Wonder Man': 1457, 'Wong': 1458, 'Wong (Ultimate)': 1459, 'Wraith': 1460, 'Wrecker': 1461, 'Wrecking Crew': 1462, 'X-23': 1463, 'X-51': 1464, 'X-Babies': 1465, 'X-Cutioner': 1466, 'X-Factor': 1467, 'X-Factor Investigations': 1468, 'X-Force': 1469, 'X-Man': 1470, 'X-Men': 1471, 'X-Men (Ultimate)': 1472, 'X-Ray (James Darnell)': 1473, 'X-Statix': 1474, 'X.S.E.': 1475, 'Xavin': 1476, 'Xorn (Kuan-Yin Xorn)': 1477, 'Yellow Claw': 1478, 'Yellowjacket (Rita DeMara)': 1479, 'Young Avengers': 1480, 'Young X-Men': 1481, 'Zaladane': 1482, 'Zaran': 1483, 'Zarda': 1484, 'Zarek': 1485, 'Zeigeist': 1486, 'Zemo': 1487, 'Zodiak': 1488, 'Zombie (Simon Garth)': 1489, 'Zuras': 1490, 'Zzzax': 1491, '3-D Man': 1492 },
    selectedCharacterName: "", // the character name we are queing
    selectedCharacterID: -1, // the character id we are queing
    selectedCharacterInfos: null, // the information of the selected character
    comicInfos: null, // the infos of the comics this character is in
    connectedCharacterInfos: null, // the characters that are connected to selected character
    authorInfos: null, // all the author infos
    stage: "PREPARING", // what stage of getting info are we in
    hoverCharacterID: -1, // what character we are hovering
    mouseSelectedCharacterID: -1, // what character ID we are selecting
  },
  mutations: {
    SET_SELECTED_CHARACTER_NAME(state, name) {
      state.selectedCharacterName = name;
    },
    SET_SELECTED_CHARACTER_ID(state, id) {
      state.selectedCharacterID = id;
    },
    SET_SELECTED_CHARACTER_INFOS(state, infos) {
      state.selectedCharacterInfos = infos;
    },
    SET_COMIC_INFOS(state, infos) {
      state.comicInfos = infos;
    },
    SET_CONNECTED_CHARACTER_INFOS(state, infos) {
      state.connectedCharacterInfos = infos;
    },
    SET_AUTHOR_INFOS(state, infos) {
      state.authorInfos = infos;
    },
    SET_STAGE(state, stage) {
      state.stage = stage;
    },
    SET_HOVER_CHARACTER_ID(state, id) {
      state.hoverCharacterID = id;
    },
    SET_MOUSE_SELECTED_CHARACTER_ID(state, id) {
      state.mouseSelectedCharacterID = id;
    }
  },
  actions: {
    selectCharacter(context, name) {
      var id = -1;
      if (name in this.state.characterNameAndID) {
        id = this.state.characterNameAndID[name];
      }
      console.log(name, id);
      context.commit('SET_SELECTED_CHARACTER_NAME', name);
      context.commit('SET_SELECTED_CHARACTER_ID', id);
    },
    updateCharacterInfos(context) {
      context.commit("SET_STAGE", "PREPARING")
      if (this.state.selectedCharacterID >= 0 && this.state.selectedCharacterID < Object.keys(this.state.characterNameAndID).length) {
        context.commit("SET_STAGE", "SENT")
        axios.get(api_url + "characters/" + this.state.selectedCharacterID).then(response => {
          context.commit("SET_SELECTED_CHARACTER_INFOS", response.data.character);
          const comics = response.data.comics;
          const connected_characters = response.data.connected_characters;
          const authors = response.data.authors;
          const ccInfos = {};
          for (const item of connected_characters) {
            ccInfos[item.id] = { "name": item.name, "url": item.url, "comics": [] }
          }
          var comicInfos = {};
          for (const item of comics) {
            comicInfos[item.id] = { "name": item.name, "url": item.url, "authors": item.authors, "cover": item.cover };
            for (const cid of item.characters) {
              ccInfos[cid]["comics"].push(item.id);
            }
          }
          var authorInfos = {}
          for (const item of authors) {
            authorInfos[item.id] = { "name": item.name, "url": item.url };
          }

          context.commit("SET_COMIC_INFOS", comicInfos);
          context.commit("SET_CONNECTED_CHARACTER_INFOS", ccInfos);
          context.commit("SET_AUTHOR_INFOS", authorInfos);
          context.commit("SET_STAGE", "FINISHED")
        }).catch(e => {
          context.commit("SET_STAGE", "NETWORK ERROR")
          console.log("ERROR: ", e);
        })
      } else {
        context.commit("SET_STAGE", "CHARACTER NOT EXIST")
      }
    },
    updateHoverCharacterID(context, id) {
      context.commit("SET_HOVER_CHARACTER_ID", id);
    },
    updateMouseSelectedCharacterID(context, id) {
      context.commit("SET_MOUSE_SELECTED_CHARACTER_ID", id);
    },
  },
  modules: {
  },
  getters: {
    // get all the character names for auto suggest
    allCharacterNames: state => Object.keys(state.characterNameAndID),
    // get the character ID based on the name
    characterID: state => name => {
      if (name in state.characterNameAndID)
        return state.characterNameAndID[name];
      else
        return -1;
    },
    selectedCharacterName: state => state.selectedCharacterName,
    selectedCharacterID: state => state.selectedCharacterID,
    selectedCharacterInfos: state => state.selectedCharacterInfos,
    comicInfos: state => state.comicInfos,
    connectedCharacterInfos: state => state.connectedCharacterInfos,
    authorInfos: state => state.authorInfos,
    stage: state => state.stage,
    hoverCharacterID: state => state.hoverCharacterID,
    mouseSelectedCharacterID: state => state.mouseSelectedCharacterID,
    oneComicInfo: state => id => state.comicInfos[id],
  }
})
