const express = require('express')
const router = express.Router();

router.get('/', (req, res) => res.render('welcome', {
    isAuthenticated: req.session.isLoggedIn
}));

router.get('/test', (req, res) => res.render('test'));

module.exports = router;