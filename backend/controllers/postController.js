
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import { v2 as cloudinary } from 'cloudinary';

export const createPost = async (req, res) => {
    try {
		// The postedBy, text, and img fields are extracted from the request body which are sent through frontend.
        const { postedBy, text } = req.body;
		let { img } = req.body;
		console.log(postedBy, text);

		// If postedBy or text are missing, a 400 status error response is sent through res body to frontend
        if (!postedBy || !text) {
			return res.status(400).json({ error: "Postedby and text fields are required" });
		}

		//The user is fetched from the database. If the user doesn’t exist, a 404 status error response is sent.
        const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		//If the logged-in user isn’t the same as the user trying to create the post, a 401 status error response is sent.
        if (user._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to create post" });
		}

		//If the text exceeds the maximum length, a 400 status error response is sent.
        const maxLength = 500;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}
		//If there’s an image, it’s uploaded to Cloudinary, and the URL is updated.
		if(img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
			//
		}
		//A new post is created and saved to the database.
        const newPost = new Post({ postedBy, text, img });
		await newPost.save();

		res.status(201).json(newPost);

    } catch (err) {
        res.status(500).json({ error: err.message });
		console.log(err);
    }
};

// Finding post of users follwing from post collection.
export const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}
        
        //if logged in person tries to delete post of different person
		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		if(post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const likeUnlikePost = async (req, res) => {

	try {
        //get post Id and rename as postId
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}; 

export const replyOnPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;// getting post id from params
		const userId = req.user._id; 
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { userId, text, userProfilePic, username };

		post.replies.push(reply);
		await post.save();
		// change the post to reply for safety later on
		res.status(200).json(reply);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
//

export const getFeedPosts = async (req, res) => {
	
	try {
		const userId = req.user._id;
		// console.log("___",userId);
		const user = await User.findById(userId);
		// console.log(user);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
        
        //list of people whom users follow
		// console.log("__user     ",user)
		const following = user.following;
		// console.log("_",following);
        // posts created by people who are followed by user
		// to sort the posts according to latest order means latest will be available at top
		const feedPosts = await Post.find({ postedBy: { $in: following }}).sort({ createdAt: -1 });
		//
		res.status(200).json(feedPosts);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.message });
	}
};

export const getUserPosts = async (req, res) => {
	const {username} = req.params;
	try {
		const user = await User.findOne({ username});
		if(!user) {
			return res.status(404).json({ error: "user Not found" });
		}
		// sorting in descending order that means latest post by logged in user will appear first.
		const posts = await Post.find({postedBy: user._id}).sort({createdAt: -1});
		res.status(200).json(posts);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};


