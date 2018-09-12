const fs = require('fs')
const schedule = require('node-schedule')
const lootastic = require('lootastic')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('data/battles.json')
const db = low(adapter)
var Discord = require("discord.js");
const ADB = require('../../modules/db')



db.defaults({
    users: [],
    battles: [],
    mobs: [
        [
            {
                name: "Rat",
                hp: 10,
                atk: 3
            },
            {
                name: "Worm",
                hp: 7,
                atk: 2
            },
            {
                name: "Snail",
                hp: 20,
                atk: 1
            },
            {
                name: "Squirrel",
                hp: 15,
                atk: 5
            },
            {
                name: "Bird",
                hp: 15,
                atk: 4
            }
        ],
        //Dungeon Level 2
        [
            {
                name: "Crow",
                hp: 20,
                atk: 4
            },
            {
                name: "Wolf",
                hp: 30,
                atk: 3
            },
            {
                name: "Hippo",
                hp: 35,
                atk: 4
            },
            {
                name: "Swordfish",
                hp: 25,
                atk: 5
            },
            {
                name: "Snake",
                hp: 15,
                atk: 7
            }
        ],
        //Dungeon Level 3
        [
            {
                name: "Octopus",
                hp: 45,
                atk: 8
            },
            {
                name: "Shark",
                hp: 55,
                atk: 6
            },
            {
                name: "Bear",
                hp: 70,
                atk: 5
            },
            {
                name: "Platypuss",
                hp: 40,
                atk: 10
            },
            {
                name: "Lion",
                hp: 65,
                atk: 7
            }
        ],
        //Dungeon Level 4
        [
            {
                name: "Windows Firewall",
                hp: 110,
                atk: 11
            },
            {
                name: "Norton Antivirus",
                hp: 100,
                atk: 13
            },
            {
                name: "Mom's Password",
                hp: 130,
                atk: 10
            },
            {
                name: "Windows Update",
                hp: 150,
                atk: 15
            },
            {
                name: "Lag",
                hp: 170,
                atk: 12
            }
        ],
        //Dungeon Level 5
        [
            {
                name: "Pikachu",
                hp: 185,
                atk: 15
            },
            {
                name: "Missingno",
                hp: 250,
                atk: 25
            },
            {
                name: "Charizard",
                hp: 200,
                atk: 22
            },
            {
                name: "Blastoise",
                hp: 210,
                atk: 18
            },
            {
                name: "Venusaur",
                hp: 235,
                atk: 20
            }
        ],
        //Dungeon Level 6
        [
            {
                name: "Sabertooth",
                hp: 320,
                atk: 37
            },
            {
                name: "Woolly Mammoth",
                hp: 350,
                atk: 40
            },
            {
                name: "Dodo",
                hp: 250,
                atk: 28
            },
            {
                name: "Western Black Rhinoceros",
                hp: 290,
                atk: 45
            },
            {
                name: "Tasmanian Tiger",
                hp: 270,
                atk: 35
            }
        ],
        //Dungeon Level 7
        [
            {
                name: "Mario",
                hp: 450,
                atk: 60
            },
            {
                name: "Sonic",
                hp: 400,
                atk: 50
            },
            {
                name: "Link",
                hp: 420,
                atk: 70
            },
            {
                name: "Kirby",
                hp: 375,
                atk: 55
            },
            {
                name: "Fox McCloud",
                hp: 390,
                atk: 75
            }
        ],
        //Dungeon Level 8
        [
            {
                name: "A horde of Feminists",
                hp: 550,
                atk: 90
            },
            {
                name: "Anti-Autism Vaccine",
                hp: 500,
                atk: 85
            },
            {
                name: "72 Genders",
                hp: 480,
                atk: 72
            },
            {
                name: "Gluten Allergies",
                hp: 525,
                atk: 80
            },
            {
                name: "Honest Politician",
                hp: 600,
                atk: 100
            }
        ],
        //Dungeon Level 9
        [
            {
                name: "Homer Simpson",
                hp: 750,
                atk: 125
            },
            {
                name: "Rick & Morty",
                hp: 850,
                atk: 170
            },
            {
                name: "Eric Cartman",
                hp: 700,
                atk: 110
            },
            {
                name: "Dr. Zoidberg",
                hp: 765,
                atk: 160
            },
            {
                name: "Sterling Archer",
                hp: 800,
                atk: 145
            }
        ],
        //Dungeon Level 10
        [
            {
                name: "Erectile Dysfunction",
                hp: 975,
                atk: 250
            },
            {
                name: "Crippling Depression",
                hp: 950,
                atk: 200
            },
            {
                name: "Osteoporosis",
                hp: 925,
                atk: 215
            },
            {
                name: "Ligma",
                hp: 900,
                atk: 230
            },
            {
                name: "Having Big Bones",
                hp: 1000,
                atk: 185
            }
        ],
        //Dungeon Level 11
        [
            {
                name: "Bowser",
                hp: 1250,
                atk: 325
            },
            {
                name: "Dracula",
                hp: 1100,
                atk: 275
            },
            {
                name: "Kerrigan",
                hp: 1200,
                atk: 400
            },
            {
                name: "GLaDOS",
                hp: 1300,
                atk: 350
            },
            {
                name: "Dr. Eggman",
                hp: 1050,
                atk: 300
            }
        ],
        //Dungeon Level 12
        [
            {
                name: "Your Shadow",
                hp: 1500,
                atk: 350
            },
            {
                name: "Bathroom Mirror",
                hp: 1400,
                atk: 325
            },
            {
                name: "Crying yourself to Sleep",
                hp: 1575,
                atk: 375
            },
            {
                name: "That one Pimple on your Nose",
                hp: 1650,
                atk: 400
            },
            {
                name: "Your Hopes and Dreams",
                hp: 1750,
                atk: 450
            }
        ],
        //Dungeon Level 13
        [
            {
                name: "Zombie",
                hp: 1900,
                atk: 550
            },
            {
                name: "Werewolf",
                hp: 1800,
                atk: 525
            },
            {
                name: "Vampire",
                hp: 1975,
                atk: 575
            },
            {
                name: "Kraken",
                hp: 2015,
                atk: 600
            },
            {
                name: "Banshee",
                hp: 2150,
                atk: 650
            }
        ],
        //Dungeon Level 14
        [
            {
                name: "Sidewalk Dog Poop",
                hp: 2100,
                atk: 725
            },
            {
                name: "Lego on the Floor",
                hp: 2300,
                atk: 675
            },
            {
                name: "Bird shit on your shoulder",
                hp: 2650,
                atk: 700
            },
            {
                name: "Gum in your Hair",
                hp: 2500,
                atk: 650
            },
            {
                name: "Drive-by Puddle Splash",
                hp: 2700,
                atk: 690
            }
        ],
        //Dungeon Level 15
        [
            {
                name: "T-Rex",
                hp: 3150,
                atk: 900
            },
            {
                name: "Spinosaurus",
                hp: 2700,
                atk: 875
            },
            {
                name: "Velociraptor",
                hp: 2500,
                atk: 925
            },
            {
                name: "Pterodactyl",
                hp: 2900,
                atk: 750
            },
            {
                name: "Mosasaurus",
                hp: 3100,
                atk: 890
            }
        ],
        //Dungeon Level 16
        [
            {
                name: "Left over Ikea Screw",
                hp: 3400,
                atk: 1200
            },
            {
                name: "Drawer of Dead Batteries",
                hp: 3250,
                atk: 1175
            },
            {
                name: "Creaky Staircase",
                hp: 3500,
                atk: 1250
            },
            {
                name: "Weak Door Handle",
                hp: 3150,
                atk: 1195
            },
            {
                name: "Uneven Chair Leg",
                hp: 3000,
                atk: 1150
            }
        ],
        //Dungeon Level 17
        [
            {
                name: "U.F.O.",
                hp: 3700,
                atk: 1400
            },
            {
                name: "Big Foot",
                hp: 3550,
                atk: 1375
            },
            {
                name: "Nessie",
                hp: 3800,
                atk: 1450
            },
            {
                name: "Chupacabra",
                hp: 3450,
                atk: 1395
            },
            {
                name: "Leprechaun",
                hp: 3300,
                atk: 1350
            }
        ],
        //Dungeon Level 18
        [
            {
                name: "A Dirty Laundry Pile",
                hp: 4500,
                atk: 1700
            },
            {
                name: "Grandma's Forgotten Cheese",
                hp: 4000,
                atk: 1600
            },
            {
                name: "Leaky Garbage Bag",
                hp: 4250,
                atk: 1750
            },
            {
                name: "Shower Hair Clumps",
                hp: 4400,
                atk: 1600
            },
            {
                name: "Sweaty Gym Shoes",
                hp: 4100,
                atk: 1675
            }
        ],

        //Dungeon Level 19
        [
            {
                name: "Basilisk",
                hp: 5000,
                atk: 2100
            },
            {
                name: "Lord Voldemort",
                hp: 5150,
                atk: 1900
            },
            {
                name: "Dementor",
                hp: 4750,
                atk: 1800
            },
            {
                name: "Aragog",
                hp: 5250,
                atk: 2300
            },
            {
                name: "Cerberus",
                hp: 5600,
                atk: 2500
            }
        ],
        //Dungeon Level 20
        [
            {
                name: "Monster under the Bed",
                hp: 6400,
                atk: 3600
            },
            {
                name: "The Man in your Closet",
                hp: 5900,
                atk: 2850
            },
            {
                name: "Crossing the Road without Holding Hands",
                hp: 6100,
                atk: 3150
            },
            {
                name: "Having to Shower everyday",
                hp: 6050,
                atk: 3000
            },
            {
                name: "\"Buy the Bread, i'll wait in the Car\"",
                hp: 6500,
                atk: 3400
            }
        ],
        //Dungeon Level 21
        [
            {
                name: "Dr. Doom",
                hp: 7300,
                atk: 4100
            },
            {
                name: "Shredder",
                hp: 7100,
                atk: 4350
            },
            {
                name: "Skeletor",
                hp: 7500,
                atk: 4500
            },
            {
                name: "The Joker",
                hp: 6750,
                atk: 3950
            },
            {
                name: "Ganondorf",
                hp: 6900,
                atk: 4200
            }
        ],
        //Dungeon Level 22
        [
            {
                name: "Hercules",
                hp: 8000,
                atk: 5025
            },
            {
                name: "Achilles",
                hp: 8150,
                atk: 4875
            },
            {
                name: "Prometheus",
                hp: 8400,
                atk: 5450
            },
            {
                name: "Odysseus",
                hp: 7875,
                atk: 5000
            },
            {
                name: "Perseus",
                hp: 7590,
                atk: 4600
            }
        ],
        [
            //Dungeon Level 23
            {
                name: "Slamming your Pinky Toe in a Corner",
                hp: 9000,
                atk: 7000
            },
            {
                name: "That Morning Leg Cramp",
                hp: 10000,
                atk: 6100
            },
            {
                name: "Cats unplugging your Wires",
                hp: 8975,
                atk: 5700
            },
            {
                name: "That one song stuck in your head",
                hp: 10500,
                atk: 6400
            },
            {
                name: "\"Oh a food item!\" best 2 years ago",
                hp: 9500,
                atk: 6800
            }
        ],
        //Dungeon Level 24
        [
            {
                name: "Zekrow",
                hp: 9999,
                atk: 9000
            },
            {
                name: "TheSnekySnek",
                hp: 13000,
                atk: 7500
            },
            {
                name: "FuzzyWabbit",
                hp: 11000,
                atk: 6000
            },
            {
                name: "Robsteals",
                hp: 8500,
                atk: 8000
            },
            {
                name: "Nainfirmière",
                hp: 9700,
                atk: 6700
            }
        ],
        //Dungeon Level 25
        [
            {
                name: "Zeus",
                hp: 10000,
                atk: 13500
            },
            {
                name: "Hades",
                hp: 17500,
                atk: 14000
            },
            {
                name: "Hecate",
                hp: 15000,
                atk: 10000
            },
            {
                name: "Poseidon",
                hp: 12500,
                atk: 11500
            },
            {
                name: "Ra",
                hp: 20000,
                atk: 13000
            }
        ]
    ],
    items: {
        helmet: [
            {
                name: "Messy Morning Hair",
                hp: 5,
                lvl: 1
            },
            {
                name: "A Wig from the attic",
                hp: 8,
                lvl: 2

            },
            {
                name: "Kitchen Lady's Hairnet",
                hp: 12,
                lvl: 3
            },
            {
                name: "A Tinfoil Hat",
                hp: 15,
                lvl: 4
            },
            {
                name: "Caesar's Laurel Wreath",
                hp: 25,
                lvl: 5
            },
            {
                name: "Bart Simpson's Spiky Hair",
                hp: 30,
                lvl: 6
            },
            {
                name: "Daft Punk's Rainbow Helmet",
                hp: 45,
                bp: 1,
                lvl: 7
            },
            {
                name: "Crash Bandicoot's Aku Aku Mask",
                hp: 70,
                lvl: 8
            },
            {
                name: "Cubone's Skull",
                hp: 140,
                lvl: 9
            },
            {
                name: "Goldi's Locks",
                hp: 100,
                luck: 10,
                lvl: 10
            },
            {
                name: "Loki's Horns",
                hp: 200,
                bp: 2,
                luck: 10,
                lvl: 11
            },
            {
                name: "Darth Vader's Respirator",
                hp: 180,
                atk: 45,
                lvl: 12
            },
            {
                name: "Majora's Mask",
                hp: 210,
                atk: 100,
                lvl: 13
            },
            {
                name: "Jack Sparrow's Bandana",
                hp: 250,
                luck: 15,
                lvl: 14
            },
            {
                name: "Medusa's Severed Head",
                hp: 350,
                bp: 1,
                lvl: 15
            },
            {
                name: "Batman's Ears",
                hp: 500,
                atk: 150,
                bp: 1,
                lvl: 16
            },
            {
                name: "The Sorting Hat",
                hp: 700,
                atk: 200,
                bp: 2,
                lvl: 17
            },
            {
                name: "Sunbro's Bucket Helm",
                hp: 1000,
                atk: 420,
                luck: 25,
                lvl: 18
            },
            {
                name: "The Mask",
                hp: 1500,
                atk: 750,
                lvl: 19
            },
            {
                name: "Cuphead's Cup Head",
                hp: 3000,
                atk: 1000,
                bp: 5,
                lvl: 20
            }
        ],
        chest: [
            {
                name: "Dirty T-Shirt",
                hp: 5,
                lvl: 1
            },
            {
                name: "Mom's Apron",
                hp: 8,
                lvl: 2
            },
            {
                name: "A Mexican's Pancho",
                hp: 45,
                lvl: 3
            },
            {
                name: "A Cardboard Box",
                hp: 75,
                bp: 1,
                lvl: 4
            },
            {
                name: "The Arc Reactor",
                hp: 130,
                lvl: 5
            },
            {
                name: "Samus' Suit",
                hp: 250,
                lvl: 6
            },
            {
                name: "Ninja Turtle Shell",
                hp: 350,
                lvl: 7
            },
            {
                name: "Donkey Kong's Barrel",
                hp: 650,
                lvl: 8
            },
            {
                name: "Goofy Goober T-Shirt",
                hp: 725,
                lvl: 9
            },
            {
                name: "Elite Knight's Armor",
                hp: 1250,
                atk: 200,
                lvl: 10
            },
            {
                name: "Crimson Tunic",
                hp: 1000,
                bp: 3,
                lvl: 11
            },
            {
                name: "Professioanl Sumo Suit",
                hp: 2000,
                atk: -50,
                lvl: 12
            },
            {
                name: "Dumbledore's Cloak",
                hp: 1500,
                luck: 10,
                lvl: 13
            },
            {
                name: "Iron Golem Armor",
                hp: 3000,
                lvl: 14
            },
            {
                name: "Deadpool's Overalls",
                hp: 500,
                atk: 500,
                lvl: 15
            },
            {
                name: "Rathalos Flaming Armor",
                hp: 4500,
                bp: 2,
                lvl: 16
            },
            {
                name: "Shadow Priest Tunic",
                hp: 4000,
                luck: 15,
                lvl: 17
            },
            {
                name: "A Forest of Chest Hair",
                hp: 6000,
                lvl: 18
            },
            {
                name: "Pedobear Suit",
                hp: 7750,
                luck: 10,
                lvl: 19
            },
            {
                name: "Elder Dragon Armor",
                hp: 9500,
                atk: 1000,
                bp: 1,
                lvl: 20
            }
        ],
        pants: [
            {
                name: "Stained Shorts",
                hp: 5,
                lvl: 1
            },
            {
                name: "Hawaiian Skirt",
                hp: 10,
                lvl: 2
            },
            {
                name: "Hula Hoop",
                hp: 35,
                lvl: 3
            },
            {
                name: "Your Mom's Leopard Thong",
                hp: 80,
                lvl: 4
            },
            {
                name: "Wooden Pirate Leg",
                hp: 110,
                lvl: 5
            },
            {
                name: "Tarzan's Crotch Cloth",
                hp: 150,
                lvl: 6
            },
            {
                name: "Goofy Goober Pants",
                hp: 170,
                lvl: 7
            },
            {
                name: "Wet Towel",
                hp: 185,
                lvl: 8
            },
            {
                name: "Sexy Male Stockings",
                hp: 225,
                lvl: 9
            },
            {
                name: "Iron Golem Pants",
                hp: 300,
                lvl: 10
            },
            {
                name: "Tommy Pickle's Diaper",
                hp: 400,
                lvl: 11
            },
            {
                name: "Your Dad's Speedo",
                hp: 475,
                lvl: 12
            },
            {
                name: "Shadow Priest Robes",
                hp: 550,
                luck: 10,
                lvl: 13
            },
            {
                name: "Centaur's Bottoms",
                hp: 700,
                lvl: 14
            },
            {
                name: "Adam's Crotch Leaf",
                hp: 1000,
                lvl: 15
            },
            {
                name: "Crimson Robes",
                hp: 1300,
                bp: 2,
                lvl: 16
            },
            {
                name: "Elite Knight Pants",
                hp: 1750,
                atk: 100,
                lvl: 17
            },
            {
                name: "Hulk's Ripped Shorts",
                hp: 2500,
                lvl: 18
            },
            {
                name: "Pile of Fallen Leaves",
                hp: 4000,
                lvl: 19
            },
            {
                name: "Elder Dragon Pants",
                hp: 6000,
                bp: 1,
                lvl: 20
            }
        ],
        boots: [
            {
                name: "Flip Flops",
                hp: 5,
                lvl: 1
            },
            {
                name: "Socks and Sandals",
                hp: 10,
                lvl: 2
            },
            {
                name: "Crocs",
                hp: 30,
                lvl: 3
            },
            {
                name: "Cinderalla's Glass Slipper",
                hp: 75,
                lvl: 4
            },
            {
                name: "A Samurai's Wooden Tongs",
                hp: 90,
                lvl: 5
            },
            {
                name: "Puss in Boots",
                hp: 140,
                lvl: 6
            },
            {
                name: "Hermes' Flying Boots",
                hp: 190,
                lvl: 7
            },
            {
                name: "Tony Hawk's Skateboard",
                hp: 230,
                lvl: 8
            },
            {
                name: "Bear Slippers",
                hp: 300,
                lvl: 9
            },
            {
                name: "Boots from Dora the Explorer",
                hp: 360,
                lvl: 10
            },
            {
                name: "Iron Golem Grieves",
                hp: 430,
                lvl: 11
            },
            {
                name: "Sonic's Speedy Shoes",
                hp: 500,
                lvl: 12
            },
            {
                name: "Crimson Shoes",
                hp: 775,
                bp: 1,
                lvl: 13
            },
            {
                name: "Elite Knight Grieves",
                hp: 850,
                atk: 50,
                lvl: 14
            },
            {
                name: "Hoverboard",
                hp: 1000,
                lvl: 15
            },
            {
                name: "Shadow Priest Shoes",
                hp: 1500,
                luck: 5,
                lvl: 16
            },
            {
                name: "One Punch Man's Red Rubber Boots",
                hp: 2000,
                lvl: 17
            },
            {
                name: "Dobby's Socks",
                hp: 3000,
                lvl: 18
            },
            {
                name: "Elder Dragon Grieves",
                hp: 4000,
                atk: 150,
                bp: 1,
                lvl: 19
            },
            {
                name: "Achilles' Heelies",
                hp: 5000,
                lvl: 20
            }
        ],
        accessory: [
            {
                name: "Grandpa's Wristwatch",
                hp: -10,
                lvl: 1
            },
            {
                name: "Yellow Rubber Glove",
                atk: 50,
                lvl: 2
            },
            {
                name: "Dora's Backpack",
                hp: 25,
                bp: 1,
                lvl: 3
            },
            {
                name: "Michael Jackson's White Glove",
                hp: 20,
                bp: 2,
                lvl: 4
            },

            {
                name: "Mario Sunshine's Jetpack",
                bp: 2,
                lvl: 5
            },
            {
                name: "Yoshi's Egg",
                hp: 100,
                atk: 100,
                lvl: 7
            },
            {
                name: "Ben 10's Omnitrix",
                atk: 200,
                lvl: 9
            },
            {
                name: "Companion Cube",
                hp: 300,
                bp: 1,
                lvl: 10
            },
            /*
            {
                name: "Pandora's Box",
                hp: ?,
                atk: ?,
                bp: ?,
                lvl: 10
            },
            {
                name: "Shrodinger's Cat",
                hp: ?,
                atk: ?,
                bp: ?,
                lvl: 10
            },
            {
                name: "Wild E. Coyote's ACME Box",
                hp: ?,
                atk: ?,
                bp: ?,
                lvl: 10
            },
            */
            {
                name: "Sorcerer's Stone",
                hp: 500,
                bp: 1,
                lvl: 10
            },
            {
                name: "Sauron's Ring",
                hp: -100,
                atk: 100,
                bp: 1,
                lvl: 11
            },

            {
                name: "Harry's Invisibility Cloak",
                hp: -150,
                atk: 150,
                lvl: 12
            },
            {
                name: "Goblet of Fire",
                hp: -800,
                atk: -50,
                bp: 5,
                lvl: 13
            },
            {
                name: "Scooby Snacks",
                hp: 750,
                lvl: 14
            },
            {
                name: "Pegasus Wings",
                hp: 200,
                atk: 200,
                lvl: 14
            },
            {
                name: "Masterball",
                atk: 300,
                lvl: 15
            },
            {
                name: "Nimbus Cloud",
                hp: 500,
                atk: 400,
                bp: -1,
                lvl: 17
            },
            {
                name: "Maurauder's Map",
                hp: -300,
                atk: 800,
                bp: 1,
                lvl: 18
            },
            {
                name: "Batman's Utility Belt",
                hp: 500,
                atk: 1000,
                bp: 1,
                lvl: 19
            },
            {
                name: "Dragonballs",
                hp: -500,
                atk: 2000,
                bp: -2,
                lvl: 20
            }
        ],
        weapon: [
            {
                name: "A Wet Toothbrush",
                atk: 5,
                lvl: 1
            },
            {
                name: "A Schoolkid's Rubber Slingshot",
                atk: 12,
                lvl: 2
            },
            {
                name: "Bob Ross's Paintbrush",
                atk: 45,
                lvl: 3
            },
            {
                name: "Here's Johnny's Axe",
                atk: 85,
                lvl: 4
            },
            {
                name: "Skywalker's Right Hand",
                atk: 100,
                hp: -20,
                lvl: 5
            },
            {
                name: "Elon Musk's Flamethrower",
                atk: 250,
                hp: -100,
                bp: 1,
                lvl: 6
            },
            {
                name: "Spock's Phaser",
                atk: 190,
                lvl: 7
            },
            {
                name: "An Abandoned Portal Gun",
                atk: 250,
                lvl: 8
            },
            {
                name: "Gordon's Crowbar",
                atk: 325,
                hp: -50,
                lvl: 9
            },
            {
                name: "Hulk's Giant Fist",
                atk: 600,
                hp: -250,
                lvl: 10
            },
            {
                name: "Olivander's Wand",
                atk: 300,
                bp: 1,
                lvl: 11
            },
            {
                name: "Merlin's Sword",
                atk: 420,
                lvl: 12
            },
            {
                name: "Deathnote",
                atk: 375,
                hp: -100,
                bp: 2,
                lvl: 13
            },
            {
                name: "Thor's Hammer",
                atk: 675,
                lvl: 14
            },
            {
                name: "Holy Hand Grenade",
                atk: 800,
                hp: -100,
                lvl: 15
            },
            {
                name: "A Tetris Block",
                atk: 1500,
                lvl: 16
            },
            {
                name: "The Infinity Gauntlet",
                atk: 1050,
                hp: -400,
                bp: 4,
                lvl: 17
            },
            {
                name: "Kirby's Big Succ",
                atk: 3500,
                bp: 2,
                lvl: 18
            },
            {
                name: "The Chancla",
                atk: 5100,
                luck: 15,
                lvl: 19
            },
            {
                name: "Anime Body Pillow",
                atk: 7000,
                hp: -300,
                lvl: 20
            }
        ],
        consumable: [
            {
                name: "Small BP Potion",
                bp: 5,
                price: 5000
            },
            {
                name: "Large BP Potion",
                bp: 10,
                price: 10000
            },
            {
                name: "Fill me up Scotty",
                bp: 0,
                price: 15000
            },
            {
                name: "Small Dungeon Potion",
                hp: 0.15,
                price: 2500
            },
            {
                name: "Large Dungeon Potion",
                hp: 0.30,
                price: 5000
            },
            
            {
                name: "Small Dungeon Elixir",
                atk: 0.15,
                price: 2500
            },
            {
                name: "Large Dungeon Elixir",
                atk: 0.30,
                price: 5000
            },
            {
                name: "Small Magic Elixir",
                luck: 15,
                price: 5000
            },
            {
                name: "Large Magic Elixir",
                luck: 30,
                price: 10000
            }
        ]
    }
})
    .write()

