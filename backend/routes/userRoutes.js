
import express from 'express';
import {
    signupUser,
    loginUser,
    logoutUser,
    followUnfollowUser,
    updateUser,
    getUserProfile,
    getSuggestedUsers,
    freeze,
    getMultipleUsersProfiles,
    getUserFollowers,
    getUserFollowings,
    deleteUser
} from '../controllers/userController.js';
import protectRoute from '../middlewares/protectRoute.js';

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
router.delete('/delete',protectRoute, deleteUser);

export default router;
