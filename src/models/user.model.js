const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
 username: {
  type: String,
  required: [true, 'please enter a username'],
  minlength: [5, 'minimum username length is 5'],
  unique: true,
  lowercase: true,
 },

 password: {
  type: String,
  required: [true, 'you need to choose a password'],
  minlength: [5, 'minimum password length is 5']
 }
})



// mongoose middleware
userSchema.pre('save', async function(next) {
 const salt = await bcrypt.genSalt()
 this.password = await bcrypt.hash(this.password, salt)
 next()
})

userSchema.statics.login = async function(username, password) {
 const user = await this.findOne({ username })
 if(user){
  const auth = await bcrypt.compare(password, user.password)
  if(auth) {
   return user
  } 
  throw new Error('incorrect password')
 }

 throw Error('incorrect username')
}

const User = mongoose.model('users', userSchema)

module.exports = User