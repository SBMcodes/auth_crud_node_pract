import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import { log } from "console";

const router = express.Router();

// REGISTER a new user endpoint
router.post("/register",(req,res)=>{
    console.log(req.body);
    const {username,password} = req.body;

    // Encrypt the password
    const hashedPass = bcrypt.hashSync(password);
    log(hashedPass);

    // Save the username & password to DB
    try {
        const insertUser = db.prepare(`INSERT INTO user (username,password) VALUES (?,?)`);
        const result = insertUser.run(username,hashedPass);

        const userId = result.lastInsertRowid;


        // Insert a default To-Do
        const defaultToDo = `Your First To Do!`;
        const insertToDo = db.prepare(`INSERT INTO todos (user_id,task) VALUES (?,?)`);
        insertToDo.run(userId,defaultToDo);
        
        // Create a token
        const token = jwt.sign({
            id: userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"24h"
        }
    );

    return res.json({token})


    } catch (error) {
        log(error.message);
        return res.sendStatus(503);
    }

});

// LOGIN a user endpoint
router.post("/login",(req,res)=>{
    console.log(req.body);
    const {username,password} = req.body;

    try {
        const getUser = db.prepare(`SELECT * from user where username=?`);
        const user = getUser.get(username);

        // If no user exists with given username...
        if(!user){
            return res.status(404).send({message:"User not found!"})
        }

        // If Hashed Password does not match...
        const passwordIsValid = bcrypt.compareSync(password,user.password);
        if(!passwordIsValid){
            return res.status(401).send({message:"Invalid Password"});
        }

        log(user);

        // Create a token after successful authentication
        const token = jwt.sign({
            id: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"24h"
            }
        );

        return res.json({token})

    } catch (error) {
        return res.sendStatus(503);
    }
});

export default router;