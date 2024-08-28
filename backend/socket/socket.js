
import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import Message from '../models/messageModel.js';
import Conversation from '../models/conversationModel.js';

const server = express();   //server
const app = http.createServer(server); //server   -  server
const io = new Server(app,{       //server
    cors:{
        origin: "http://localhost:5000",
        methods: ["GET","POST"]
    }
});


//This stores userId and socketId in mapped fashion.
const userSocketHashMap = {};

const getReceiverSocketId = (receiverId) => {
    return userSocketHashMap[receiverId];
}


io.on('connection', (socket) => {
    console.log("user connected", socket.id);
    const loggedInUserId = socket.handshake.query.userId;

    if(loggedInUserId != "undefined") {
        userSocketHashMap[loggedInUserId] = socket.id;
    }
    io.emit("getOnlineUsers", Object.keys(userSocketHashMap));

    // To listen fro the event when receiver sees our messages.
    socket.on("markMsgSeen", async({conversationId, userId}) => {
        try {
            await Message.updateMany({conversationId : conversationId, seen : false}, {$set:{seen : true}});
            await Conversation.updateOne({_id : conversationId}, {$set: {"lastMessage.seen": true}});
            io.to(userSocketHashMap[userId]).emit("messagesSeen", {conversationId});
        } catch (error) {
            console.log(error);
        }
    });

    // To listen for the event when user logs out of the application.
    socket.on('disconnect', () => {
        console.log("user disconnected", socket.id);
        delete userSocketHashMap[loggedInUserId];
        io.emit("getOnlineUsers", Object.keys(userSocketHashMap));
    });
});

export {io, app, server, getReceiverSocketId};

