const fs = require('fs')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('data/battles.json')
const db = low(adapter)
var Discord = require("discord.js");

db.defaults({
    users: [],
    battles: [],
    items: {
        helmet: [
            {
                name: "Messy Morning Hair",
                hp: 5
            },
            {
                name: "Party Hat",
                hp: 8
            },
            {
                name: "A Wig from the attic",
                hp: 12
            },
            {
                name: "Kitchen Lady's Hairnet",
                hp: 15
            },
            {
                name: "Caesar's Laurel Wreath",
                hp: 25
            },
            {
                name: "Bart Simpson's Spiky Hair",
                hp: 30
            },
            {
                name: "Daft Punk's Rainbow Helmet",
                hp: 45,
                bp: 1
            },
            {
                name: "Crash Bandicoot's Aku Aku Mask",
                hp: 70
            },
            {
                name: "Loki's Horns",
                hp: 120,
                bp: 2
            },
            {
                name: "Cubone's Skull",
                hp: 125
            },
            {
                name: "Goldi's Locks",
                hp: 150
            },
            {
                name: "Darth Vader Helmet",
                hp: 180
            },
            {
                name: "Majora's Mask",
                hp: 210
            },
            {
                name: "Medusa's Severed Head",
                hp: 300
            },
            {
                name: "Batman's Ears",
                atk: 50,
                hp: 500,
                bp: 2
            },
            {
                name: "Sunbro's Bucket Helm",
                atk: 100,
                hp: 800
            },
            {
                name: "The Mask",
                atk: 250,
                hp: 1250
            },
            {
                name: "Cuphead's Cup Head",
                atk: 1000,
                hp: 5000,
                bp: 5
            }
        ],
        chest: [
            {
                name: "Dirty T-Shirt",
                hp: 5
            },
            {
                name: "Mom's Apron",
                hp: 8
            },
            {
                name: "A Mexican's Pancho",
                hp: 45
            },
            {
                name: "Rathalos Armor",
                hp: 115
            },
            {
                name: "The Arc Reactor",
                hp: 275
            },
            {
                name: "Samus' Suit",
                hp: 400
            },
            {
                name: "Donkey Kong's Barrel",
                hp: 900
            },
            {
                name: "Deadpool's Overalls",
                hp: 1500
            },
            {
                name: "Arnold's Muscular Chest",
                hp: 3000
            },
            {
                name: "Pedobear Suit",
                hp: 5000
            }
        ],
        pants: [
            {
                name: "Stained Shorts",
                hp: 5
            },
            {
                name: "Hawaiian Skirt",
                hp: 10
            },
            {
                name: "Hula Hoop",
                hp: 35
            },
            {
                name: "Your Mom's Leopard Thong",
                hp: 80
            },
            {
                name: "Tarzan's Crotch Cloth",
                hp: 150
            },
            {
                name: "Tommy Pickle's Diaper",
                hp: 300
            },
            {
                name: "Your Dad's Speedo",
                hp: 900
            },
            {
                name: "Adam's Crotch Leaf",
                hp: 2000
            },
            {
                name: "Hulk's Ripped Shorts",
                hp: 5000
            }
        ],
        boots: [
            {
                name: "Flip Flops",
                hp: 5
            },
            {
                name: "Socks and Sandals",
                hp: 10
            },
            {
                name: "A Samurai's Wooden Tongs",
                hp: 35
            },
            {
                name: "Puss in Boots",
                hp: 80
            },
            {
                name: "Hermes' Flying Boots",
                hp: 175
            },
            {
                name: "Cinderalla's Glass Slipper",
                hp: 200
            },
            {
                name: "Sonic's Speedy Shoes",
                hp: 450
            },
            {
                name: "Boots from Dora the Explorer",
                hp: 1000
            },
            {
                name: "One Punch Man's Red Rubber Boots",
                hp: 3000
            },
            {
                name: "Dobby's Socks",
                hp: 5000
            }
        ],
        accessory: [
            {
                name: "Grandpa's Wristwatch",
                hp: 5
            },
            {
                name: "Michael Jackson's White Glove",
                hp: 5
            },
            {
                name: "One Punch Man's Rubber Glove",
                hp: 5
            },
            {
                name: "Sauron's Ring",
                hp: 5
            },
            {
                name: "Ben 10's Omnitrix",
                hp: 5
            },
            {
                name: "Sorcerer's Stone",
                hp: 5
            },
            {
                name: "Masterball",
                hp: 5
            },
            {
                name: "Maurauder's Map",
                hp: 5
            },
            {
                name: "Goblet of Fire",
                hp: 5
            },
            {
                name: "Wild E. Coyote's ACME Box",
                hp: 5
            },
            {
                name: "Pegasus Wings",
                hp: 5
            },
            {
                name: "Nimbus Cloud",
                hp: 5
            },
            {
                name: "Dragonballs",
                hp: 5
            },
            {
                name: "Yoshi's Egg",
                hp: 5
            },
            {
                name: "Mario Sunshine's Jetpack",
                hp: 5
            },
            {
                name: "Harry's Invisibility Cloak",
                hp: 5
            },
            {
                name: "Dora's Backpack",
                hp: 5
            },
            {
                name: "Batman's Utility Belt",
                hp: 5
            },
            {
                name: "Scooby Snacks",
                hp: 5
            },
            {
                name: "Companion Cube",
                hp: 5
            }
        ],
        weapon: [
            {
                name: "A Wet Toothbrush",
                atk: 5
            },
            {
                name: "A Schoolkid's Rubber Slingshot",
                atk: 12
            },
            {
                name: "Bob Ross's Paintbrush",
                atk: 45
            },
            {
                name: "Skywalker's Right Hand",
                atk: 100,
                hp: -20
            },
            {
                name: "Here's Johnny's Axe",
                atk: 85
            },
            {
                name: "Elon Musk's Flamethrower",
                atk: 250,
                bp: 1,
                hp: -100
            },
            {
                name: "Spock's Phaser",
                atk: 190
            },
            {
                name: "An Abandoned Portal Gun",
                atk: 250
            },
            {
                name: "Gordon's Crowbar",
                atk: 325,
                hp: -50
            },
            {
                name: "Hulk's Giant Fist",
                atk: 600,
                hp: -250
            },
            {
                name: "Olivander's Wand",
                atk: 300,
                bp: 1
            },
            {
                name: "Merlin's Sword",
                atk: 420
            },
            {
                name: "Deathnote",
                atk: 375,
                hp: -100,
                bp: 2
            },
            {
                name: "Thor's Hammer",
                atk: 475
            },
            {
                name: "Holy Hand Grenade",
                atk: 600,
                hp: -100
            },
            {
                name: "A Tetris Block",
                atk: 850
            },
            {
                name: "The Infinity Gauntlet",
                atk: 750,
                hp: -400,
                bp: 4
            },
            {
                name: "Kirby's Big Succ",
                atk: 1500,
                bp: 2
            },
            {
                name: "Anime Body Pillow",
                atk: 3000,
                hp: -300
            },
        ]
    }
})
    .write()

