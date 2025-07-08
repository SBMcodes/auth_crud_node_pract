import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();


// Get All To-Do's
router.get("/",(req,res)=>{

    return res.sendStatus(200);
})

// Create a new To-Do
router.post("/",(req,res)=>{
    
});

// Update a new To-Do
router.put("/:id",(req,res)=>{
    
});

// Delete a new To-Do
router.delete("/:id",(req,res)=>{
    
});

export default router;