import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import connectDb from './db/connectDb.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postsRoutes from './routes/postsRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { v2 as cloudinary } from 'cloudinary';
import { app, server } from "./socket/socket.js";

dotenv.config();
connectDb();
// const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve(); 

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

//http://localhost:3000 => backend + frontend
 
if(process.env.NODE_ENV === "production") {
	server.use(express.static(path.join(__dirname, "/frontend/dist")))

	//react app
	server.get("*",(req,res) => {
		res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
	})
}

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT} and listening on port ` + PORT);
})

