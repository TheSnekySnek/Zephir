const DB = require('../../modules/db')
module.exports = {

  // This lets a user add a new public role
  join: function(message, command, args) {
    for (var i = 0; i < args.length; i++) {
      var roles = DB.getRoles()
      roles.forEach(role => {
      if(role.alias == args[i]){
        var groles = message.guild.roles.array()
        for (let index = 0; index < groles.length; index++) {
          if(groles[index].name.toLowerCase() == role.name.toLowerCase()){
            message.reply(" joined " + args[i])
            message.member.addRole(groles[index])
          }
        }
      }
    });
    }
  },

  // This lets a user remove a public role
  leave: function(message, command, args) {
    for (var i = 0; i < args.length; i++) {
      var roles = DB.getRoles()
      roles.forEach(role => {
      if(role.alias == args[i]){
        var groles = message.guild.roles.array()
        for (let index = 0; index < groles.length; index++) {
          if(groles[index].name.toLowerCase() == role.name.toLowerCase()){
            message.reply(" left " + args[i])
            message.member.removeRole(groles[index])
          }
        }
      }
    });
    }
  }

}

