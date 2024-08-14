const express = require('express');
const protectRoute = require('../middlewares/protectRoute');
const { getMessages, sendMessage, getConversations } = require('../controllers/messageController');

const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.get('/:otherUserId', protectRoute, getMessages);
router.post("/", protectRoute, sendMessage);


module.exports = router;