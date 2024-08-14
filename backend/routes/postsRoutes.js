const express = require('express');
const protectRoute = require('../middlewares/protectRoute');
const {createPost, getPost, deletePost, likeUnlikePost, replyOnPost, getFeedPosts, getUserPosts} = require('../controllers/postController');

const router = express.Router();

router.post('/create', protectRoute, createPost);
router.delete('/:id', protectRoute, deletePost);
router.put('/like/:id', protectRoute, likeUnlikePost);
router.put('/reply/:id', protectRoute, replyOnPost);
router.get('/feed',protectRoute, getFeedPosts); 
router.get("/user/:username", getUserPosts);
router.get("/:id", getPost);


module.exports = router;