schedule.scheduleJob('0 0 * * *', () => {
    var users = db.get('users').value()
    users.forEach(user => {
        db.get("users").find({ id: user.id }).assign({ gamesToday: 0 }).write()
    });
})

function timeForReset() {
    var now = new Date().getTime();
    var countDownDate = new Date();
    countDownDate.setDate(countDownDate.getDate() + 1)
    countDownDate.setHours(0, 0, 0, 0);
    var distance = countDownDate - now;
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return "You've used all your battle points. \nCome back in **" + hours + "h " + minutes + "m " + seconds + "s**."
}

function getLoot(lvl, luck) {
    var items = db.get('items').value()
    var dnum = db.get('mobs').value().length
    var lootArray = []
    for (var type in items) {
        if (items.hasOwnProperty(type)) {
            for (let i = Math.floor((items.weapon.length / dnum) * (lvl-1)); i < items[type].length; i++) {
                lootArray.push({ chance: Math.ceil((100000 / Math.pow(2, i - (Math.floor((items.weapon.length / dnum) * (lvl-1)))))), result: { type: type, id: i } })
            }
        }
    }
    lootArray.push({ chance: 2000000 / (luck), result: "" })
    console.log(lootArray)
    let lootTable = new lootastic.LootTable(lootArray)
    let loot = lootTable.chooseWithReplacement(1)
    console.log(loot)
    return loot
}

