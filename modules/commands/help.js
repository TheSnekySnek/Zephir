const schedule = require('node-schedule')
const request = require('request')
const DB = require('../../modules/db')
const wd = require("word-definition");
const COLORS = 
  {
    black: "Black",
    blue: "Blue",
    cyan: "Cyan",
    darkblue: "Dark Blue",
    darkred: "Dark Red",
    electricblue: "Electric Blue",
    green: "Green",
    gray: "Gray",
    indigo: "Indigo",
    lime: "Lime",
    orange: "Orange",
    pink: "Pink",
    purple: "Purple",
    red: "Red",
    yellow: "Yellow"
  }

module.exports = {

  wiki: function(message, command, args) {
    try {
      if(args[0]){
        var lang = "en"
        if(args[1]){
          switch (args[1]) {
            case "en":
              lang = "en"
              break;
            case "fr":
              lang = "fr"
              break
            case "de":
              lang = "de"
              break
            default:
              message.channel.send("Unsupported language (en, fr, de)")
              break;
          }
        }
        wd.getDef(args[0], lang, null, (def) => {
          console.log(def)
          if(def.err){
            message.channel.send("Could not get a definition for the word **" + def.word + "**. Try using a diferent language (**!wiki "+ def.word + " [en / fr / de]**)")
            return
          }
          message.channel.send(`:book:**Word:** ${def.word}
:clipboard:**Category:** ${def.category}

:loudspeaker:**Definition:**
${def.definition}`)
        });
      }
      else{
        message.channel.send("Please provide a word")
      }
    } catch (e) {
      console.error(e);
    }
  },
  weather: function(message, command, args) {
    try {
      console.log(message.content)
      console.log(command);
      
      var city = message.content.replace("!" + command + " ", "")
      console.log(city);
      
      request(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=073c07e8a5dbe9fca2524f508a9c41c8&units=metric`, function (error, response, body) {
        var wData = JSON.parse(body)
        var icn = wData.weather[0].main
        switch (wData.weather[0].main) {
          case "Clouds":
            icn = ":cloud:"
            break;
        
          default:
          icn = ":sunny:"
            break;
        }
        console.log(wData)
        var mes = `:flag_${wData.sys.country.toLowerCase()}: | **Weather for ${wData.name}, ${wData.sys.country}**
${icn} **Weather:** ${wData.weather[0].main} (${wData.weather[0].description})
:thermometer: **Temp:** ${wData.main.temp} °C
:cloud_tornado: **Wind**: ${wData.wind.speed} m/s
:droplet: **Humidity:** ${wData.main.humidity}%
:white_sun_cloud: **Cloud Cover:** ${wData.clouds.all}%`
        message.channel.send(mes)
      })
    }
    catch (e) {
      console.error(e);
    }
  },
  colors: function(message, command, args) {
    try {
      let response = "\n\n";
      for (var key in COLORS) {
        if (!COLORS.hasOwnProperty(key)) continue;
        
        var obj = COLORS[key];
        response += key +": " + obj + "\n"
      }
        message.reply(response);
    } catch (e) {
      console.error(e);
    }
  },
  color: async function(message, command, args) {
    try {
      if(!DB.getUnlock(message.author.id, "color")){
        message.reply("You need to claim the 'color' reward by doing !claim 1")
        return
      }
      if(COLORS[args[0]]){
        let colorRole = message.guild.roles.find("name", COLORS[args[0]])
        if(colorRole)
        {
          for (var key in COLORS) {
            if(message.member.colorRole.name == COLORS[key]){
              message.member.removeRole(message.member.colorRole)
            }
          }
          message.member.addRole(colorRole)
          .then(()=> {
            if(message.member.colorRole.name != COLORS[args[0]]){
              message.reply("It seems like you have an admin role.\nYou will not be able to set a color");
              message.member.removeRole(colorRole);
            }
            else{
              message.reply("You are now " + COLORS[args[0]]);
            }
          })
        }
        else {
          message.reply("Color not available")
        }
      }
      else{
        message.reply("Color not available")
      }
    } catch (e) {
      console.error(e);
    }
  },
  rewards: async function(message, command, args) {
    try{
      //Addcoins
      message.channel.send({embed:{
          title: "Arkhos Server Rewards",
          description: "Total Arkoins: ",
          url: "https://beta.arkhos.net/",
          color: 0x33FFBB,
          fields:[
            {
                name: "Tier 1 | Color - 5,000 Arkoins",
                value: "Gain permanent access to the !color command and change your color at will! \nHow progressive of us...",
                inline: false
            },
            {
                name: "Tier 2 | Roles - 25,000 Arkoins",
                value: "Create your own custom Role, you can make it Private/Public, you chose! \nPersonally, i'd keep it private... You worked hard for those coins!",
                inline: false
            },
            {
                name: "Tier 3 | GIFs - 50,000 Arkoins",
                value: "No longer will your memes be dreams with this amazing GIF command! \nFind a pic and let it rip :smiling_imp:",
                inline: false
            },
            {
                name: "Tier 4 | Sound - 100,000 Arkoins",
                value: "Create a custom sound command to use in Voice Channels, Arkhos will personally come in and play a sound (.mp3) of your choosing! (PS: Batteries not included)",
                inline: false
            },
            {
              name: "Tier 5 | Music - 500,000 Arkoins",
              value: "A Private Music Bot you say?! Deal. \nHere's your very own Music Bot to use and abuse as you please! \n#EnslaveTheBots",
              inline: false
            },
            {
              name: "Patreon Rewards",
              value: "Tired of farming Arkoins? Not getting anything done hoe-ing like that? \nWorry not, much like EA we have our very own pay to win loot boxes!\nClick the link, give us all your credit card info and TADA, you just became the coolest monkey in the jungle! GG\n\nhttps://www.patreon.com/Arkhos\n\nPS: In all seriousness though, thank you! We really appreciate the support < 3",
              inline: false
            }
            ],
          timestamp: new Date(),
          footer: {
              text: "This is a footer. No feet were harmed in the making of this description",
              icon_url: "https://cdn.discordapp.com/attachments/233701911168155649/419476816244375563/Arkhos_Black3.png"
          }
      }})
    
    }
    catch(e){
      console.log(e)
    }
  },
  daily: async function(message, command, args) {
    try{
      if(!DB.getDailyUser(message.author.id)){
        DB.addDailyUser(message.author.id)
        if(!DB.getCoins(message.author.id))
          DB.addCoins(message.author.id)
        var coins = DB.getCoins(message.author.id).amount
        message.reply("+200 Arkoins have been added to your stash, spend them wisely!")
        DB.setCoins(message.author.id, coins+200)
        
      }
      else{
        var now = new Date().getTime();
        var countDownDate = new Date();
        countDownDate.setDate(countDownDate.getDate()+1)
        countDownDate.setHours(0,0,0,0);
        var distance = countDownDate - now;
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        message.reply("You've already requested your daily ration... Come back in **" + hours + "h:" + minutes+"m:"+seconds+ "s**")
      }
      
    }
    catch(e){
      console.log(e)
    }
  }
}

schedule.scheduleJob('0 6 * * *', () => {
  DB.emptyDailyUser()
}) 


var dailyUsers = []