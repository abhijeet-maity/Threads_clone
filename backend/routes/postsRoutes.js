// const express = require('express');
// const protectRoute = require('../middlewares/protectRoute');
// const {createPost, getPost, deletePost, likeUnlikePost, replyOnPost, getFeedPosts, getUserPosts} = require('../controllers/postController');


import express from 'express';
import protectRoute from '../middlewares/protectRoute.js';
import { 
    createPost, 
    getPost, 
    deletePost, 
    likeUnlikePost, 
    replyOnPost, 
    getFeedPosts, 
    getUserPosts 
} from '../controllers/postController.js';

const router = express.Router();

router.post('/create', protectRoute, createPost);
router.delete('/:id', protectRoute, deletePost);
router.put('/like/:id', protectRoute, likeUnlikePost);
router.put('/reply/:id', protectRoute, replyOnPost);
router.get('/feed',protectRoute, getFeedPosts); 
router.get("/user/:username", getUserPosts);
router.get("/:id", getPost);

export default router;

// module.exports = router;