function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createUser(member) {
    var userData = {
        id: member.id,
        damageTaken: 0,
        wins: 0,
        loses: 0,
        pvpwins: 0,
        pvploses: 0,
        gamesToday: 0,
        maxDungeon: 0,
        inventory: {
            helmet: [],
            chest: [],
            pants: [],
            boots: [],
            accessory: [],
            weapon: [],
            consumable: []
        },
        equiped: {
            helmet: 0,
            chest: 0,
            pants: 0,
            boots: 0,
            accessory: 0,
            weapon: 0
        }
    }
    db.get('users')
        .push(userData)
        .write()
}

function getUser(id) {
    return db.get('users')
        .find({ id: id })
        .value()
}

function getAvailablePotions(user) {
    var items = db.get('items').value()
    var im = []
    for (let i = 0; i < items.consumable.length; i++) {
        im.push(0)
    }
    for (let i = 0; i < user.inventory.consumable.length; i++) {
        im[user.inventory.consumable[i]]++
    }
    console.log(im)
    return im
}

function getUserStats(user) {
    var items = db.get('items').value()
    var atk = 0
    var hp = 50
    var bp = 10
    var luck = 1
    for (var type in user.equiped) {
        if (user.equiped.hasOwnProperty(type)) {
            if (items[type][user.equiped[type]].hp) {
                hp += items[type][user.equiped[type]].hp
            }
            if (items[type][user.equiped[type]].atk) {
                atk += items[type][user.equiped[type]].atk
            }
            if (items[type][user.equiped[type]].bp) {
                bp += items[type][user.equiped[type]].bp
            }
            if (items[type][user.equiped[type]].luck) {
                luck += items[type][user.equiped[type]].luck
            }
        }
    }
    return { atk: atk, hp: hp, bp: bp, luck: luck }
}

