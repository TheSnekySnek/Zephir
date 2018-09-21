const fs = require('fs')
const schedule = require('node-schedule')
const lootastic = require('lootastic')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('data/battles.json')
const db = low(adapter)
var Discord = require("discord.js");
const ADB = require('../../modules/db')
var defaultTemplate = require('./defaults/defbattles.json')



db.defaults(defaultTemplate).write()

global.setBattleMobs = function(mobs) {
    db.set("mobs", mobs).write()
}

global.setBattleItems = function(items) {
    db.set("items", items).write()
}

global.getBattleMobs = function(mobs) {
    return db.get("mobs").value()
}

global.getBattleItems = function(items) {
    return db.get("items").value()
}

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

    return "You've used all your battle points! \nCome back in **" + hours + "h " + minutes + "m " + seconds + "s** for a free refill."
}

function getLoot(lvl, luck) {
    var bs = ADB.getBattleSettings()
    var items = db.get('items').value()
    var dnum = db.get('mobs').value().length
    var lootArray = []
    for (var type in items) {
        if (items.hasOwnProperty(type)) {
            for (let i = Math.round((items.weapon.length / dnum) * (lvl - 1)); i < items[type].length; i++) {
                lootArray.push({ chance: Math.ceil((100000 / Math.pow(2, i - (Math.round((items.weapon.length / dnum) * (lvl - 1)))))), result: { type: type, id: i } })
                //lootArray.push({ chance: getLootZ(type, i, lvl)*100, result: { type: type, id: i } })
            }
        }
    }
    lootArray.push({ chance: bs.noDropRate / (luck), result: "" })
    console.log(lootArray)
    let lootTable = new lootastic.LootTable(lootArray)
    let loot = lootTable.chooseWithReplacement(1)
    console.log(loot)
    return loot
}

