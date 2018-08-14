/**
 * This is the list of commands
 * @type {Object}
 */
let commandList = Object.assign(
    require("./commands/roles"),
    require("./commands/channels"),
    require("./commands/users"),
    require("./commands/help"),
    require("./commands/voice"),
    require("./commands/league")
  )
  /**
   * Executes a command from a message
   * @param  {Discord.Message} message [description]
   * @return {[type]}         [description]
   */
  module.exports.handle = function (message) {
    if(message.content[0] == '!'){
      var command = message.content.split(' ')[0].substring(1).toLowerCase();
      var args = message.content.split(' ')
      args.splice(0,1)
      if (command in commandList) {
        commandList[command](message, command, args);
      }
    }
  }