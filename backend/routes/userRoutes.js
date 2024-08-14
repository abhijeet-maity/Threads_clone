const express = require('express');
const {signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile} = require('../controllers/userController');
const protectRoute = require('../middlewares/protectRoute');
const router = express.Router();


router.get('/getprofile/:query',getUserProfile);
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/follow/:id', protectRoute, followUnfollowUser);
router.put('/update/:id',protectRoute, updateUser);
// router.get('/getprofile/:query',getUserProfile);

module.exports = router;