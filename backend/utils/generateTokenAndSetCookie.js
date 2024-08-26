

import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d',
    });

    res.cookie("jwt", token, {
        httpOnly: true, // cannot be accessed by browser and hence it is more secure
        maxAge: 15*24*60*60*1000,// token will expire in 15 days.
        sameSite: "strict", // more secure CSRF
    });

    return token;
};

export default generateTokenAndSetCookie;