function getLootZ(type, id, lvl) {
    var items = db.get('items').value()
    var i1dc = 100
    var i2dc = 40
    return Math.round((((items[type][id].lvl) - items.weapon.length)*-1)/100) + (( ((i1dc/100) - ( (((i1dc-i2dc)/100)/(items.weapon.length/100)) * items[type][id].lvl)/100)) / (25-1) * lvl-1) - ((0.2/(25-1)) *lvl-1);
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
    var bs = ADB.getBattleSettings()
    var items = db.get('items').value()
    var atk = bs.baseATK
    var hp = bs.baseHP
    var bp = bs.baseBP
    var luck = bs.baseLuck
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
    var cbp = stats.bp - user.gamesToday
    if(cbp < 0)
        cbp = 0
    let embed = new Discord.RichEmbed()
        .setTitle("- Battle Profile -")
        .setDescription("For " + client.guilds.get(ADB.getBotData().guild).members.get(message.author.id).displayName + "\n------------------------------------------------------------------")
        .setColor("#dcbc3f")
        .setThumbnail("https://cdn.discordapp.com/attachments/233701911168155649/488095324527919104/battle-slots.png")
        .addField("Ranking: Unavailable", "Battles Won: " + user.wins + "\nBattles Lost: " + user.loses + "\nPVP Battles Won: " + user.pvpwins + "\nPVP Battles Lost: " + user.pvploses + "\n------------------------------------------------------------------")
        .addField("Attributes", "------------------------------------------------------------------\n\n:heart: Health: " + (stats.hp - user.damageTaken) + " / " + stats.hp + "\n:crossed_swords: Attack: " + stats.atk + "\n:game_die:  Luck: " + stats.luck + "\n:fireworks: Battle Points: " + cbp + " / " + stats.bp + "\n\n------------------------------------------------------------------")
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

function printInventory(user, message, args) {
    var items = db.get('items').value()
    if (args[0] && args[0] == "helmet" || args[0] == "chest" || args[0] == "pants" || args[0] == "boots" || args[0] == "accessory" || args[0] == "weapon" || args[0] == "consumable") {
        var type = args[0]
        var ItemsType = []
        //for each items in database
        for (let i = 0; i < items[type].length; i++) {
            var tot = 0
            for (let k = 0; k < user.inventory[type].length; k++) {
                //If we have the item
                if (user.inventory[type][k] == i)
                    // Quantity +1
                    tot++
            }
            //Add quantity of item
            ItemsType.push(tot)
        }
        console.log(ItemsType)
        let embed = new Discord.RichEmbed()
            .setTitle("- " + cap(type) + " -")
            .setColor("#dcbc3f")
        for (let i = 0; i < ItemsType.length; i++) {
            if (ItemsType[i] > 0) {

                var item = items[type][i]
                var itemDesc = ""

                if (item.hp) {
                    if (item.hp < 1 && item.hp > 0)
                        itemDesc += (" :heart: +" + item.hp * 100 + "%")
                    else
                        itemDesc += (" :heart: " + item.hp)
                }
                if (item.atk) {
                    if (item.atk < 1 && item.atk > 0)
                        itemDesc += ("  :crossed_swords: +" + item.atk * 100 + "%")
                    else
                        itemDesc += ("  :crossed_swords: " + item.atk)
                }
                if (item.bp || item.bp == 0) {
                    if (type == "consumable") {
                        if (item.bp == 0)
                            itemDesc += (" :fireworks: MAX")
                        else
                            itemDesc += ("  :fireworks: +" + item.bp)
                    }

                    else
                        itemDesc += ("  :fireworks: " + item.bp)

                }
                if (item.luck) {
                    itemDesc += ("  :game_die: " + item.luck)
                }

                embed.addField(i + ". {lvl." + item.lvl + "} - " + item.name, itemDesc + "\n:moneybag: Price: " + item.lvl * 100 + "\n:scales: Quantity: " + ItemsType[i] + "\n- - - - - - - - - - - - - - - ", false)
            }
        }
        message.author.send(embed)
    } else if (args[0]) {
        message.channel.send("Invalid Item Type")
    }
    else {
        for (var type in user.inventory) {
            if (user.inventory.hasOwnProperty(type) && type != "consumable") {


                var ItemsType = []
                //for each items in database
                for (let i = 0; i < items[type].length; i++) {
                    var tot = 0
                    for (let k = 0; k < user.inventory[type].length; k++) {
                        //If we have the item
                        if (user.inventory[type][k] == i)
                            // Quantity +1
                            tot++
                    }
                    //Add quantity of item
                    ItemsType.push(tot)
                }
                console.log(ItemsType)
                let embed = new Discord.RichEmbed()
                    .setTitle("- " + cap(type) + " -")
                    .setColor("#dcbc3f")
                for (let i = 0; i < ItemsType.length; i++) {
                    if (ItemsType[i] > 0) {

                        var item = items[type][i]
                        var itemDesc = ""

                        if (item.hp) {
                            if (item.hp < 1 && item.hp > 0)
                                itemDesc += (" :heart: +" + item.hp * 100 + "%")
                            else
                                itemDesc += (" :heart: " + item.hp)
                        }
                        if (item.atk) {
                            if (item.atk < 1 && item.atk > 0)
                                itemDesc += ("  :crossed_swords: +" + item.atk * 100 + "%")
                            else
                                itemDesc += ("  :crossed_swords: " + item.atk)
                        }
                        if (item.bp || item.bp == 0) {
                            if (type == "consumable") {
                                if (item.bp == 0)
                                    itemDesc += (" :fireworks: MAX")
                                else
                                    itemDesc += ("  :fireworks: +" + item.bp)
                            }

                            else
                                itemDesc += ("  :fireworks: " + item.bp)

                        }
                        if (item.luck) {
                            itemDesc += ("  :game_die: " + item.luck)
                        }

                        embed.addField(i + ". {lvl." + item.lvl + "} - " + item.name, itemDesc + "\n:moneybag: Price: " + item.lvl * 100 + "\n:scales: Quantity: " + ItemsType[i] + "\n- - - - - - - - - - - - - - - ", false)
                    }
                }
                message.author.send(embed)
            }
            else if (type == "consumable") {
                let embed = new Discord.RichEmbed()
                    .setTitle("- " + cap(type) + " -")
                    .setColor("#dcbc3f")
                var pot = getAvailablePotions(user)
                for (let i = 0; i < pot.length; i++) {
                    if (pot[i] > 0) {
                        if (items.consumable[i].name == "Small Dungeon Potion") {
                            embed.addField(":blue_heart: Small Dungeon Potion", "Quantity: " + pot[i], false)
                        }
                        if (items.consumable[i].name == "Large Dungeon Potion") {
                            embed.addField(":yellow_heart: Large Dungeon Potion", "Quantity: " + pot[i], false)
                        }
                        if (items.consumable[i].name == "Small Dungeon Elixir") {
                            embed.addField(":dagger: Small Dungeon Elixir", "Quantity: " + pot[i], false)
                        }
                        if (items.consumable[i].name == "Large Dungeon Elixir") {
                            embed.addField(":boxing_glove: Large Dungeon Elixir", "Quantity: " + pot[i], false)
                        }
                        if (items.consumable[i].name == "Small Magic Elixir") {
                            embed.addField(":cyclone: Small Magic Elixir", "Quantity: " + pot[i], false)
                        }
                        if (items.consumable[i].name == "Large Magic Elixir") {
                            embed.addField(":trident: Large Magic Elixir", "Quantity: " + pot[i], false)
                        }
                        if (items.consumable[i].name == "Small BP Potion") {
                            embed.addField(":fireworks: Small BP Potion", "Quantity: " + pot[i], false)
                        }
                        if (items.consumable[i].name == "Large BP Potion") {
                            embed.addField(":stars: Large BP Potion", "Quantity: " + pot[i], false)
                        }
                        if (items.consumable[i].name == "Fill Me Up Scotty") {
                            embed.addField(":milky_way: Fill Me Up Scotty", "Quantity: " + pot[i], false)
                        }

                    }
                }

                message.author.send(embed)
            }
        }
    }
}

function getAvailableChampions(lvl) {
    var av = []
    var us = db.get("users").value()
    for (let i = 0; i < us.length; i++) {
        if ((lvl - us[i].maxDungeon) > ADB.getBattleSettings().maxLvlDif) {
            continue
        }
        av.push(i)
    }
    return av
}




if (ADB.getBattleSettings().enabled) {
    module.exports = {
        battlerank: function (message, command, args) {
            var users = db.get('users').value()
            function bylvl(a,b) {
                if(a.maxDungeon > b.maxDungeon)
                    return -1
                else if(a.maxDungeon < b.maxDungeon)
                    return 1
                else{
                    var ratioa = (a.wins + a.pvpwins) / ((a.loses + a.pvploses)+1)
                    var ratiob = (b.wins + b.pvpwins) / ((b.loses + b.pvploses)+1)
                    if(ratioa > ratiob)
                        return -1
                    else if(ratioa < ratiob)
                        return 1
                    else{
                        var ta = a.wins + a.pvpwins + a.loses + a.pvploses
                        var tb = b.wins + b.pvpwins + b.loses + b.pvploses
                        if(ta > tb)
                            return -1
                        else if(ta < tb)
                            return 1
                    }
                }
            }
            users.sort(bylvl)
            let embed = new Discord.RichEmbed()
                        .setColor("#dcbc3f")
                        .setThumbnail("https://cdn.discordapp.com/attachments/233701911168155649/478976690895192065/leaderboard-300x300.png")
                        .addField("- Battle Ranks -", "----------------------")
            var usrRank
            for (let i = 0; i < 20; i++) {
                if(!users[i])
                    break
                if(!client.guilds.get(ADB.getBotData().guild).members.get(users[i].id)){
                    embed.addField((i+1) + ". " + "Missing user", "User has left", true)
                    continue
                }
                if(message.author.id == users[i].id)
                    usrRank = i+1
                var ratio = (users[i].wins + users[i].pvpwins) / ((users[i].loses + users[i].pvploses)+1)
                embed.addField((i+1) + ". " + client.guilds.get(ADB.getBotData().guild).members.get(users[i].id).displayName, "Highest Dungeon: " + users[i].maxDungeon + "\nTotal Games: " + (users[i].wins + users[i].loses + users[i].pvpwins + users[i].pvploses) + "\nWin Ratio: " +  ratio.toFixed(2), true)
            }
            var ratio = (users[usrRank-1].wins + users[usrRank-1].pvpwins) / ((users[usrRank-1].loses + users[usrRank-1].pvploses)+1)
            embed.setTitle( usrRank + ". "  + client.guilds.get(ADB.getBotData().guild).members.get(message.author.id).displayName)
            embed.setDescription("Highest Dungeon: " + users[usrRank-1].maxDungeon + "\nTotal Games: " + (users[usrRank-1].wins + users[usrRank-1].loses + users[usrRank-1].pvpwins + users[usrRank-1].pvploses) + "\nWin Ratio: " +  ratio.toFixed(2) + "\n----------------------" )

            message.channel.send(embed)
        },
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
                    createUser(message.author)
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
            if (!ADB.getBattleSettings().allowBuy) {
                return
            }
            var HR = client.guilds.get(ADB.getBotData().guild).members.get(message.author.id).highestRole.name
            if ((HR != "Owner" && HR != "Co-Owner" && HR != "Beta Testing") && args[0] != "consumable") {
                message.channel.send("Invalid Command")
                return
            }
            var items = db.get('items').value()
            var user = getUser(message.author.id)
            if (!user) {
                message.channel.send("You are not registered. Please do !profile to register")
                return
            }

            var kind = args[0]
            if ((HR != "Owner" && HR != "Co-Owner" && HR != "Beta Testing") && args[0] == "consumable") {
                if ((parseInt(args[1]) != 0 || parseInt(args[1]) > items[kind].length) && (!parseInt(args[1]) || parseInt(args[1]) > items[kind].length)) {
                    message.channel.send("Invalid Item ID")
                    return
                }
                var userCoins = ADB.getCoins(message.author.id).amount
                if (userCoins < items.consumable[args[1]].price) {
                    message.channel.send("You don't have enough arkoins.")
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

        sell: function (message, command, args) {
            if (!ADB.getBattleSettings().allowSell) {
                return
            }
            var items = db.get('items').value()
            var user = getUser(message.author.id)
            var kind = args[0]


            if (!user) {
                message.channel.send("You are not registered. Please do !profile to register")
                return
            }

            if (kind != "helmet" && kind != "chest" && kind != "pants" && kind != "boots" && kind != "accessory" && kind != "weapon") {
                message.channel.send("Invalid equipment type.")
                return
            }
            if ((parseInt(args[1]) != 0 || parseInt(args[1]) > items[kind].length - 1) && (!parseInt(args[1]) || parseInt(args[1]) > items[kind].length - 1)) {
                message.channel.send("Invalid Item ID.")
                return
            }
            var id = parseInt(args[1])
            var selItem = user.inventory[kind].indexOf(id)
            if (selItem < 0) {
                message.channel.send("You do not have this item.")
                return
            }

            if (items[kind][id]) {
                user.inventory[kind].splice(selItem, 1)
                db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
            }

            var usrCoins = ADB.getCoins(message.author.id).amount
            if (!usrCoins) {
                ADB.addCoins(message.author.id)
                usrCoins = ADB.getCoins(message.author.id).amount
            }
            ADB.setCoins(message.author.id, usrCoins + (items[kind][id].lvl * 100))
            message.channel.send("Sold **" + items[kind][id].name + "**:" + "\n+ " + (items[kind][id].lvl * 100) + " Arkoins!")

            //INPUT BATTLE CHANNEL HERE ~~
            if (message.channel.type == "dm") {
                client.guilds.get(ADB.getBotData().guild).channels.get(ADB.getBattleSettings().textChannel).send("__" + client.guilds.get(ADB.getBotData().guild).members.get(message.author.id).displayName + "__ sold **" + items[kind][id].name + "**:" + "\n+ " + (items[kind][id].lvl * 100) + " Arkoins!")
            }
        },

        inventory: function (message, command, args) {
            var user = getUser(message.author.id)

            if (!user) {
                return
            }
            printInventory(user, message, args)
        },

        inv: function (message, command, args) {
            var user = getUser(message.author.id)

            if (!user) {
                return
            }
            printInventory(user, message, args)
        },

        equip: function (message, command, args) {
            var items = db.get('items').value()
            var user = getUser(message.author.id)
            var stats = getUserStats(user)
            var kind = args[0]
            var id = parseInt(args[1])


            if (!user) {
                message.channel.send("You are not registered. Please do !profile to register")
                return
            }

            if (kind != "helmet" && kind != "chest" && kind != "pants" && kind != "boots" && kind != "accessory" && kind != "weapon") {
                message.channel.send("Unknown equipment type.")
                return
            }
            if ((parseInt(args[1]) != 0 || parseInt(args[1]) > items[kind].length - 1) && (!parseInt(args[1]) || parseInt(args[1]) > items[kind].length - 1)) {
                message.channel.send("Invalid Item ID.")
                return
            }

            var selItem = user.inventory[kind].indexOf(id)
            if (selItem < 0) {
                message.channel.send("Invalid Item ID.")
                return
            }
            if ((items[kind][id].hp < 0 && (stats.hp + items[kind][id].hp) < 1) || (items[kind][id].atk < 0 && (stats.atk + items[kind][id].atk) < 1) || (items[kind][id].bp < 0 && (stats.bp + items[kind][id].bp) < 1)) {
                message.channel.send("You don't have enough HP/ATK/BP to equip this item.")
                return
            }

            var ei = user.inventory[kind][selItem]
            user.inventory[kind].splice(selItem, 1)
            user.inventory[kind].push(user.equiped[kind])
            user.equiped[kind] = ei
            db.get('users').find({ id: message.author.id }).assign({ equiped: user.equiped }).write()
            db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
            message.channel.send("Equipped " + items[kind][ei].name)
        },

        armory: function (message, command, args) {
            if (!ADB.getBattleSettings().displayArmory) {
                return
            }
            var items = db.get('items').value()
            for (var type in items) {
                if (items.hasOwnProperty(type)) {
                    let embed = new Discord.RichEmbed()
                        .setTitle("- " + cap(type) + " -")
                        .setColor("#dcbc3f")
                        .setThumbnail("https://cdn.discordapp.com/attachments/233701911168155649/488095324527919104/battle-slots.png")
                    for (let i = 0; i < items[type].length; i++) {

                        for (var t in items[type][i]) {
                            var msg = ""
                            var item = items[type][i]
                            if (item.hp) {
                                if (item.hp < 1 && item.hp > 0)
                                    msg += (" :heart: +" + item.hp * 100 + "%")
                                else
                                    msg += (" :heart: " + item.hp)
                            }
                            if (item.atk) {
                                if (item.atk < 1 && item.atk > 0)
                                    msg += ("  :crossed_swords: +" + item.atk * 100 + "%")
                                else
                                    msg += ("  :crossed_swords: " + item.atk)
                            }
                            if (item.bp || item.bp == 0) {
                                if (type == "consumable") {
                                    if (item.bp == 0)
                                        msg += (" :fireworks: MAX")
                                    else
                                        msg += ("  :fireworks: +" + item.bp)
                                }

                                else
                                    msg += ("  :fireworks: " + item.bp)

                            }
                            if (item.luck) {
                                if (type == "consumable")
                                    msg += ("  :game_die: +" + item.luck)
                                else
                                    msg += ("  :game_die: " + item.luck)
                            }
                        }
                        if (type == "consumable")
                            embed.addField(+ i + ". " + items[type][i].name, msg, false)
                        else
                            embed.addField(+ i + ". {lvl." + items[type][i].lvl + "} - " + items[type][i].name, msg, false)
                    }
                    message.channel.send(embed)
                }
            }

        },

        shop: function (message, command, args) {
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
            var auth = client.guilds.get(ADB.getBotData().guild).members.get(message.author.id).displayName
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

                    //INPUT BATTLE CHANNEL HERE
                    if (message.channel.type != "dm") {
                        client.guilds.get(ADB.getBotData().guild).channels.get(ADB.getBattleSettings().textChannel).send("A BP Potion is Available!\nCheck your private messages.")
                    }
                    var con = await message.author.send(timeForReset() + "\n\n > Do you want to use a BP Potion and refill now?")
                    for (let i = 0; i < 3; i++) {
                        if (availPotions[i]) {
                            switch (i) {
                                case 0:
                                    await con.react("🌠")
                                    break;
                                case 1:
                                    await con.react("🎆")
                                    break;
                                case 2:
                                    await con.react("🌌")
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
                            case "🌠":
                                user.inventory.consumable.splice(user.inventory.consumable.indexOf(0), 1)
                                db.get('users').find({ id: message.author.id }).assign({ gamesToday: (user.gamesToday - items.consumable[0].bp) }).write()
                                db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                                message.author.send("You have been granted: BP +" + items.consumable[0].bp)

                                //INPUT BATTLE CHANNEL HERE
                                client.guilds.get(ADB.getBotData().guild).channels.get(ADB.getBattleSettings().textChannel).send("__" + auth + "__ has used a potion and been granted: BP +" + items.consumable[0].bp)


                                break;
                            case "🎆":
                                user.inventory.consumable.splice(user.inventory.consumable.indexOf(1), 1)
                                db.get('users').find({ id: message.author.id }).assign({ gamesToday: (user.gamesToday - items.consumable[1].bp) }).write()
                                db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                                message.author.send("You have been granted: BP +" + items.consumable[1].bp)

                                //INPUT BATTLE CHANNEL HERE
                                client.guilds.get(ADB.getBotData().guild).channels.get(ADB.getBattleSettings().textChannel).send("__" + auth + "__ has used a potion and been granted: BP +" + items.consumable[1].bp)

                                break;
                            case "🌌":
                                user.inventory.consumable.splice(user.inventory.consumable.indexOf(2), 1)
                                db.get('users').find({ id: message.author.id }).assign({ gamesToday: 0 }).write()
                                db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                                message.author.send("Your BP has been MAXED!")

                                //INPUT BATTLE CHANNEL HERE
                                client.guilds.get(ADB.getBotData().guild).channels.get(ADB.getBattleSettings().textChannel).send("__" + auth + "__ has used a potion and been granted: BP +" + items.consumable[2].bp)

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

            if (user.maxDungeon + 1 < lvl + 1) {
                message.channel.send("\nYou need to complete dungeon " + lvl + " to access this one.")
                return
            }

/* old bp +1 code for dungeons (on start)

            db.get('users')
                .find({ "id": message.author.id })
                .assign({ "gamesToday": user.gamesToday + 1 })
                .write()
            console.log(stats)
*/
            var mobs = db.get('mobs').value()
            var mob = mobs[lvl][Math.floor(Math.random() * mobs[lvl].length)];

            var elements = ['💧', '🔥', '🌱']

            var mbSel = ""
            var usrSel = ""

            var mobBio = ""

            // INPUT BATTLE CHANNEL HERE

            client.guilds.get(ADB.getBotData().guild).channels.get(ADB.getBattleSettings().textChannel).send("A wild **" + "Lv." + (lvl + 1) + " - " + mob.name + "** appears. Get ready for battle __" + auth + "__!")
            message.author.send("A wild **" + "Lv." + (lvl + 1) + " - " + mob.name + "** appears. Get ready for battle!")

            var mbio = mob.bio
            if (mbio == "") {
                mbio = "Coming Soon..."
            }
            var micon = mob.icon
            if (micon == "") {
                micon = "https://cdn.discordapp.com/attachments/233701911168155649/490541818090487808/Mob_Icon_Default_NoBg.png"
            }

            let embed = new Discord.RichEmbed()
                .setTitle(mob.name + " Stats")
                .setDescription(":heart: " + mob.hp + " :crossed_swords: " + mob.atk)
                .setColor("#dcbc3f")
                .setThumbnail(micon)
                .addField("Monster Bio:", mbio)

            if (message.channel.type != "dm") {
                await message.channel.send(embed)
                await message.author.send(embed)
            }
            else {
              await client.guilds.get(ADB.getBotData().guild).channels.get(ADB.getBattleSettings().textChannel).send(embed)
              await message.author.send(embed)
            }

            if (availPotions[3] || availPotions[4] || availPotions[5] || availPotions[6] || availPotions[7] || availPotions[8]) {
                var con = await message.author.send("Do you want to use a potion for this fight?")
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
                            message.channel.send("You have been granted: HP +" + Math.ceil(stats.hp * items.consumable[3].hp + "%"))
                            break;
                        case "💛":
                            user.inventory.consumable.splice(user.inventory.consumable.indexOf(4), 1)
                            db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                            stats.hp += Math.ceil(stats.hp * items.consumable[4].hp)
                            message.channel.send("You have been granted: HP +" + Math.ceil(stats.hp * items.consumable[4].hp + "%"))
                            break;
                        case "🗡":
                            user.inventory.consumable.splice(user.inventory.consumable.indexOf(5), 1)
                            db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                            stats.atk += Math.ceil(stats.atk * items.consumable[5].atk)
                            message.channel.send("You have been granted: ATK +" + Math.ceil(stats.atk * items.consumable[5].atk + "%"))
                            break;

                        case "🥊":
                            user.inventory.consumable.splice(user.inventory.consumable.indexOf(6), 1)
                            db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                            stats.atk += Math.ceil(stats.atk * items.consumable[6].atk)
                            message.channel.send("You have been granted: ATK +" + Math.ceil(stats.atk * items.consumable[6].atk + "%"))
                            break;

                        case "🌀":
                            user.inventory.consumable.splice(user.inventory.consumable.indexOf(7), 1)
                            db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                            stats.luck += items.consumable[7].luck
                            message.channel.send("You have been granted: LUCK +" + items.consumable[7].luck + "%")
                            break;

                        case "🔱":
                            user.inventory.consumable.splice(user.inventory.consumable.indexOf(8), 1)
                            db.get('users').find({ id: message.author.id }).assign({ inventory: user.inventory }).write()
                            stats.luck += items.consumable[8].luck
                            message.channel.send("You have been granted: LUCK +" + items.consumable[8].luck + "%")
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
                    var msg = await message.author.send("__Round " + round + "__")
                    await msg.react('💧')
                    await msg.react('🔥')
                    await msg.react('🌱')
                    var filter = (reaction, usr) => {
                        if(usr.id == user.id && (reaction.emoji.name == '💧' || reaction.emoji.name == '🔥' || reaction.emoji.name == '🌱')){
                            return true
                        }
                        else{
                            return false
                        }
                    }
                    var collector = msg.createReactionCollector(filter);
                    collector.on('collect', r => {

  //~~
                    if (round == 1) {
                        db.get('users').find({ id: message.author.id }).assign({ gamesToday: (user.gamesToday + 1) }).write()
                      }

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

                await message.author.send(embed)

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
                    .addField("Winner", message.author.username, true)
                    .addField("Loser", mob.name, true)
                    .addField("Total Damage Dealt", tmbDmg + "\n--------------", true)
                    .addField("Total Damage Dealt", tusrDmg, true)
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
                            if (t == "atk") {
                                if (loot[t] < 1 && loot[t] > 0) {
                                    msg += " :crossed_swords: " + loot[t] * 100 + "%"
                                    }
                                else
                                    msg += " :crossed_swords: " + loot[t]
                            }
                            if (t == "Luck") {
                                if (loot[t] < 1 && loot[t] > 0)
                                    msg += " :game_die: " + loot[t] * 100 + "%"
                                else
                                    msg += " :game_die: " + loot[t]
                            }
                            if (t == "bp")
                                if (loot[t] < 1)
                                    msg += " :fireworks: MAX BP"
                                else
                                    msg += " :fireworks: " + loot[t]
                        }
                    }

                    if (loot[t] < 1 && loot[t] > 0) {
                        embed.addField(loot.name, msg, true)
                    }
                    else {
                        embed.addField("{lvl." + loot.lvl + "} - " + loot.name, msg, true)
                    }

                }
                var lootCoins = ADB.getBattleSettings().dungeonCoins * (lvl + 1)
                var usrCoins = ADB.getCoins(message.author.id)
                if (!usrCoins) {
                    ADB.addCoins(message.author.id)
                    usrCoins = ADB.getCoins(message.author.id)
                }
                ADB.setCoins(message.author.id, usrCoins.amount + lootCoins)
                embed.addField("Arkoins", "+" + lootCoins, true)

                // INPUT BATTLE CHANNEL HERE

                await client.guilds.get(ADB.getBotData().guild).channels.get(ADB.getBattleSettings().textChannel).send(embed)
                await message.author.send(embed)


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
                    .addField("Loser",client.guilds.get(ADB.getBotData().guild).members.get(message.author.id).displayName, true)
                    .addField("Total Damage Dealt", tusrDmg, true)
                    .addField("Total Damage Dealt", tmbDmg, true)
                await client.guilds.get(ADB.getBotData().guild).channels.get(ADB.getBattleSettings().textChannel).send(embed)
                await message.author.send(embed)
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
                await client.guilds.get(ADB.getBotData().guild).channels.get(ADB.getBattleSettings().textChannel).send(embed)
                await message.author.send(embed)
            }

        },

        battle: async function (message, command, args) {
            if (!args[0]) {
                var us = db.get("users").value()
                for (let i = 0; i < us.length; i++) {
                    if(!client.guilds.get(ADB.getBotData().guild).members.get(us[i].id)){
                        us.splice(i, 1)
                    }
                }
                var user = getUser(message.author.id)

                if (!user) {
                    message.channel.send("You are not registered. Please do !profile to register")
                    return
                }

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


                        if ((user.maxDungeon - us[i].maxDungeon) > ADB.getBattleSettings().maxLvlDif) {
                            continue
                        }

                        var ch = ""
                        var st = ""
                        if (us[i].id == message.author.id) {
                            continue
                        }

                        ch += i + ". " + client.guilds.get(ADB.getBotData().guild).members.get(us[i].id).displayName + "\n"
                        var usrStat = getUserStats(us[i])
                        st += "HP: " + usrStat.hp + " ATK: " + usrStat.atk + " BP: " + usrStat.bp + "\n"
                        embed.addField(ch, st, true)

                    }
                    message.channel.send(embed)
                }

                return
            }

            if ((parseInt(args[0]) != 0 && !parseInt(args[0])) || parseInt(args[0]) >= db.get("users").value().length) {
                message.channel.send("Adversary does not exist")
                return
            }

            var userid2 = db.get("users").value()[parseInt(args[0])].id
            if (userid2 == message.author.id) {
                message.channel.send("You can't battle yourself!")
                return
            }
            var user2 = getUser(userid2)
            if (!user2) {
                message.channel.send("Adversary is not registered.")
                return
            }
            var user1 = getUser(message.author.id)
            if (!user1) {
                message.channel.send("You are not registered. Please do !profile to register")
                return
            }
            if(!getAvailableChampions(user1.maxDungeon).includes(parseInt(args[0]))){
                message.channel.send("You cannot battle this person")
                return
            }

            var auth = getUserStats(user1)
            var opp = getUserStats(user2)
            if (user1.gamesToday >= auth.bp) {
                message.channel.send("You don't have any BP to battle!")
                return
            }

            if (user2.gamesToday >= opp.bp) {
                message.channel.send("Your opponent doesn't have any BP to battle!")
                return
            }

            var battleID = db.get('battles').value().length

            var dmg1 = 0
            var dmg2 = 0

            var st1 = getUserStats(user1)
            var st2 = getUserStats(user2)

            var round = 1
            var mn1, mn2
            await message.guild.members.get(user2.id).user.send("You have been challenged by: " + client.guilds.get(ADB.getBotData().guild).members.get(message.author.id).displayName)
            await client.guilds.get(ADB.getBotData().guild).members.get(message.author.id).send("You have challenged: " + message.guild.members.get(user2.id).displayName)

            //INPUT BATTLE CHANNEL HERE
            await client.guilds.get(ADB.getBotData().guild).channels.get(ADB.getBattleSettings().textChannel).send("__" + client.guilds.get(ADB.getBotData().guild).members.get(message.author.id).displayName + "__ has challenged __" + client.guilds.get(ADB.getBotData().guild).members.get(user2.id).displayName + "__ to battle!")

            var res1 = ""
            var res2 = ""
            var battler = async function () {
                return new Promise(async function (resolve, reject) {
                    var msg1 = await message.author.send("__Round " + round + "__")
                    await msg1.react('💧')
                    await msg1.react('🔥')
                    await msg1.react('🌱')
                    var filter1 = (reaction, usr) => {
                        if(usr.id == user1.id && (reaction.emoji.name == '💧' || reaction.emoji.name == '🔥' || reaction.emoji.name == '🌱')){
                            return true
                        }
                        else{
                            return false
                        }
                    }
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
                    var filter2 = (reaction, usr) => {
                        if(usr.id == user2.id && (reaction.emoji.name == '💧' || reaction.emoji.name == '🔥' || reaction.emoji.name == '🌱')){
                            return true
                        }
                        else{
                            return false
                        }
                    }
                    var collector2 = msg2.createReactionCollector(filter2);
                    collector2.on('collect', r => {
                        res2 = r.emoji.name
                        msg2.delete()

                        if (round == 1 && message.author.id) {
                            db.get('users').find({ id: message.author.id }).assign({ gamesToday: (user1.gamesToday + 1) }).write()
                        }
                        if (round == 1 && userid2) {
                            db.get('users').find({ id: userid2 }).assign({ gamesToday: (user2.gamesToday + 1) }).write()
                        }

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
                    .addField("Choices", "You: " + res2 + "\n" + client.guilds.get(ADB.getBotData().guild).members.get(message.author.id).displayName + ": " + res1 + "\n----------------------------------------------------")

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
                else if ((res2 == '💧' && res1 == '🔥') || (res2 == '🔥' && res1 == '🌱') || (res2 == '🌱' && res1 == '💧')) {
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
                    .addField(client.guilds.get(ADB.getBotData().guild).members.get(message.author.id).displayName + "'s Health", (st1.hp - tdm1) + " / " + st1.hp, true)

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
                    .addField("Winner", "You"+ "\n- - - - - - - - - - - - - -", true)
                    .addField("Loser", message.guild.members.get(user2.id).displayName, true)
                    .addField("Total Damage Dealt", tdm2 + "\n- - - - - - - - - - - - - -", true)
                    .addField("Total Damage Received", tdm1, true)
                    .addField("Loot", "\n- - - - - - - - - - - - - -", false)

                var lootBattleCoins = 100 * (user2.maxDungeon)
                var usrBattleCoins = ADB.getCoins(user1.id)
                if (!usrBattleCoins) {
                    ADB.addCoins(user1.id)
                    usrBattleCoins = ADB.getCoins(user1.id)
                }

                ADB.setCoins(user1.id, usrBattleCoins.amount + lootBattleCoins)
                embed1.addField("Arkoins", "+" + lootBattleCoins, true)


                let embed2 = new Discord.RichEmbed()
                    .setTitle("- Battle Summary -")
                    .setColor("#dcbc3f")
                    .setThumbnail("https://cdn1.iconfinder.com/data/icons/school-icons-2/512/trophy_award_ribon-512.png")
                    .addField("Winner", client.guilds.get(ADB.getBotData().guild).members.get(message.author.id).displayName+ "\n- - - - - - - - - - - - - -", true)
                    .addField("Loser", "You", true)
                    .addField("Total Damage Dealt", tdm1+ "\n- - - - - - - - - - - - - -", true)
                    .addField("Total Damage Received", tdm2, true)


                let embed3 = new Discord.RichEmbed()
                    .setTitle("- Battle Summary -")
                    .setColor("#dcbc3f")
                    .setThumbnail("https://cdn1.iconfinder.com/data/icons/school-icons-2/512/trophy_award_ribon-512.png")
                    .addField("Winner", message.guild.members.get(user1.id).displayName + "\n- - - - - - - - - - - - - -", true)
                    .addField("Loser", message.guild.members.get(user2.id).displayName, true)
                    .addField("Total Damage Dealt", tdm2 + "\n- - - - - - - - - - - - - -", true)
                    .addField("Total Damage Dealt", tdm1, true)
                    .addField("Health Remaining", (st1.hp - tdm1) + " / " + st1.hp + "\n- - - - - - - - - - - - - -", true)
                    .addField("Health Remaining", (st2.hp - tdm2) + " / " + st2.hp, true)
                    .addField("Loot", "\n- - - - - - - - - - - - - -", false)

                var lootBattleCoins = ADB.getBattleSettings().battleCoins * (user2.maxDungeon)
                var usrBattleCoins = ADB.getCoins(user1.id)
                if (!usrBattleCoins) {
                    ADB.addCoins(user1.id)
                    usrBattleCoins = ADB.getCoins(user1.id)
                }

                ADB.setCoins(user1.id, usrBattleCoins.amount + lootBattleCoins)
                embed3.addField("Arkoins", "+" + lootBattleCoins, true)

                //INPUT BATTLE CHANNEL HERE
                await client.guilds.get(ADB.getBotData().guild).channels.get(ADB.getBattleSettings().textChannel).send(embed3)

                await message.guild.members.get(user2.id).user.send(embed2)
                await client.guilds.get(ADB.getBotData().guild).members.get(message.author.id).send(embed1)


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
                    .addField("Total Damage Dealt", tdm1 + "\n- - - - - - - - - - - - - -", true)
                    .addField("Total Damage Received", tdm2, true)
                    .addField("Loot", "\n- - - - - - - - - - - - - -", false)

                var lootBattleCoins2 = ADB.getBattleSettings().battleCoins * (user1.maxDungeon)
                var usrBattleCoins = ADB.getCoins(user2.id)
                if (!usrBattleCoins) {
                    ADB.addCoins(user2.id)
                    usrBattleCoins = ADB.getCoins(user2.id)
                }

                ADB.setCoins(user2.id, usrBattleCoins.amount + lootBattleCoins2)


                let embed2 = new Discord.RichEmbed()
                    .setTitle("- Battle Summary -")
                    .setColor("#dcbc3f")
                    .setThumbnail("https://cdn1.iconfinder.com/data/icons/school-icons-2/512/trophy_award_ribon-512.png")
                    .addField("Winner", "You"+ "\n- - - - - - - - - - - - - -", true)
                    .addField("Loser", client.guilds.get(ADB.getBotData().guild).members.get(message.author.id).displayName, true)
                    .addField("Total Damage Dealt", tdm1+ "\n- - - - - - - - - - - - - -", true)
                    .addField("Total Damage Received", tdm2, true)
                    .addField("Loot", "\n- - - - - - - - - - - - - -", false)
                    .addField("Arkoins", "+" + lootBattleCoins2, true)

                let embed3 = new Discord.RichEmbed()
                    .setTitle("- Battle Summary -")
                    .setColor("#dcbc3f")
                    .setThumbnail("https://cdn1.iconfinder.com/data/icons/school-icons-2/512/trophy_award_ribon-512.png")
                    .addField("Winner", message.guild.members.get(user2.id).displayName + "\n- - - - - - - - - - - - - -", true)
                    .addField("Loser", message.guild.members.get(user1.id).displayName, true)
                    .addField("Total Damage Dealt", tdm1 + "\n- - - - - - - - - - - - - -", true)
                    .addField("Total Damage Dealt", tdm2, true)
                    .addField("Health Remaining", (st2.hp - tdm2) + " / " + st2.hp + "\n- - - - - - - - - - - - - -", true)
                    .addField("Health Remaining", (st1.hp - tdm1) + " / " + st1.hp, true)
                    .addField("Loot", "\n- - - - - - - - - - - - - -", false)
                    .addField("Arkoins", "+" + lootBattleCoins2, true)

                //INPUT BATTLE CHANNEL HERE
                await client.guilds.get(ADB.getBotData().guild).channels.get(ADB.getBattleSettings().textChannel).send(embed3)

                await message.guild.members.get(user2.id).user.send(embed2)
                await client.guilds.get(ADB.getBotData().guild).members.get(message.author.id).send(embed1)


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

                let embed3 = new Discord.RichEmbed()
                    .setTitle("- Battle Summary -")
                    .setColor("#dcbc3f")
                    .setThumbnail("https://cdn1.iconfinder.com/data/icons/school-icons-2/512/trophy_award_ribon-512.png")
                    .addField("It's a Draw!", message.guild.members.get(user1.id).displayName + "\n- - - - - - - - - - - - - -", true)
                    .addField("It's a Draw!", message.guild.members.get(user2.id).displayName, true)
                    .addField("Total Damage Dealt", tdm1 + "\n- - - - - - - - - - - - - -", true)
                    .addField("Total Damage Dealt", tdm2, true)
                    .addField("Health Remaining", (st1.hp - tdm1) + " / " + st1.hp + "\n- - - - - - - - - - - - - -", true)
                    .addField("Health Remaining", (st2.hp - tdm2) + " / " + st2.hp, true)
                    .addField("Loot", "\n- - - - - - - - - - - - - -", false)
                    .addField("No Rewards", true)

                //INPUT BATTLE CHANNEL HERE
                await client.guilds.get(ADB.getBotData().guild).channels.get(ADB.getBattleSettings().textChannel).send(embed3)

                await message.guild.members.get(user2.id).user.send(embed2)
                await client.guilds.get(ADB.getBotData().guild).members.get(message.author.id).send(embed1)
            }
        },
    }
}
