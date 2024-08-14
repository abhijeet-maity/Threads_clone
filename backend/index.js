const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./db/connectDb');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const postsRoutes = require('./routes/postsRoutes');
const messageRoutes = require('./routes/messageRoutes');
const cloudinary = require('cloudinary').v2;

dotenv.config();
connectDb();
const server = express();
const PORT = process.env.PORT || 3000;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

server.use(express.json({limit: '40mb'}));
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

server.use("/api/users", userRoutes);
server.use("/api/posts", postsRoutes);
server.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT} and listening on port ` + PORT);
})