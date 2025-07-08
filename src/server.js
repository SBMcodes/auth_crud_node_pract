import express from 'express';
import path,{dirname} from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import toDoRoutes from './routes/todoRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';


// Important req properties: body,params,query

const PORT= process.env.PORT || 4646;
const app = express();

// File Path of the URL of the current module
const __filename=fileURLToPath(import.meta.url);
// Directory name from the file path
const __dirname = dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname,"..","public")));


// ROUTES

app.get("/",(req,res)=>{

    return res.sendFile(path.join(__dirname,"..","public","index.html"));
})

app.use("/todos",authMiddleware,toDoRoutes);
app.use("/auth",authRoutes);

app.listen(PORT,(req,res)=>{
    console.log(`Server is running on PORT ${PORT}`);
});