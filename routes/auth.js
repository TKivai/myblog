const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth');
const sessionCheckMiddleware = require('../middleware/sessionCheck');


//Login Page
router.get('/login',sessionCheckMiddleware.isLoggedOut, authController.getLogin);

//POST request from Login Page
router.post('/login', authController.postLogin);

//Register Page
router.get('/register', sessionCheckMiddleware.isLoggedOut, authController.getRegister);

//POST request from Register Page
router.post('/register', authController.postRegister);

//Logout 
router.post('/logout', authController.logout)


module.exports = router;