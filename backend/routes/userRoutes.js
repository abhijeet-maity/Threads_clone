const express = require('express');
const {signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile, getSuggestedUsers, freeze, getMultipleUsersProfiles, getUserFollowers, getUserFollowings} = require('../controllers/userController');
const protectRoute = require('../middlewares/protectRoute');
const router = express.Router();


router.get('/getprofile/:query',getUserProfile);
router.get('/getMultipleUsersProfiles/:query',getMultipleUsersProfiles);
router.get('/getfollowers/:query',getUserFollowers);
router.get('/getfollowing/:query',getUserFollowings);
router.get('/suggestedusers',protectRoute, getSuggestedUsers);
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/follow/:id', protectRoute, followUnfollowUser);
router.put('/update/:id',protectRoute, updateUser);
router.put('/freeze',protectRoute, freeze);


module.exports = router;