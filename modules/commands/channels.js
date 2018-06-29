const DB = require('../../modules/db')
module.exports = {

  show: async function(message, command, args) {
    for (var i = 0; i < args.length; i++) {
      if(!DB.getChannel(args[i]))
      {
        message.reply("You can not hide **#" + args[i] + "**")
        return false;
      }
      let permission = message.guild.channels.find("name", DB.getChannel(args[i]).alias).permissionOverwrites.get(message.author.id);
      if(permission){
        await permission.delete()
        message.reply("The channel **#" + args[i] + "** is now **visible** for **" + message.author.username + "**")
      }
      else {
          message.reply("The channel **#" + args[i] + "** is already visible");
      }
    }
  },

  hide: async function(message, command, args) {
    for (var i = 0; i < args.length; i++) {
      console.log(DB.getChannel(args[i]))
      if(!DB.getChannel(args[i]))
      {
        message.reply("You can not hide **#" + args[i] + "**")
        return false;
      }
      let selChannel = message.guild.channels.find('name', args[i]);
      if(selChannel){
        await message.guild.channels.find("name", DB.getChannel(args[i]).alias).overwritePermissions(message.author, {
         'READ_MESSAGES': false,
         'READ_MESSAGE_HISTORY': false
        })
        message.reply("The channel **#" + args[i] + "** is now **hidden** for **" + message.author.username + "**")
      }
      else{
        message.reply("There is no **#" + args[i] + "** channel");
      }
    }
  },

  hideall: function(message, command, args) {
    let guildchannels = message.guild.channels.array()
    for (var i = 0; i < guildchannels.length; i++) {
      if(guildchannels[i].type == "text" && DB.getChannel(guildchannels[i].name)){
        message.guild.channels.find('name', guildchannels[i].name).overwritePermissions(message.author, {
         'READ_MESSAGES': false,
         'READ_MESSAGE_HISTORY': false
        })
        .catch(err => {
          console.error(err)
          ArkhosAPI.sendError("Failed to hide channels", "bot", err.message)
        })
      }
    }
    message.reply("All channels are now hidden")
  },

  showall: function(message, command, args) {
    let guildchannels = message.guild.channels.array()
    for (var i = 0; i < guildchannels.length; i++) {
      if(guildchannels[i].type == "text" && DB.getChannel(guildchannels[i].name)){
        message.guild.channels.find('name', guildchannels[i].name).overwritePermissions(message.author, {
         'READ_MESSAGES': true,
         'READ_MESSAGE_HISTORY': true
        })
        .catch(err => {
          console.error(err)
          ArkhosAPI.sendError("Failed to show channels", "bot", err.message)
        })
      }
    }
    message.reply("All channels are now displayed")
  }
}
