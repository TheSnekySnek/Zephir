const fs = require('fs')
var schedule = require('node-schedule');

function backupDB() {
   const stats = fs.statSync("data/db.json");
   console.log(stats.size)
   if(stats.size > 0){
      var iso = new Date().toISOString()
      fs.createReadStream('data/db.json').pipe(fs.createWriteStream('backups/db-' + iso + ".json"));
   }
}
schedule.scheduleJob('0 2 * * *', backupDB)
//backupDB()