function printProfile(user, message) {
    var items = db.get('items').value()
    var stats = getUserStats(user)
    if (stats.bp < 0)
        stats.bp = 0
    let embed = new Discord.RichEmbed()
        .setTitle("- Battle Profile -")
        .setDescription("For " + message.guild.members.get(user.id).displayName + "\n------------------------------------------------------------------")
        .setColor("#dcbc3f")
        .setThumbnail("https://cdn.discordapp.com/attachments/233701911168155649/488095324527919104/battle-slots.png")
        .addField("Ranking: Unavailable", "Battles Won: " + user.wins + "\nBattles Lost: " + user.loses + "\nPVP Battles Won: " + user.pvpwins + "\nPVP Battles Lost: " + user.pvploses + "\n------------------------------------------------------------------")
        .addField("Attributes", "------------------------------------------------------------------\n\n:heart: Health: " + (stats.hp - user.damageTaken) + " / " + stats.hp + "\n:crossed_swords: Attack: " + stats.atk + "\n:game_die:  Luck: " + stats.luck + "\n:fireworks: Battle Points: " + (stats.bp - user.gamesToday) + " / " + stats.bp + "\n\n------------------------------------------------------------------")
        .addField("Equipment", "------------------------------------------------------------------")
    for (var type in user.equiped) {
        if (user.equiped.hasOwnProperty(type)) {
            var itemDesc = "**" + items[type][user.equiped[type]].name + "**"
            if (items[type][user.equiped[type]].hp) {
                itemDesc += ("\n   *HP " + items[type][user.equiped[type]].hp + "*")
            }
            if (items[type][user.equiped[type]].atk) {
                itemDesc += ("\n   *ATK " + items[type][user.equiped[type]].atk + "*")
            }
            if (items[type][user.equiped[type]].bp) {
                itemDesc += ("\n   *BP " + items[type][user.equiped[type]].bp + "*")
            }
            if (items[type][user.equiped[type]].luck) {
                itemDesc += ("\n   *Luck " + items[type][user.equiped[type]].luck + "*")
            }
            embed.addField(cap(type), itemDesc + "\n", true)
        }
    }
    message.channel.send(embed)
}

function printInventory(user, message) {
    var items = db.get('items').value()

    for (var type in user.inventory) {
        if (user.inventory.hasOwnProperty(type) && type != "consumable") {
            let embed = new Discord.RichEmbed()
                .setTitle("- " + cap(type) + " -")
                .setColor("#dcbc3f")
            var inv = user.inventory[type]
            for (let i = 0; i < inv.length; i++) {
                var item = items[type][inv[i]]
                var itemDesc = ""
                if (item.hp) {
                    if (item.hp < 1 && item.hp > 0)
                        itemDesc += (" :heart: +" + item.hp * 100 + "%")
                    else
                        itemDesc += (" :heart: " + item.hp)
                }
                if (item.atk) {
                    if (item.atk < 1 && item.atk > 0)
                        itemDesc += (" :crossed_swords: +" + item.atk * 100 + "%")
                    else
                        itemDesc += (" :crossed_swords: " + item.atk)
                }
                if (item.bp || item.bp == 0) {
                    if (type == "consumable") {
                        if (item.bp == 0)
                            itemDesc += (" :fireworks: MAX")
                        else
                            itemDesc += (" :fireworks: +" + item.bp)
                    }

                    else
                        itemDesc += (" :fireworks: " + item.bp)

                }
                if (item.luck) {
                    itemDesc += (" :game_die: " + item.luck)
                }
                embed.addField(i + ". " + item.name, itemDesc, false)
            }
            message.channel.send(embed)
        }
        else if(type == "consumable"){
            let embed = new Discord.RichEmbed()
                .setTitle("- " + cap(type) + " -")
                .setColor("#dcbc3f")
            var pot = getAvailablePotions(user)
            for (let i = 0; i < pot.length; i++) {
                if(pot[i] > 0){
                    embed.addField(items.consumable[i].name, "Quantity: " + pot[i], false)
                }
            }
            message.channel.send(embed)
        }
    }
}

