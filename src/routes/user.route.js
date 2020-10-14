const { Router } = require('express')
const router = Router()
const { signup, login } = require('../controllers/auth.controller')

router.post('/api/signup', signup )
router.post('/api/login', login)


module.exports = router