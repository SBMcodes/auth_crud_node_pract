import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import { log } from "console";

const router = express.Router();


// Get All To-Do's
router.get("/",(req,res)=>{
    const getToDos = db.prepare(`SELECT * from todos WHERE user_id=?`);
    const todos = getToDos.all(req.userId);

    return res.json(todos);
})

// Create a new To-Do
router.post("/",(req,res)=>{
    
    const {task} = req.body;
    const insertToDo = db.prepare(`INSERT INTO todos(user_id,task) VALUES(?,?)`);
    const result = insertToDo.run(req.userId,task);

    return res.json({
        id: result.lastInsertRowid ,
        task,
        completed:0
    });

});

// Update a new To-Do
router.put("/:id",(req,res)=>{
    const {id} = req.params;
    const {task,completed} = req.body;

    const updateToDo = db.prepare(`UPDATE todos SET task=?,completed=? WHERE id=?`);
    updateToDo.run(task,completed,id);

    return res.json({messaage:"To Do Completed"});
});

// Delete a new To-Do
router.delete("/:id",(req,res)=>{
    const {id} = req.params;
    const deleteToDo = db.prepare(`DELETE FROM todos where id=? AND user_id=?`);
    deleteToDo.run(id,req.userId);

    return res.json({messaage:"To Do Deleted"})
});

export default router;