module.exports = {
    profile: function (message, command, args) {
        if (args[0]) {
            var user = getUser(args[0])
            if (!user) {
                message.channel.send("Invalid user ID")
                return
            }
            printProfile(user, message)
        }
        else {
            var user = getUser(message.author.id)
            if (!user) {
                createUser(message.member)
                user = getUser(message.author.id)
            }
            printProfile(user, message)
        }

    },
    resetbp: function (message, command, args) {
        var HR = message.guild.members.get(message.author.id).highestRole.name
        if (HR != "Owner" && HR != "Co-Owner") {
            message.channel.send("Not available")
            return
        }
        var users = db.get('users').value()
        users.forEach(user => {
            db.get("users").find({ id: user.id }).assign({ gamesToday: 0 }).write()
        });
    },
    buy: function (message, command, args) {
        var HR = message.guild.members.get(message.author.id).highestRole.name
        if ((HR != "Owner" && HR != "Co-Owner") && args[0] != "consumable") {
            message.channel.send("Not available")
            return
        }
        var items = db.get('items').value()
        var user = getUser(message.author.id)
        if (!user) {
            return
        }
        var kind = args[0]
        if ((HR != "Owner" && HR != "Co-Owner") && args[0] == "consumable") {
            if ((parseInt(args[1]) != 0 || parseInt(args[1]) > items[kind].length) && (!parseInt(args[1]) || parseInt(args[1]) > items[kind].length)) {
                message.channel.send("Invalid Item ID")
                return
            }
            var userCoins = ADB.getCoins(message.author.id).amount
            if (userCoins < items.consumable[args[1]].price) {
                message.channel.send("You don't have enough arkoins")
                return
            }
            user.inventory.consumable.push(args[1])
            db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
            ADB.setCoins(message.author.id, userCoins - items.consumable[args[1]].price)
            message.channel.send("You bought " + items.consumable[args[1]].name + " for " + items.consumable[args[1]].price + " arkoins")
        }
        else {
            if (kind != "helmet" && kind != "chest" && kind != "pants" && kind != "boots" && kind != "accessory" && kind != "weapon" && kind != "consumable") {
                message.channel.send("Unknown equipment type")
                return
            }
            if ((parseInt(args[1]) != 0 || parseInt(args[1]) > items[kind].length) && (!parseInt(args[1]) || parseInt(args[1]) > items[kind].length)) {
                message.channel.send("Invalid Item ID")
                return
            }
            var id = parseInt(args[1])
            if (kind == "consumable") {
                user.inventory[kind].push(id)
                db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                message.channel.send("Obtained " + items[kind][id].name)
            }
            else if (items[kind][id]) {
                user.inventory[kind].push(user.equiped[kind])
                user.equiped[kind] = id
                db.get('users').find({ id: message.author.id }).assign({ equiped: user.equiped }).write()
                db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                message.channel.send("Equipped " + items[kind][id].name)
            }
        }

    },
    inventory: function (message, command, args) {
        var user = getUser(message.author.id)
        if (!user) {
            return
        }
        printInventory(user, message)
    },
    equip: function (message, command, args) {
        var items = db.get('items').value()

        var user = getUser(message.author.id)
        var stats = getUserStats(user)
        if (!user) {
            return
        }
        var kind = args[0]
        if (kind != "helmet" && kind != "chest" && kind != "pants" && kind != "boots" && kind != "accessory" && kind != "weapon") {
            message.channel.send("Unknown equipment type")
            return
        }
        if ((parseInt(args[1]) != 0 || parseInt(args[1]) > user.inventory[kind].length - 1) && (!parseInt(args[1]) || parseInt(args[1]) > user.inventory[kind].length - 1)) {
            message.channel.send("Invalid Item ID")
            return
        }

        var id = parseInt(args[1])
        console.log(user.inventory[kind][id])
        if ((items[kind][user.inventory[kind][id]].hp < 0 && (stats.hp + items[kind][user.inventory[kind][id]].hp) < 1) || (items[kind][user.inventory[kind][id]].atk < 0 && (stats.atk + items[kind][user.inventory[kind][id]].atk) < 1) || (items[kind][user.inventory[kind][id]].bp < 0 && (stats.bp + items[kind][user.inventory[kind][id]].bp) < 1)) {
            message.channel.send("You don't have enough hp/atk/bp to equip this item")
            return
        }
        if (user.inventory[kind][id] || user.inventory[kind][id] == 0) {
            var ei = user.inventory[kind][id]
            user.inventory[kind].splice(id, 1)
            user.inventory[kind].push(user.equiped[kind])
            user.equiped[kind] = ei
            db.get('users').find({ id: message.author.id }).assign({ equiped: user.equiped }).write()
            db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
            message.channel.send("Equipped " + items[kind][ei].name)
        }
    },
    trash: function (message, command, args) {
        var items = db.get('items').value()
        var user = getUser(message.author.id)
        if (!user) {
            return
        }
        var kind = args[0]
        if (kind != "helmet" && kind != "chest" && kind != "pants" && kind != "boots" && kind != "accessory" && kind != "weapon") {
            message.channel.send("Unknown equipment type")
            return
        }
        if ((parseInt(args[1]) != 0 || parseInt(args[1]) > user.inventory[kind].length) && (!parseInt(args[1]) || parseInt(args[1]) > user.inventory[kind].length)) {
            message.channel.send("Invalid Item ID")
            return
        }
        var id = parseInt(args[1])
        if (user.inventory[kind][id]) {
            var ei = user.inventory[kind][id]
            user.inventory[kind].splice(id, 1)
            db.get('users')
                .find({ "id": user.id })
                .assign({ "inventory": user.inventory })
                .write()
            message.channel.send("Destroyed " + items[kind][ei].name)
        }
    },
    /*armory: function (message, command, args) {
        var items = db.get('items').value()
        for (var type in items) {
            if (items.hasOwnProperty(type)) {
                let embed = new Discord.RichEmbed()
                    .setTitle("- " + cap(type) + " -")
                    .setColor("#dcbc3f")
                    .setThumbnail("https://cdn.discordapp.com/attachments/233701911168155649/488095324527919104/battle-slots.png")
                for (let i = 0; i < items[type].length; i++) {
                    var msg = ""
                    for (var t in items[type][i]) {
                        if (items[type][i].hasOwnProperty(t) && t != "name") {
                            if (t == "hp")
                                msg += " :heart: " + items[type][i][t]
                            if (t == "atk")
                                msg += " :crossed_swords: " + items[type][i][t]
                            if (t == "bp")
                                msg += "  :fireworks: " + items[type][i][t]
                            if(msg == "")
                                msg = "-"
                        }
                    }
                    embed.addField(+ i + ". " + items[type][i].name, msg, false)
                }
                message.channel.send(embed)
            }
        }

    },*/

    consumables: function (message, command, args) {
        var items = db.get('items').value()
        let embed = new Discord.RichEmbed()
            .setTitle("- Consumables -")
            .setColor("#dcbc3f")
            .setThumbnail("https://cdn.discordapp.com/attachments/233701911168155649/488095324527919104/battle-slots.png")
        for (let i = 0; i < items.consumable.length; i++) {
            var msg = ""
            for (var t in items.consumable[i]) {
                if (items.consumable[i].hasOwnProperty(t) && t != "name") {
                    if (t == "hp") {
                        msg += " :heart: +" + items.consumable[i][t] * 100 + "%"
                    }

                    if (t == "atk") {
                        msg += " :crossed_swords: +" + items.consumable[i][t] * 100 + "%"
                    }

                    if (t == "bp") {
                        if (items.consumable[i].bp > 0) {
                            msg += "  :fireworks: +" + items.consumable[i][t]
                        } else if (items.consumable[i].bp == 0) {
                            msg += "  :fireworks: MAX"
                        }
                    }

                    if (t == "luck") {
                        msg += " :game_die: +" + items.consumable[i][t] + "%"
                    }
                    if (t == "price") {
                        msg += "\nPrice: " + items.consumable[i].price
                    }


                }
            }
            embed.addField(+ i + ". " + items.consumable[i].name, msg, true)
        }
        message.channel.send(embed)

    },
    dungeon: async function (message, command, args) {
        if (!args[0] || !parseInt(args[0]) || parseInt(args[0]) > 25) {
            message.channel.send("Please choose the dungeon level by doing **!dungeon [lvl]** where lvl -> 1 - 25")
            return
        }
        var lvl = parseInt(args[0]) - 1
        var user = getUser(message.author.id)
        if (!user) {
            message.channel.send("You are not registered. Please do !profile to register")
            return
        }

        var stats = getUserStats(user)
        var availPotions = getAvailablePotions(user)
        if (user.gamesToday >= stats.bp) {
            if (availPotions[0] || availPotions[1] || availPotions[2]) {
                var con = await message.channel.send(timeForReset() + "\n Do you want to use one of your potions?")
                for (let i = 0; i < 3; i++) {
                    if (availPotions[i]) {
                        switch (i) {
                            case 0:
                                await con.react("🎇")
                                break;
                            case 1:
                                await con.react("🎆")
                                break;
                            case 2:
                                await con.react("🌠")
                                break;
                            default:
                                break;
                        }
                    }
                }
                var filter = (reaction, usr) => usr.id == user.id
                var collector = con.createReactionCollector(filter);
                var items = db.get('items').value()
                collector.on('collect', r => {
                    switch (r.emoji.name) {
                        case "🎇":
                            user.inventory.consumable.splice(user.inventory.consumable.indexOf(0), 1)
                            db.get('users').find({ id: message.author.id }).assign({ gamesToday: (user.gamesToday - items.consumable[0].bp) }).write()
                            db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                            message.channel.send("BP +" + items.consumable[0].bp)
                            break;
                        case "🎆":
                            user.inventory.consumable.splice(user.inventory.consumable.indexOf(1), 1)
                            db.get('users').find({ id: message.author.id }).assign({ gamesToday: (user.gamesToday - items.consumable[1].bp) }).write()
                            db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                            message.channel.send("BP +" + items.consumable[1].bp)
                            break;
                        case "🌠":
                            user.inventory.consumable.splice(user.inventory.consumable.indexOf(2), 1)
                            db.get('users').find({ id: message.author.id }).assign({ gamesToday: 0 }).write()
                            db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                            message.channel.send("BP MAX")
                            break;
                        default:
                            break;
                    }
                    con.delete()
                    collector.stop()

                });
            }
            else {
                message.channel.send(timeForReset())
            }
            return
        }
        if (lvl + 1 > 5 && user.maxDungeon < 5 || lvl + 1 > 10 && user.maxDungeon < 10 || lvl + 1 > 15 && user.maxDungeon < 15) {
            message.channel.send("You need to complete dungeon " + lvl + " to access this one")
            return
        }
        db.get('users')
            .find({ "id": message.author.id })
            .assign({ "gamesToday": user.gamesToday + 1 })
            .write()
        console.log(stats)

        var mobs = db.get('mobs').value()
        var mob = mobs[lvl][Math.floor(Math.random() * mobs[lvl].length)];

        var elements = ['💧', '🔥', '🌱']

        var mbSel = ""
        var usrSel = ""

        message.channel.send("A wild **" + mob.name + "** appears. Get ready for battle!")


        if (availPotions[3] || availPotions[4] || availPotions[5] || availPotions[6] || availPotions[7] || availPotions[8]) {
            var con = await message.channel.send("Do you want to use a potion for this fight?")
            for (let i = 3; i < availPotions.length; i++) {
                if (availPotions[i]) {
                    switch (i) {
                        case 3:
                            con.react("💙")
                            break;
                        case 4:
                            con.react("💛")
                            break;
                        case 5:
                            con.react("🗡")
                            break;

                        case 6:
                            con.react("🥊")
                            break;

                        case 7:
                            con.react("🌀")
                            break;

                        case 8:
                            con.react("🔱")
                            break;

                        default:
                            break;
                    }
                }
            }
            var filter = (reaction, usr) => usr.id == user.id
            var collector = con.createReactionCollector(filter);
            var items = db.get('items').value()
            collector.on('collect', r => {
                switch (r.emoji.name) {
                    case "💙":
                        user.inventory.consumable.splice(user.inventory.consumable.indexOf(3), 1)
                        db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                        stats.hp += Math.ceil(stats.hp * items.consumable[3].hp)
                        message.channel.send("HP +" + Math.ceil(stats.hp * items.consumable[3].hp))
                        break;
                    case "💛":
                        user.inventory.consumable.splice(user.inventory.consumable.indexOf(4), 1)
                        db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                        stats.hp += Math.ceil(stats.hp * items.consumable[4].hp)
                        message.channel.send("HP +" + Math.ceil(stats.hp * items.consumable[4].hp))
                        break;
                    case "🗡":
                        user.inventory.consumable.splice(user.inventory.consumable.indexOf(5), 1)
                        db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                        stats.atk += Math.ceil(stats.atk * items.consumable[5].atk)
                        message.channel.send("ATK +" + Math.ceil(stats.atk * items.consumable[5].atk))
                        break;

                    case "🥊":
                        user.inventory.consumable.splice(user.inventory.consumable.indexOf(6), 1)
                        db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                        stats.atk += Math.ceil(stats.atk * items.consumable[6].atk)
                        message.channel.send("ATK +" + Math.ceil(stats.atk * items.consumable[6].atk))
                        break;

                    case "🌀":
                        user.inventory.consumable.splice(user.inventory.consumable.indexOf(7), 1)
                        db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                        stats.luck += items.consumable[7].luck
                        message.channel.send("LUCK +" + items.consumable[7].luck)
                        break;

                    case "🔱":
                        user.inventory.consumable.splice(user.inventory.consumable.indexOf(8), 1)
                        db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                        stats.luck += items.consumable[8].luck
                        message.channel.send("LUCK +" + items.consumable[8].luck)
                        break;

                    default:
                        break;
                }
                con.delete()
                collector.stop()
            });
        }



        var battler = async function () {
            return new Promise(async function (resolve, reject) {
                mbSel = elements[Math.floor(Math.random() * elements.length)];
                var msg = await message.channel.send("__Round " + round + "__")
                await msg.react('💧')
                await msg.react('🔥')
                await msg.react('🌱')
                var filter = (reaction, usr) => usr.id == user.id
                var collector = msg.createReactionCollector(filter);
                collector.on('collect', r => {
                    usrSel = r.emoji.name
                    msg.delete()
                    collector.stop()
                    resolve()
                });
            })
        }
        var round = 1
        var tmbDmg = 0
        var tusrDmg = 0
        do {
            await battler()
            var mbDmg = 0
            var usrDmg = 0
            let embed = new Discord.RichEmbed()
                .setTitle("- Round " + round + " Summary -")
                .setColor("#dcbc3f")
                .setThumbnail("https://cdn.discordapp.com/attachments/233701911168155649/488095324527919104/battle-slots.png")
                .addField("Choices", "You: " + usrSel + "\n" + mob.name + ": " + mbSel + "\n----------------------------------------------------")

            if ((usrSel == '💧' && mbSel == '🔥') || (usrSel == '🔥' && mbSel == '🌱') || (usrSel == '🌱' && mbSel == '💧')) {
                mbDmg = stats.atk
                usrDmg = mob.atk
                embed.addField("You Win !", "+" + round * 25 + "% Damage Boost\n----------------------------------------------------")
                mbDmg += (mbDmg * round * 0.25)
            }
            else if (usrSel === mbSel) {
                mbDmg = stats.atk
                usrDmg = mob.atk
                embed.addField("It's a Draw!", "No Multipliers\n----------------------------------------------------")
            }
            else {
                mbDmg = stats.atk
                usrDmg = mob.atk
                embed.addField("You Lost !", "+" + round * 25 + "% Damage Taken\n----------------------------------------------------")
                usrDmg += (usrDmg * round * 0.25)
            }

            round++
            tmbDmg += mbDmg
            tusrDmg += usrDmg

            embed.addField("Damage Dealt", mbDmg, true)
                .addField("Damage Received", usrDmg, true)
                .addField("Your Health", (stats.hp - tusrDmg) + " / " + stats.hp, true)
                .addField(mob.name + " Health", (mob.hp - tmbDmg) + " / " + mob.hp, true)

            await message.channel.send(embed)
        } while (tmbDmg < mob.hp && tusrDmg < stats.hp);
        if (tmbDmg >= mob.hp && tusrDmg < stats.hp) {
            var loot = getLoot(lvl + 1, stats.luck)[0]
            console.log(loot)
            if (loot.result)
                loot = loot.result
            let embed = new Discord.RichEmbed()
                .setTitle("- Battle Summary -")
                .setColor("#dcbc3f")
                .setThumbnail("https://cdn1.iconfinder.com/data/icons/school-icons-2/512/trophy_award_ribon-512.png")
                .addField("Winner", message.member.displayName, true)
                .addField("Loser", mob.name, true)
                .addField("Total Damage Dealt", tmbDmg + "\n--------------", true)
                .addField("Total Damage Received", tusrDmg, true)
                .addField("Loot", "\n--------------", false)
            if (loot != "") {
                var items = db.get('items').value()
                user.inventory[loot.type].push(loot.id)
                db.get('users')
                    .find({ "id": user.id })
                    .assign({ "inventory": user.inventory })
                    .write()
                loot = items[loot.type][loot.id]
                var msg = ""
                for (var t in loot) {
                    if (loot.hasOwnProperty(t) && t != "name") {
                        if (t == "hp") {
                            if (loot[t] < 1 && loot[t] > 0)
                                msg += " :heart: " + loot[t] * 100 + "%"
                            else
                                msg += " :heart: " + loot[t]
                        }
                        if (t == "atk")
                            msg += " :crossed_swords: " + loot[t]
                        if (t == "bp")
                            msg += "  :fireworks: " + loot[t]
                    }
                }
                embed.addField(loot.name, msg, true)
            }
            var lootCoins = 50 * (lvl + 1)
            var usrCoins = ADB.getCoins(message.author.id)
            if (!usrCoins) {
                ADB.addCoins(message.author.id)
                usrCoins = ADB.getCoins(message.author.id)
            }
            ADB.setCoins(message.author.id, usrCoins.amount + lootCoins)
            embed.addField("Arkoins", "+" + lootCoins, true)
            await message.channel.send(embed)
            if (lvl + 1 > user.maxDungeon) {
                db.get('users')
                    .find({ "id": message.author.id })
                    .assign({ "maxDungeon": lvl + 1 })
                    .write()
            }
            db.get('users')
                .find({ "id": message.author.id })
                .assign({ "wins": user.wins + 1 })
                .write()
        } else if (tusrDmg >= stats.hp && tmbDmg < mob.hp) {
            let embed = new Discord.RichEmbed()
                .setTitle("- Battle Summary -")
                .setColor("#dcbc3f")
                .setThumbnail("https://cdn1.iconfinder.com/data/icons/school-icons-2/512/trophy_award_ribon-512.png")
                .addField("Winner", mob.name, true)
                .addField("Loser", message.member.displayName, true)
                .addField("Total Damage Dealt", tmbDmg, true)
                .addField("Total Damage Received", tusrDmg, true)
            await message.channel.send(embed)
            db.get('users')
                .find({ "id": message.author.id })
                .assign({ "loses": user.loses + 1 })
                .write()
        } else {
            let embed = new Discord.RichEmbed()
                .setTitle("- Battle Summary -")
                .setColor("#dcbc3f")
                .setThumbnail("https://cdn1.iconfinder.com/data/icons/school-icons-2/512/trophy_award_ribon-512.png")
                .addField("Draw", "...", false)
                .addField("Total Damage Dealt", tmbDmg + "\n--------------", true)
                .addField("Total Damage Received", tusrDmg, true)
                .addField("- Loot - (Reduced Reward due to Draw)", "--------------", false)
                var lootCoins = 25 * (lvl + 1)
                var usrCoins = ADB.getCoins(message.author.id)
                if (!usrCoins) {
                    ADB.addCoins(message.author.id)
                    usrCoins = ADB.getCoins(message.author.id)
                }
                ADB.setCoins(message.author.id, usrCoins.amount + lootCoins)
                embed.addField("Arkoins", "+" + lootCoins, true)
                await message.channel.send(embed)
        }


    },
    battle: async function (message, command, args) {
        var ment = message.mentions.members.array()
        if (!args[0]) {
            var us = db.get("users").value()

            if (us.length > 24) {
                let embed = new Discord.RichEmbed()
                    .setTitle("- Champions -")
                    .setColor("#dcbc3f")
                for (let i = 0; i < 24; i++) {
                    var ch = ""
                    var st = ""
                    if (us[i].id == message.author.id) {
                        continue
                    }
                    ch += i + ". " + message.guild.members.get(us[i].id).displayName + "\n"
                    var usrStat = getUserStats(us[i])
                    st += "HP: " + usrStat.hp + " ATK: " + usrStat.atk + " BP: " + usrStat.bp + "\n"
                    embed.addField(ch, st, true)
                }
                message.channel.send(embed)
                embed = new Discord.RichEmbed()
                    .setTitle("- Champions -")
                    .setColor("#dcbc3f")
                for (let i = 24; i < us.length; i++) {
                    var ch = ""
                    var st = ""
                    if (us[i].id == message.author.id) {
                        continue
                    }
                    ch += i + ". " + message.guild.members.get(us[i].id).displayName + "\n"
                    var usrStat = getUserStats(us[i])
                    st += "HP: " + usrStat.hp + " ATK: " + usrStat.atk + " BP: " + usrStat.bp + "\n"
                    embed.addField(ch, st, true)
                }
                message.channel.send(embed)
            } else {
                let embed = new Discord.RichEmbed()
                    .setTitle("- Champions -")
                    .setColor("#dcbc3f")
                for (let i = 0; i < us.length; i++) {
                    var ch = ""
                    var st = ""
                    if (us[i].id == message.author.id) {
                        continue
                    }
                    ch += i + ". " + message.guild.members.get(us[i].id).displayName + "\n"
                    var usrStat = getUserStats(us[i])
                    st += "HP: " + usrStat.hp + " ATK: " + usrStat.atk + " BP: " + usrStat.bp + "\n"
                    embed.addField(ch, st, true)
                }
                message.channel.send(embed)
            }



            return
        }
        if ((parseInt(args[0]) != 0 && !parseInt(args[0])) || parseInt(args[0]) > db.get("users").value().length) {
            message.channel.send("Invalid ID")
            return
        }
        var userid2 = db.get("users").value()[parseInt(args[0])].id
        if (userid2 == message.author.id) {
            message.channel.send("You can't battle yourself")
            return
        }
        var user2 = getUser(userid2)
        if (!user2) {
            message.channel.send("Adversary is not registered")
            return
        }
        var user1 = getUser(message.author.id)
        if (!user1) {
            message.channel.send("You are not registered. Please do !profile to register")
            return
        }

        var battleID = db.get('battles').value().length

        var dmg1 = 0
        var dmg2 = 0

        var st1 = getUserStats(user1)
        var st2 = getUserStats(user2)

        var round = 1
        var mn1, mn2
        await message.guild.members.get(user2.id).user.send("You have been challenged by: " + message.member.displayName)
        await message.member.send("You have challenged: " + message.guild.members.get(user2.id).displayName)
        var res1 = ""
        var res2 = ""
        var battler = async function () {
            return new Promise(async function (resolve, reject) {
                var msg1 = await message.author.send("__Round " + round + "__")
                await msg1.react('💧')
                await msg1.react('🔥')
                await msg1.react('🌱')
                var filter1 = (reaction, user) => user.id == user1.id
                var collector1 = msg1.createReactionCollector(filter1);
                collector1.on('collect', r => {
                    res1 = r.emoji.name
                    msg1.delete()
                    message.author.send("\nYou chose " + r.emoji.name).then(m => {
                        mn1 = m
                        collector1.stop()
                        console.log("RES1", res1)
                        if (res2 != "") {
                            mn1.delete()
                            mn2.delete()
                            resolve()
                        }
                    })

                });
                var msg2 = await message.guild.members.get(user2.id).user.send("__Round " + round + "__")
                await msg2.react('💧')
                await msg2.react('🔥')
                await msg2.react('🌱')
                var filter2 = (reaction, user) => user.id == user2.id
                var collector2 = msg2.createReactionCollector(filter2);
                collector2.on('collect', r => {
                    res2 = r.emoji.name
                    msg2.delete()
                    message.guild.members.get(user2.id).user.send("\nYou chose " + r.emoji.name).then(m => {
                        mn2 = m
                        collector2.stop()
                        console.log("RES2", res2)
                        if (res1 != "") {
                            mn1.delete()
                            mn2.delete()
                            resolve()
                        }
                    })

                });
            })
        }
        var mul1 = 0
        var mul2 = 0
        var tdm1 = 0
        var tdm2 = 0
        do {
            await battler()
            let embed1 = new Discord.RichEmbed()
                .setTitle("- Round " + round + " Summary -")
                .setColor("#dcbc3f")
                .setThumbnail("https://cdn.discordapp.com/attachments/233701911168155649/488095324527919104/battle-slots.png")
                .addField("Choices", "You: " + res1 + "\n" + message.guild.members.get(user2.id).displayName + ": " + res2 + "\n----------------------------------------------------")

            let embed2 = new Discord.RichEmbed()
                .setTitle("- Round " + round + " Summary -")
                .setColor("#dcbc3f")
                .setThumbnail("https://cdn.discordapp.com/attachments/233701911168155649/488095324527919104/battle-slots.png")
                .addField("Choices", "You: " + res2 + "\n" + message.member.displayName + ": " + res1 + "\n----------------------------------------------------")

            if ((res1 == '💧' && res2 == '🔥') || (res1 == '🔥' && res2 == '🌱') || (res1 == '🌱' && res2 == '💧')) {
                dmg2 += st1.atk
                dmg1 += st2.atk
                embed1.addField("You Win !", "+" + round * 25 + "% Damage Boost\n----------------------------------------------------")
                embed2.addField("You Lost !", "+" + round * 25 + "% Damage Taken\n----------------------------------------------------")
                mul1 = round
            }
            else if (res1 === res2) {
                dmg2 += st1.atk
                dmg1 += st2.atk
                embed1.addField("It's a Draw!", "No Multipliers\n----------------------------------------------------")
                embed2.addField("It's a Draw!", "No Multipliers\n----------------------------------------------------")
            }
            else {
                dmg1 += st2.atk
                dmg2 += st1.atk
                embed2.addField("You Win !", "+" + round * 25 + "% Damage Boost\n----------------------------------------------------")
                embed1.addField("You Lost !", "+" + round * 25 + "% Damage Taken\n----------------------------------------------------")
                mul2 = round
            }
            dmg2 += (dmg2 * mul1 * 0.25)
            dmg1 += (dmg1 * mul2 * 0.25)
            round++
            res1 = ""
            res2 = ""
            mul1 = 0
            mul2 = 0
            tdm1 += dmg1
            tdm2 += dmg2

            embed1.addField("Damage Dealt", dmg2, true)
                .addField("Damage Received", dmg1, true)
                .addField("Your Health", (st1.hp - tdm1) + " / " + st1.hp, true)
                .addField(message.guild.members.get(user2.id).displayName + "'s Health", (st2.hp - tdm2) + " / " + st2.hp, true)

            embed2.addField("Damage Dealt", dmg1, true)
                .addField("Damage Received", dmg2, true)
                .addField("Your Health", (st2.hp - tdm2) + " / " + st2.hp, true)
                .addField(message.member.displayName + "'s Health", (st1.hp - tdm1) + " / " + st1.hp, true)

            await message.author.send(embed1)
            await message.guild.members.get(user2.id).user.send(embed2)
            dmg1 = 0
            dmg2 = 0


        } while (tdm1 < st1.hp && tdm2 < st2.hp);




        if (tdm2 >= st2.hp && tdm1 < st1.hp) {
            let embed1 = new Discord.RichEmbed()
                .setTitle("- Battle Summary -")
                .setColor("#dcbc3f")
                .setThumbnail("https://cdn1.iconfinder.com/data/icons/school-icons-2/512/trophy_award_ribon-512.png")
                .addField("Winner", "You", true)
                .addField("Loser", message.guild.members.get(user2.id).displayName, true)
                .addField("Total Damage Dealt", tdm2, true)
                .addField("Total Damage Received", tdm1, true)

            let embed2 = new Discord.RichEmbed()
                .setTitle("- Battle Summary -")
                .setColor("#dcbc3f")
                .setThumbnail("https://cdn1.iconfinder.com/data/icons/school-icons-2/512/trophy_award_ribon-512.png")
                .addField("Winner", message.member.displayName, true)
                .addField("Loser", "You", true)
                .addField("Total Damage Dealt", tdm1, true)
                .addField("Total Damage Received", tdm2, true)
            await message.guild.members.get(user2.id).user.send(embed2)
            await message.member.send(embed1)
            db.get('users')
                .find({ "id": message.author.id })
                .assign({ "wins": user1.wins + 1 })
                .write()
            db.get('users')
                .find({ "id": user2.id })
                .assign({ "loses": user2.loses + 1 })
                .write()
            db.get('users')
                .find({ "id": message.author.id })
                .assign({ "pvpwins": user1.pvpwins + 1 })
                .write()
            db.get('users')
                .find({ "id": user2.id })
                .assign({ "pvploses": user2.pvploses + 1 })
                .write()
        } else if (tdm1 >= st1.hp && tdm2 < st2.hp) {
            let embed1 = new Discord.RichEmbed()
                .setTitle("- Battle Summary -")
                .setColor("#dcbc3f")
                .setThumbnail("https://cdn1.iconfinder.com/data/icons/school-icons-2/512/trophy_award_ribon-512.png")
                .addField("Winner", message.guild.members.get(user2.id).displayName, true)
                .addField("Loser", "You", true)
                .addField("Total Damage Dealt", tdm2, true)
                .addField("Total Damage Received", tdm1, true)

            let embed2 = new Discord.RichEmbed()
                .setTitle("- Battle Summary -")
                .setColor("#dcbc3f")
                .setThumbnail("https://cdn1.iconfinder.com/data/icons/school-icons-2/512/trophy_award_ribon-512.png")
                .addField("Winner", "You", true)
                .addField("Loser", message.member.displayName, true)
                .addField("Total Damage Dealt", tdm1, true)
                .addField("Total Damage Received", tdm2, true)
            await message.guild.members.get(user2.id).user.send(embed2)
            await message.member.send(embed1)
            db.get('users')
                .find({ "id": message.author.id })
                .assign({ "loses": user1.loses + 1 })
                .write()
            db.get('users')
                .find({ "id": user2.id })
                .assign({ "wins": user2.wins + 1 })
                .write()
            db.get('users')
                .find({ "id": message.author.id })
                .assign({ "pvploses": user1.pvploses + 1 })
                .write()
            db.get('users')
                .find({ "id": user2.id })
                .assign({ "pvpwins": user2.pvpwins + 1 })
                .write()
        } else {
            let embed1 = new Discord.RichEmbed()
                .setTitle("- Battle Summary -")
                .setColor("#dcbc3f")
                .setThumbnail("https://cdn1.iconfinder.com/data/icons/school-icons-2/512/trophy_award_ribon-512.png")
                .addField("Draw", "...", true)
                .addField("Total Damage Dealt", tdm2, true)
                .addField("Total Damage Received", tdm1, true)

            let embed2 = new Discord.RichEmbed()
                .setTitle("- Battle Summary -")
                .setColor("#dcbc3f")
                .setThumbnail("https://cdn1.iconfinder.com/data/icons/school-icons-2/512/trophy_award_ribon-512.png")
                .addField("Draw", "...", true)
                .addField("Total Damage Dealt", tdm1, true)
                .addField("Total Damage Received", tdm2, true)
            await message.guild.members.get(user2.id).user.send(embed2)
            await message.member.send(embed1)
        }
    },
}