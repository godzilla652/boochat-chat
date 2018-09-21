const crypto = require('crypto')

function helpers(){
  this.hashPassword = function(password){
    let temp = crypto.createHash('md5').update(password).digest("hex")
    return temp
  }

}


module.exports = new helpers()
