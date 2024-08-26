// const express = require('express');
// const protectRoute = require('../middlewares/protectRoute');
// const { getMessages, sendMessage, getConversations } = require('../controllers/messageController');

import express from 'express';
import protectRoute from '../middlewares/protectRoute.js';
import { getMessages, sendMessage, getConversations } from '../controllers/messageController.js';

const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.get('/:otherUserId', protectRoute, getMessages);
router.post("/", protectRoute, sendMessage);


export default router;

// module.exports = router;