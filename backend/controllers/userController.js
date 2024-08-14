const User = require("../models/userModel");
const Post = require("../models/postModel");
const bcrypt = require("bcryptjs");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

const signupUser = async (req, res) => {
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

const loginUser = async (req, res) => {
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

const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in user logout : ", error.message);
  }
};

const followUnfollowUser = async (req, res) => {
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
const updateUser = async (req, res) => {

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

const getUserProfile = async (req, res) => {

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

//   try{
//     //??get user profile based on username entered except password and last updated fields.
//     const user = await User.findOne({username}).select("-password").select("-updatedAt");
//     if(!user) return res.status(400).json({error: "User not found"});
//     res.status(200).json(user);

//   } catch(error) {
//     res.status(500).json({ error: error.message });
//     console.log("Error in get profile : ", error.message);
//   }
};


module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
};
