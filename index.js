var path = require('path');

const readline = require('readline');
const fs = require('fs')
global.appRoot = path.resolve(__dirname);
global.setupUser = ""
global.setupPassword = ""


if (!fs.existsSync('data/db.json')) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Please type a username: ', (answer) => {
        global.setupUser = answer
        rl.question('Please type a password: ', (answer) => {
            global.setupPassword = answer
            rl.close();
            fs.closeSync(fs.openSync('data/db.json', 'w'));
            const Backend = require('./modules/backend')
            Backend.startServer()
            global.bot = require('./modules/bot');
            console.log("\nPlease go to http://localhost:1337 and login using the credentials provided")
            console.log("\nMake sure to provide a Token and the Guild ID of your bot")
        })
    })
}
else{
    global.bot = require('./modules/bot');
    const DB = require('./modules/db')
    var botToken = DB.getBotData().token
    if(botToken){
        bot.login(botToken)
    }
    
    const Backend = require('./modules/backend')
    Backend.startServer()
}




