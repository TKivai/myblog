const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth');


//Login Page
router.get('/login', authController.getLogin);

//POST request from Login Page
router.post('/login', authController.postLogin);

//Register Page
router.get('/register', authController.getRegister);

//POST request from Register Page
router.post('/register', authController.postRegister);

//Logout 
router.post('/logout', authController.logout)


module.exports = router;