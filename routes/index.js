const express = require('express')
const router = express.Router();
const postsController = require('../controllers/posts');


// router.get('/', (req, res) => res.render('welcome', {
//     isAuthenticated: req.session.isLoggedIn
// }));
router.get('/', postsController.getPosts);

router.get('/test', (req, res) => res.render('test'));

module.exports = router;