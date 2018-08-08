/**
 * Initialize Discord JS and other packages
 */
global.Discord = require('discord.js');
const fs = require('fs');

/**
 * Create the Discord client
 * @type {Discord}
 */
global.client = new Discord.Client();
global.mods = ["83519111514034176"]
global.api= require('./includes/api');
global.messages = require('./includes/messages');
global.player = require('./includes/player');
global.lyrics = require('./includes/lyrics');
global.queue = require('./includes/queue');
global.search = require('./includes/search');
global.stats = require('./includes/statManager');
MH = require('./includes/mh');

process.on('message', function(m) {
  MH.handle(m)
});

process.on('SIGINT', function() {
  console.log("Disconnecting...");
  client.destroy();
  setTimeout(function() {
    process.exit();
  },1000)

});

console.log("mb ready")

process.send(JSON.stringify({type: "ready"}))
