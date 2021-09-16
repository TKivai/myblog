const express = require('express')
const router = express.Router();

router.get('/', (req, res) => res.render('welcome', {
    isAuthenticated: req.session.isLoggedIn
}));

module.exports = router;