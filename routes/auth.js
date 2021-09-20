const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth');
const authMiddleware = require('../middleware/authCheck');


//Login Page
router.get('/login',authMiddleware.isLoggedOut, authController.getLogin);

//POST request from Login Page
router.post('/login', authController.postLogin);

//Register Page
router.get('/register', authMiddleware.isLoggedOut, authController.getRegister);

//POST request from Register Page
router.post('/register', authController.postRegister);

//Logout 
router.post('/logout', authController.logout)


module.exports = router;