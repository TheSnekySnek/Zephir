var exec = require('child_process').exec;


/**
 * This is the list of commands
 * @type {Object}
 */
var commandList = Object.assign(
  require("./commands/roles"),
  require("./commands/channels"),
  require("./commands/users"),
  require("./commands/help"),
  require("./commands/voice"),
  require("./commands/league"),
  require("./commands/battles")
)
/**
 * Executes a command from a message
 * @param  {Discord.Message} message [description]
 * @return {[type]}         [description]
 */
module.exports.handle = function (message) {
  if (message.content[0] == '!') {
    var command = message.content.split(' ')[0].substring(1).toLowerCase();
    var args = message.content.split(' ')
    args.splice(0, 1)
    if (command == "rlm" && (message.author.id == "83519111514034176" || message.author.id == "141117321396748288")) {
      module.exports.reloadModules()
      message.channel.send("Modules have been reloaded")
    }
    else if (command == "update" && (message.author.id == "83519111514034176" || message.author.id == "141117321396748288")) {
      exec("cd " + appRoot + " & git pull")
      message.channel.send("Update completed")
    }
    else if (command in commandList) {
      commandList[command](message, command, args);
    }
  }
}
module.exports.reloadModules = function () {
  delete require.cache[require.resolve('./commands/roles')];
  delete require.cache[require.resolve('./commands/channels')];
  delete require.cache[require.resolve('./commands/users')];
  delete require.cache[require.resolve('./commands/help')];
  delete require.cache[require.resolve('./commands/voice')];
  delete require.cache[require.resolve('./commands/league')];
  delete require.cache[require.resolve('./commands/battles')];
  commandList = Object.assign(
    require("./commands/roles"),
    require("./commands/channels"),
    require("./commands/users"),
    require("./commands/help"),
    require("./commands/voice"),
    require("./commands/league"),
    require("./commands/battles")
  )
}