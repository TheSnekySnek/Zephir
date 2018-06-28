const request = require('request')
var path = require('path')
var fs = require('fs')
const DB = require('../../modules/db')

module.exports = {
    //Need to add pemissions
    sound: async function(message, command, args) {
        try{
            let hasPermission = message.member.permissions.has("MANAGE_GUILD")
            let sound = args[0]
            let volume = args[1] || 0.3
            let channel = message.member.voiceChannel
            if(sound.indexOf('http') > -1){
                if(!hasPermission){
                    message.reply("You can't use that command")
                    return
                }
                try{
                    let vc = await channel.join()
                    let stream = request(sound)
                    let dispatcher = vc.playStream(stream, {seek:0, volume: volume})
                    dispatcher.once('end', reason => {
                        if(!reason){
                            message.reply("Unsupported format")
                        }
                        vc.disconnect()
                    })
                }
                catch(e){
                    console.log(e)
                    message.reply("Error. Snek fucked up")
                }
            }
            else{
                if(DB.getSound(sound)){
                    console.log(DB.getSound(sound).url)
                    let vc = await channel.join()
                    let dispatcher = vc.playFile(DB.getSound(sound).url, {seek:0, volume: volume})
                    dispatcher.once('end', reason => {
                        if(!reason){
                            message.reply("Unsupported format")
                        }
                        vc.disconnect()
                    })
                }
                else{
                    if(!hasPermission){
                        message.reply("You can't use that command")
                        return
                    }
                    let vc = await channel.join()
                    try{
                        let fpath = global.appRoot + "/assets/sounds/" + sound + ".mp3"
                        console.log(fpath)
                        let fexists = fs.existsSync(fpath)
                        if(!fexists){
                            message.reply("Inavlid sound")
                            vc.disconnect()
                            return
                        }
                        let dispatcher = vc.playFile(fpath, {seek:0, volume: volume})
                        dispatcher.once('end', reason => {
                            if(!reason){
                                message.reply("Unsupported format")
                            }
                            vc.disconnect()
                        })
                    }
                    catch(e){
                        console.log(e)
                        message.reply("Error. Snek fucked up")
                        vc.disconnect()
                    }
                }
            }
        }
        catch(e){
            console.log(e)
        }    
    }
}