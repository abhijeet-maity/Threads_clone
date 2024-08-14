const User = require('../models/userModel');
const jwt = require("jsonwebtoken");

const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({message: "UnAuthorized"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);  
        const user = await User.findById(decoded.userId).select("-password");
        // console.log(user);
        req.user = user;
        next();

    } catch(error) {
        res.status(500).json({message : error.message});
        console.log("Error : ",error.message);
    }
};

module.exports = protectRoute;