const express = require('express')
const router = express.Router();
const postsController = require('../controllers/posts');
const sessionCheckMiddleware = require('../middleware/sessionCheck');
const tokenCheckMiddleware = require('../middleware/tokenCheck');


router.get('/', tokenCheckMiddleware.authenticateToken, postsController.getPosts);

router.get('/create', tokenCheckMiddleware.authenticateToken, postsController.getCreatePostView);
router.post('/create', tokenCheckMiddleware.authenticateToken, postsController.postCreatePostView);

router.get('/:postId', tokenCheckMiddleware.authenticateToken, postsController.getPost);

router.post('/edit/:postId', tokenCheckMiddleware.authenticateToken, postsController.editPost);
router.post('/delete/:postId', tokenCheckMiddleware.authenticateToken, postsController.deletePost);

module.exports = router;
