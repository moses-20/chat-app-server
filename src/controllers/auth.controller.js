const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

const handleErrors = (err) => {
 let errors = { username: '', password: '' }

 if(err.message === 'incorrect username') {
  errors.username = 'that username does not exist'
 }

 if(err.message === 'incorrect password') {
  errors.password = 'that password does not exist'
 }

 if(err.code === 11000){
  errors.username = 'the username is not available'

  return errors
 }

 if(err.message.includes('users validation failed')) {
  Object.values(err.errors).forEach(({ properties }) => {
   errors[properties.path] = properties.message
  })
 }

 return errors
}

const maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
 return jwt.sign({ id }, 'some characters are long', {
  expiresIn: maxAge
 })
}

const userCtrl = {}

// create
userCtrl.signup = async (req, res) => {
 const { username, password } = req.body

 try{
  let user = await User.create({ username, password })
  const token = createToken(user._id)

  res.setHeader('Access-Control-Allow-Headers', 'Set-Cookie')
  res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
  res.status(201).json({ username: user.username })
  console.log(user.username)
 } catch (err) {
  const errors = handleErrors(err)
  res.status(400).json({ errors })
 }
}

userCtrl.login = async (req, res) => {
 const { username, password } = req.body
 try {
  const user = await User.login(username, password)
  const token = createToken(user._id)

  res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
  res.status(201).json({ username: user.username })
  console.log(user.username)

 } catch(err) {
  const errors = handleErrors(err)
  res.status(400).json({ errors })
 }
}


module.exports = userCtrl