function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createUser(member) {
    var userData = {
        id: member.id,
        damageTaken: 0,
        inventory: {
            helmet: [],
            chest: [],
            pants: [],
            boots: [],
            accessory: [],
            weapon: [],
            other: []
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

function getUserStats(user) {
    var items = db.get('items').value()
    var atk = 0
    var hp = 50
    var bp = 5
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
        }
    }
    return { atk: atk, hp: hp, bp: bp }
}

function printProfile(user, message) {
    var items = db.get('items').value()
    var stats = getUserStats(user)
    let embed = new Discord.RichEmbed()
        .setTitle("- Battle Profile -")
        .setDescription("For " + message.guild.members.get(user.id).displayName + "\n------------------------------------------------------------------")
        .setColor("#dcbc3f")
        .setThumbnail("https://cdn.discordapp.com/attachments/233701911168155649/488095324527919104/battle-slots.png")
        .addField("Ranking: #1", "Battles Won: 0\nBattles Lost: 0\n------------------------------------------------------------------")
        .addField("Attributes", "------------------------------------------------------------------\n\n:heart: Health: " + (stats.hp - user.damageTaken) + " / " + stats.hp + "\n:crossed_swords: Attack: " + stats.atk + "\n:fireworks: Battle Points: " + stats.bp + "\n\n------------------------------------------------------------------")
        .addField("Equipment", "------------------------------------------------------------------")
    for (var type in user.equiped) {
        if (user.equiped.hasOwnProperty(type)) {
            var itemDesc = "**" + items[type][user.equiped[type]].name + "**"
            if (items[type][user.equiped[type]].hp) {
                itemDesc += ("\n   *HP +" + items[type][user.equiped[type]].hp + "*")
            }
            if (items[type][user.equiped[type]].atk) {
                itemDesc += ("\n   *ATK +" + items[type][user.equiped[type]].atk + "*")
            }
            if (items[type][user.equiped[type]].bp) {
                itemDesc += ("\n   *BP +" + items[type][user.equiped[type]].bp + "*")
            }
            embed.addField(cap(type), itemDesc + "\n", true)
        }
    }
    message.channel.send(embed)
}

module.exports = {
    profile: function (message, command, args) {
        var user = getUser(message.author.id)
        if (!user) {
            createUser(message.member)
            user = getUser(message.author.id)
        }
        printProfile(user, message)
    },
    battleshop: function (message, command, args) {
        var items = db.get('items').value()
        for (var type in items) {
            if (items.hasOwnProperty(type)) {
                let embed = new Discord.RichEmbed()
                .setTitle("- Battle Shop -")
                .setColor("#dcbc3f")
                .setThumbnail("https://cdn.discordapp.com/attachments/233701911168155649/488095324527919104/battle-slots.png")
                var msg = ""
                var st = ""
                for (let i = 0; i < items[type].length; i++) {
                    msg += (i + ". " + items[type][i].name + "\n")
                    for (var t in items[type][i]) {
                        if (items[type][i].hasOwnProperty(t) && t != "name") {
                            if(t == "hp")
                                msg += " :heart: " + items[type][i][t]
                            if(t == "atk")
                                msg += " :crossed_swords: " + items[type][i][t]
                            if(t == "bp")
                                msg += "  :fireworks: " + items[type][i][t]
                        }
                    }
                    msg += "\n"
                }
                embed.addField(cap(type), msg, true)
                message.channel.send(embed)
            }
        }
        
    },
    battle: async function (message, command, args) {
        var ment = message.mentions.members.array()
        if (!args[0]) {
            message.channel.send("Invalid adversary")
            return
        }
        var user2 = getUser(args[0])
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
        await message.guild.members.get(args[0]).user.send("You have been challenged by: " + message.member.displayName)
        await message.member.send("You have challenged: " + message.guild.members.get(args[0]).displayName)
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
                var msg2 = await message.guild.members.get(args[0]).user.send("__Round " + round + "__")
                await msg2.react('💧')
                await msg2.react('🔥')
                await msg2.react('🌱')
                var filter2 = (reaction, user) => user.id == user2.id
                var collector2 = msg2.createReactionCollector(filter2);
                collector2.on('collect', r => {
                    res2 = r.emoji.name
                    msg2.delete()
                    message.guild.members.get(args[0]).user.send("\nYou chose " + r.emoji.name).then(m => {
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
                .addField("Choices", "You: " + res1 + "\n" + message.guild.members.get(args[0]).displayName + ": " + res2 + "\n----------------------------------------------------")

            let embed2 = new Discord.RichEmbed()
                .setTitle("- Round " + round + " Summary -")
                .setColor("#dcbc3f")
                .setThumbnail("https://cdn.discordapp.com/attachments/233701911168155649/488095324527919104/battle-slots.png")
                .addField("Choices", "You: " + res2 + "\n" + message.member.displayName + ": " + res1 + "\n----------------------------------------------------")

            if ((res1 == '💧' && res2 == '🔥') || (res1 == '🔥' && res2 == '🌱') || (res1 == '🌱' && res2 == '💧')) {
                dmg2 += (st1.atk * 2)
                dmg1 += (st2.atk / 2)
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
                dmg1 += (st2.atk * 2)
                dmg2 += (st1.atk / 2)
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
                .addField(message.guild.members.get(args[0]).displayName + "'s Health", (st2.hp - tdm2) + " / " + st2.hp, true)

            embed2.addField("Damage Dealt", dmg1, true)
                .addField("Damage Received", dmg2, true)
                .addField("Your Health", (st2.hp - tdm2) + " / " + st2.hp, true)
                .addField(message.member.displayName + "'s Health", (st1.hp - tdm1) + " / " + st1.hp, true)

            message.author.send(embed1)
            message.guild.members.get(args[0]).user.send(embed2)
            dmg1 = 0
            dmg2 = 0


        } while (tdm1 < st1.hp && tdm2 < st2.hp);




        if (tdm2 >= st2.hp && tdm1 < st1.hp) {
            let embed1 = new Discord.RichEmbed()
                .setTitle("- Battle Summary -")
                .setColor("#dcbc3f")
                .setThumbnail("https://cdn1.iconfinder.com/data/icons/school-icons-2/512/trophy_award_ribon-512.png")
                .addField("Winner", "You", true)
                .addField("Loser", message.guild.members.get(args[0]).displayName, true)
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
            await message.guild.members.get(args[0]).user.send(embed2)
            await message.member.send(embed1)
        } else if (tdm1 >= st1.hp && tdm2 < st2.hp) {
            let embed1 = new Discord.RichEmbed()
                .setTitle("- Battle Summary -")
                .setColor("#dcbc3f")
                .setThumbnail("https://cdn1.iconfinder.com/data/icons/school-icons-2/512/trophy_award_ribon-512.png")
                .addField("Winner", message.guild.members.get(args[0]).displayName, true)
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
            await message.guild.members.get(args[0]).user.send(embed2)
            await message.member.send(embed1)
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
            await message.guild.members.get(args[0]).user.send(embed2)
            await message.member.send(embed1)
        }


    },
}