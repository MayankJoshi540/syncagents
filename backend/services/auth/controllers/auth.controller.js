import { getAuth } from "firebase-admin/auth"
import {app} from "../config/firebase.js" 
import User from "../model/userModal.js"
import crypto from "crypto"
import redisClient from "../../../shared/redis/redis.js"
export const login = async (req, res) => {
    try {
        const {token} = req.body;
        const decoded = await getAuth(app).verifyIdToken(token)
        let user = await User.findOne({
             firebaseUID: decoded.uid
        })
        if(!user){
            user = await User.create({
                firebaseUID: decoded.uid,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture
            })
        }
        const sessionId = crypto.randomUUID();
        await redisClient.set(`session:${sessionId}`, JSON.stringify({
            userID:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar
        }), 'EX', 60*60*24*7);  
        res.cookie("session",sessionId , {
            httpOnly: true,
            secure: false,
            sameSite:"strict",
            maxAge: 1000 * 60 * 60 * 24 * 7 
        })
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(401).json({message:"Unauthorized"})   
    }
}

export const logOut = async(req,res)=>{
    try {
        const sessionId = req.cookies?.session;
        if(!sessionId){
            return res.status(401).json({message:"Unauthorized"}); 
        }
        await redisClient.del(`session:${sessionId}`);
        res.clearCookie("session");
        return res.status(200).json({message:"Logged out successfully"}); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
}   

export const getCurrentUser = async (req, res) => {
    try {
        const sessionId = req.cookies?.session;
        if(!sessionId){
            return res.status(401).json({message:"Unauthorized"}); 
        }
        const userData = await redisClient.get(`session:${sessionId}`);
        if (!userData) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(200).json(JSON.parse(userData));
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}   