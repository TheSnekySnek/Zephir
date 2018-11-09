
const banTreshold = 2
var memberFlagCount = {}


//Actively monitors a member for spam or nsfw content
function activeMonitoring(member) {
   memberFlagCount[member.id] = {
      flags: 0,
      spamCount: 0,
      lastTime: new Date()
   }
   setTimeout(() => {
      delete memberFlagCount[member.id]
   }, 15 * 60000); // 15min
}

module.exports.monitor = function(message) {
   
   if(message.member && memberFlagCount.hasOwnProperty(message.member.id)){
      if(checkSpam(message.content)){
         memberFlagCount[message.member.id].flags++
      }
      if(checkNSFW(message)){
         memberFlagCount[message.member.id].flags++
      }
      if(memberFlagCount[message.member.id] >= banTreshold){
         console.log("Banning user " + message.member.displayName)
      }
   }
}

function checkSpam(message){
   var nt = new Date()
   if(message.content.length > 50 && (memberFlagCount[message.member.id].lastTime == 0 | nt - memberFlagCount[message.member.id].lastTime < 10000)){
      
      return true
   }
   return false
}

