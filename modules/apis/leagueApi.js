var Horseman = require('node-horseman');
var request = require('request')
var cheerio = require('cheerio')

module.exports = {
  getRankByName: function(region, name) {
    return new Promise(function(resolve, reject){
      request("http://" + region + ".op.gg/summoner/userName=" + name, function(error, response, body) {
        const $ = cheerio.load(body)
        let rank = $('.SummonerRatingMedium > .TierRankInfo > .TierRank > .tierRank').text()
        resolve(rank)
      })
    })
  },
  getDataByName: function(region, name) {
    return new Promise(function(resolve, reject){
      let summoner = {}
      summoner.mpc = []
      summoner.rpc = []
      var horseman = new Horseman({timeout: 15000});
      console.log("http://" + region + ".op.gg/summoner/userName=" + name)
      try{
        horseman
        .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
        .open("http://" + region + ".op.gg/summoner/userName=" + name)
        .catch(e => {
          reject(e)
        })
        .waitForSelector('li[data-type="soloranked"] > a')
        .catch(e => {
          reject(e)
        })
        .click('li[data-type="soloranked"] > a')
        .catch(e => {
          reject(e)
        })
        .waitForSelector('.MostChampion > ul > li:nth-of-type(1) > .Content > .WonLose > .tip')
        .attribute('.ProfileIcon > img', 'src')
        .then(pic =>{
          summoner.pic = pic
        })
        .text('.SummonerRatingMedium > .TierRankInfo > .TierRank > .tierRank')
        .then(rank =>{
          summoner.rank = rank
        })
        .text('.SummonerRatingMedium > .TierRankInfo > .TierInfo > .LeaguePoints')
        .then(lp => {
          console.log(parseInt(lp))
          summoner.lp = parseInt(lp)
        })
        .text('.SummonerRatingMedium > .TierRankInfo > .TierInfo > .WinLose > .winratio')
        .then(gwr => {
          summoner.gwr = gwr.replace(/\\n|\\t/g,'')
        })
        .text('.SummonerRatingMedium > .TierRankInfo > .TierInfo > .WinLose > .wins')
        .then(gw => {
          summoner.gw = gw.replace(/\\n|\\t/g,'')
        })
        .text('.SummonerRatingMedium > .TierRankInfo > .TierInfo > .WinLose > .losses')
        .then(gl => {
          summoner.gl = gl.replace(/\\n|\\t/g,'')
        })
        .text('.MostChampion > ul > li:nth-of-type(1) > .Content > .Name')
        .then(smf => {
          summoner.mpc[0] = {name: smf.replace(/\\n|\\t/g,'')}
        })
        .text('.MostChampion > ul > li:nth-of-type(1) > .Content > .WonLose > .tip')
        .then(smf => {
          summoner.mpc[0].perc = smf
        })

        .text('.MostChampion > ul > li:nth-of-type(2) > .Content > .Name')
        .then(smf => {
          summoner.mpc[1] = {name: smf.replace(/\\n|\\t/g,'')}
        })
        .text('.MostChampion > ul > li:nth-of-type(2) > .Content > .WonLose > .tip')
        .then(smf => {
          summoner.mpc[1].perc = smf
        })

        .text('.MostChampion > ul > li:nth-of-type(3) > .Content > .Name')
        .then(smf => {
          summoner.mpc[2] = {name: smf.replace(/\\n|\\t/g,'')}
        })
        .text('.MostChampion > ul > li:nth-of-type(3) > .Content > .WonLose > .tip')
        .then(smf => {
          summoner.mpc[2].perc = smf
        })

        .text('.PositionStats > ul > li:nth-of-type(1) > .PositionStatContent > .RoleRate > b')
        .then(jgl => {
          summoner.jun = {rate: jgl}
        })
        .text('.PositionStats > ul > li:nth-of-type(1) > .PositionStatContent > .Name')
        .then(jgl => {
          summoner.jun.name = jgl
        })
        .text('.PositionStats > ul > li:nth-of-type(1) > .PositionStatContent > .WinRatio > span > b')
        .then(jgl => {
          summoner.jun.ratio = jgl
        })
        .text('.PositionStats > ul > li:nth-of-type(2) > .PositionStatContent > .RoleRate > b')
        .then(adc => {
          summoner.adc = {rate: adc}
        })
        .text('.PositionStats > ul > li:nth-of-type(2) > .PositionStatContent > .Name')
        .then(adc => {
          summoner.adc.name = adc
        })
        .text('.PositionStats > ul > li:nth-of-type(2) > .PositionStatContent > .WinRatio > span > b')
        .then(jgl => {
          summoner.adc.ratio = jgl
        })

        .text('.MostChampionContent > .ChampionBox.Ranked:nth-of-type(2) > .ChampionInfo > .ChampionName > a')
        .then(jgl => {
          summoner.rpc[0] = {name: jgl.replace('\n\t\t\t\t\t\t','').replace('\n\t\t\t\t\t','')}
        })
        .text('.MostChampionContent > .ChampionBox.Ranked:nth-of-type(2) > .Played > .Title')
        .then(jgl => {
          summoner.rpc[0].played = jgl
        })

        .text('.MostChampionContent > .ChampionBox.Ranked:nth-of-type(3) > .ChampionInfo > .ChampionName > a')
        .then(jgl => {
          summoner.rpc[1] = {name: jgl.replace('\n\t\t\t\t\t\t','').replace('\n\t\t\t\t\t','')}
        })
        .text('.MostChampionContent > .ChampionBox.Ranked:nth-of-type(3) > .Played > .Title')
        .then(jgl => {
          summoner.rpc[1].played = jgl
        })

        .text('.MostChampionContent > .ChampionBox.Ranked:nth-of-type(4) > .ChampionInfo > .ChampionName > a')
        .then(jgl => {
          summoner.rpc[2] = {name: jgl.replace('\n\t\t\t\t\t\t','').replace('\n\t\t\t\t\t','')}
        })
        .text('.MostChampionContent > .ChampionBox.Ranked:nth-of-type(5) > .Played > .Title')
        .then(jgl => {
          summoner.rpc[2].played = jgl
        })
        .then(() => {
          console.log(summoner)
          resolve(summoner)
        })
        .catch(e => {
          reject(e)
        })
        .close();     
      }
      catch(e){
        console.error(e)
        reject(e)
      }
    })
  }
}
