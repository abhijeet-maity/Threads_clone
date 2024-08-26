// const User = require("../models/userModel");
// const Post = require("../models/postModel");
// const bcrypt = require("bcryptjs");
// const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
// const cloudinary = require('cloudinary').v2;
// const mongoose = require('mongoose');

import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';


export const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    console.log(name, email, username, password);
    const user = await User.findOne({ $or: [{ email }, { username }] });

    // Check if user already exists or not
    if (user) {
      return res.status(400).json({ error: "User alrrady exists" });
    }

    //hashing user password so nobody could view it in database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //creating new document or record or row which needs to be saved in the database
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    //generating token and saving the token in the cookie of the client browser.
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
        username: newUser.username,
      });
    } else {
      res.status(400).json({ error: "Invalid user data." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in signup user : ", error.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    //user is searched from db by current username
    const user = await User.findOne({ username });
    //hashed password is compared with entered password
    //null password is avoided for non existent users
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    if(user.isFrozen){
      user.isFrozen = false;
      await user.save();
    }

    generateTokenAndSetCookie(user._id, res);

    //??This response is send back to the user if the login is successful
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      username: user.username,
      profilePic: user.profilePic,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in user login : ", error.message);
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in user logout : ", error.message);
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currUser = await User.findById(req.user._id);

    //this checks if current user is trying to follow himself or not.
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot follow or unfollow yourself" });
    }

    if (!userToModify || !currUser) {
      return res.status(400).json({ error: "User not found" });
    }

    const isFollowing = currUser.following.includes(id);

    if (isFollowing) {
      //unfollowing user
      //changes(removing) done in the following array of user who is unfollowing his target user
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      //changes(removing) done in the followers array of targeted user.
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      //changes(adding) done in the following array of user who is following his target user
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      //changes(adding) done in the followers array of targeted user.
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in user followUnfollow users : ", error.message);
  }
};

//This updateUser function is not working fine it needs a look
export const updateUser = async (req, res) => {

  const { name, email, username, password, bio } = req.body;
  let { profilePic} = req.body;
  console.log(name, email, username, password, profilePic, bio);
  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    //resrtricting to change other peoples profile
    if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if(profilePic){
      if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    await Post.updateMany(
      {"replies.userId" : userId},
      {
        $set : {
          "replies.$[reply].username" : user.username,
          "replies.$[reply].userProfilePic" : user.profilePic
        }
      },
      {arrayFilters:[{"reply.userId": userId}]}
    )

    user.password = null;
    res.status(200).json({ message: "Profile updated successfully", user });

  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in user update users : ", error.message);
  }
};

//??get user profile based on username entered except password and last updated fields.
export const getUserProfile = async (req, res) => {

  const {query} = req.params;
  //query is either username or useId

  try {
		let user;

		// query is userId
		if (mongoose.Types.ObjectId.isValid(query)) {
      //??get user profile based on userId entered except password and last updated fields.
			user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
		} else {
			// query is username
			user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
		}

		if (!user) return res.status(404).json({ error: "User not found" });

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in getUserProfile: ", err.message);
	}

};


export const getSuggestedUsers = async (req, res) => {
  try {
    //exclude loggedIn user and the users the loggedIn user follows from the suggested list of users.
    const userId = req.user._id;
    const userFollowedByMe = await User.findById(userId).select("following");
    const users = await User.aggregate([
      {
        $match: {
          _id: {$ne : userId},
        }
      },
      {
        $sample : {
          size : 10,
        }
      }
    ]);
    // console.log(userFollowedByMe);
    // console.log("users",users);

    const filteredUsers = users.filter(user => !userFollowedByMe.following.includes(user._id));
    const suggestedOnes = filteredUsers.slice(0,4);
    suggestedOnes.forEach(user => user.password = null);      
    res.status(200).json(suggestedOnes);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const freeze = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if(!user) {
      res.status(404).json({ error: "User not found." });
    }

    user.isFrozen = true;
    await user.save();

    res.status(200).json({success: true});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getMultipleUsersProfiles = async (req, res) => {
  const { query } = req.params;
  // query is either userId or username
  
  
  try {
    let users;

    // query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      // Get user profile based on userId entered except password and last updated fields.
      users = await User.find({ _id: query }).select("-password -updatedAt");
    } else {
      // query is username, find multiple users matching the username
      const regex = new RegExp(query, 'i');
      users = await User.find({ username: regex }).select("-password -updatedAt");
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getUserProfiles: ", err.message);
  }
};

export const getUserFollowers = async (req, res) => {
  const {query} = req.params;

  try {
    let user;

    if (mongoose.Types.ObjectId.isValid(query)) {
      //??get user profile based on userId entered except password and last updated fields.
			user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
		} else {
			// query is username
			user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
		}

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Assuming the followers are stored as an array of ObjectIds in a `followers` field in the User model
    const followers = await User.find({ _id: { $in: user.followers } }).select("-password -updatedAt -createdAt");

    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


export const getUserFollowings = async (req, res) => {
  const {query} = req.params;

  try {
    let user;

    if (mongoose.Types.ObjectId.isValid(query)) {
      //??get user profile based on userId entered except password and last updated fields.
			user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
		} else {
			// query is username
			user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
		}

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Assuming the followers are stored as an array of ObjectIds in a `followers` field in the User model
    const following = await User.find({ _id: { $in: user.following } }).select("-password -updatedAt -createdAt");

    res.status(200).json(following);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;
  
    if(!userId) {
      return res.status(400).json({ error: "User Id is required" });
    }
    // Remove the Current user from the followers list of users they followed.
    await User.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );
    // Remove the Current user from the following list of users who followed them.
    await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );
    const user = await User.findByIdAndDelete(userId);
    if(!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({success: true});
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
  
};

// module.exports = {
//   signupUser,
//   loginUser,
//   logoutUser,
//   followUnfollowUser,
//   updateUser,
//   getUserProfile,
//   getSuggestedUsers,
//   freeze,
//   getMultipleUsersProfiles,
//   getUserFollowers,
//   getUserFollowings
// };
