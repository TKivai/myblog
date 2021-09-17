const express = require('express')
const router = express.Router();
const postsController = require('../controllers/posts');

router.get('/', postsController.getPosts);
router.get('/create', postsController.getCreatePostView);
router.post('/create', postsController.postCreatePostView);

router.get('/:postId', postsController.getPost);


router.post('/edit/:postId', postsController.editPost);
router.post('/delete/:postId', postsController.deletePost);



module.exports = router;
