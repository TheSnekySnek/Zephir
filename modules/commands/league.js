const request = require('request');
const lolapi = require('../apis/leagueApi');
module.exports = {

  lolrank: async function(message, command, args){
    try{
      let region = args[0];
      args.splice(0,1)
      var summoner = args.join('+')

      if(true){
        let msg = await message.channel.send('Gathering data...')
        lolapi.getRankByName(region, summoner)
        .then((rank) => {
          msg.delete()
          message.channel.send(summoner.charAt(0).toUpperCase() + summoner.slice(1).replace('+', ' ') + " is " + rank)
        })
        .catch(err => {
          console.error(err)
        })
      }
      else {
        message.reply("Invalid summoner name")
      }
    }
    catch(e){
      console.error(e)
    }
  },
  lolstats: async function(message, command, args){
    try{
      var region = args[0];
      args.splice(0,1)
      var summoner = args.join('+')
      console.log(summoner)


      if(true){
        let msg = await message.channel.send('Gathering data... This will take some time...')
        lolapi.getDataByName(region, summoner)
        .catch(e => {
          message.channel.send("API did not respond...")
        })
        .then((rank) => {
          msg.delete()
          let embed = new Discord.RichEmbed()
          .setTitle(region.toUpperCase() + " | " + summoner.charAt(0).toUpperCase() + summoner.slice(1).replace('+', ' ') + " - " + rank.rank)
          .setAuthor(message.author.username + " has requested " + summoner.replace('+',' ') + "'s profile ", message.author.avatarURL)
          .setColor("#2eaae5")
          .setFooter("Zephir by TheSnekySnek", client.user.avatarURL)
          .setThumbnail("http:" + rank.pic)
          .setURL("http://" + region + ".op.gg/summoner/userName=" + summoner)
          .addField("Summary",
            "LP - " + rank.lp + "\n" + rank.gwr + "\n(" + rank.gw + " : " + rank.gl + ")"
          )
          .addField("Preferred Roles",
            rank.jun.name + ": " + rank.jun.rate + "% | Win Ratio: " + rank.jun.ratio + "%\n" +
            rank.adc.name + ": " + rank.adc.rate + "% | Win Ratio: " + rank.adc.ratio + "%"
          )
          .addField("Highest Winrate Champions",
            rank.mpc[0].name + " - " + rank.mpc[0].perc + "\n" +
            rank.mpc[1].name + " - " + rank.mpc[1].perc + "\n" +
            rank.mpc[2].name + " - " + rank.mpc[2].perc
          )
          .addField("Most Played Champions",
          rank.rpc[0].name + " - " + rank.rpc[0].played + "\n" +
          rank.rpc[1].name + " - " + rank.rpc[1].played + "\n" +
          rank.rpc[2].name + " - " + rank.rpc[2].played
        )
          message.channel.send({embed})
        })
        .catch(e => {
          message.channel.send("API did not respond... Please try again later")
          console.error(e)
        })
      }
      else {
        message.reply("Invalid summoner name")
      }
    }
    catch(e){
      console.error(e)
    }
  }

}
