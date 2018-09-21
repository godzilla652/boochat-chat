
function mongooseMonster(){

const mongoose = require('mongoose')
const config = require('../config')

//create a connection to MongoDB
let mongoDB = config.mongodbServer + config.mongodbDatabase
mongoose.connect(mongoDB, {useNewUrlParser:true})
mongoose.Promise = global.Promise
let db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

//defining schemas for mongoose
let Schema = mongoose.Schema

let modelSchema = new Schema({
  name : String,
  password : String,
  cookie: String
})

//
let ReplicaSchema = new Schema({
  date : String,
  username: String,
  message : String,
})
let Replicas = mongoose.model('replicas', ReplicaSchema)

this.addReplica = function(message, date, username, callback){
  let instance = new Replicas({date:date, username:username, message:message})

  instance.save(function (err) {
    if (err) return handleError(err)
    else{callback()}
  })

}

this.findReplicas = function(callback){
  Replicas.find(function(err, data){
    if(err) return handleError(err)
    else{
      //shows an array of whole collection
      callback(data)
    }
  })
}
//

//compiling a model from schema
let Users = mongoose.model('users', modelSchema)


//creating an instance from model
this.addUser = function(username, userpassword, usercookie){
  let awesome_instance = new Users({name:username, password:userpassword, cookie:usercookie})

  awesome_instance.save(function (err) {
    if (err) return handleError(err);
  })
}

this.findCollection = function(callback){
  Users.find(function(err, data){
    if(err) return handleError(err)
    else{
      //shows an array of whole collection
      callback(data)
    }
  })
}

this.findUserByName = function(name, callback){
  Users.findOne({"name":name}, function(err, data){
    if(err) return handleError(err)
    else{
      callback(data)
    }
  })
}
this.findUserByCookie = function(cookie, callback){
  Users.findOne({"cookie":cookie}, function(err, data){
    if(err) return handleError(err)
    else{
      callback(data)
    }
  })
}


//

let UsersOnlineSchema = new Schema({
  name : String,
})
let UsersOnline = mongoose.model('online', UsersOnlineSchema)

this.findOnlineUser = function(name, callback){
  UsersOnline.findOne({"name":name}, function(err, data){
    if(err) return handleError(err)
    else{
      callback(data)
    }
  })
}

this.addOnlineUser = function(name, callback){
  let instance = new UsersOnline({'name':name})
  instance.save(function (err) {
    if (err) return handleError(err)
    else{callback()}
  })
}
this.removeOnlineUser = function(name, callback){
  UsersOnline.findOneAndDelete({'name': name}, function(err){
    if(err) return handleError(err)
    else{callback()}
  })
}

this.findOnlineCollection = function(callback){
  UsersOnline.find(function(err, data){
    if(err) return handleError(err)
    else{
      callback(data)
    }
  })
}


}//mongoose monster ends here
module.exports = new mongooseMonster()
