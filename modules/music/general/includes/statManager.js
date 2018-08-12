module.exports = {
  error: function(data) {
    console.error(data)
    /*if(process.send){
      process.send({type: 'error', data: data})
    }*/
  }
}
