const express = require('express')
const router = express.Router();


//Login Page
router.get('/login', (req, res) => res.render("login"));

//Register Page
router.get('/register', (req, res) => res.render("register"));

//POST request from Login
router.post('/login', (req, res) => {
    res.send('Login Successfull');
});

//POST request from Register
router.post('/register', (req, res) => {
    const {username, email, password, password2} = req.body;
    console.log(username)
    res.send('Registration Successfull');
});


module.exports = router;