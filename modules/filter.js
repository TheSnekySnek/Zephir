
const banTreshold = 3
const monTime = 15 // 15min
var memberFlagCount = {}


//Actively monitors a member for spam or nsfw content
function activeMonitoring(member) {
   memberFlagCount[member.id] = {
      flags: 0,
      lastTime: new Date()
   }
   setTimeout(() => {
      delete memberFlagCount[member.id]
   }, monTime * 60000);
}

client.on("guildMemberAdd", (member) => {
   activeMonitoring(member)
})

module.exports.monitor = function(message) {
   if(message.member && memberFlagCount.hasOwnProperty(message.member.id)){
      if(checkSpam(message)){
         memberFlagCount[message.member.id].flags++ 
         if(memberFlagCount[message.member.id].flags > 1)
            message.channel.send(message.member.displayName + "Stop Spamming you have " + (banTreshold - memberFlagCount[message.member.id].flags) + " chance to stop")
      }
      memberFlagCount[message.member.id].lastTime = new Date()
      if(memberFlagCount[message.member.id] >= banTreshold){
         message.channel.send(message.member.displayName + " was banned")
      }
   }
}

function checkSpam(message){
   var nt = new Date()
   return ((message.content.length > 75 && nt - memberFlagCount[message.member.id].lastTime < 5000) || nt - memberFlagCount[message.member.id].lastTime < 1000)
}

