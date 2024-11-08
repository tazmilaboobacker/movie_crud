// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

//define schema

const postSchema=new mongoose.Schema({
  Course:{type:String , required:true},
  description:{type:String , required:true},
})
const POST=mongoose.model('Post',postSchema)


//create newpost
app.post('/api/posts',async(req,res)=>{

  const newPost=new POST({
    Course:req.body.Course,
    description:req.body.description,
  })
  try {
    const savedPost=await newPost.save()
    res.status(200).json(savedPost)
  } catch (error) {
    res.status(500).json({error:error.message})
  }
  
})

//get all posts
app.get('/api/posts',async(req,res)=>{
  try {
    const limit=Number(req.query.limit)
    const posts=limit?await POST.find().limit(limit):await POST.find()
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({error:error.message})
  }
  
})

// get post by id
app.get('/api/posts/:id',async(req,res)=>{
  try {
    const post=await POST.findById(req.params.id)
    res.status(200).json(post)
  } catch (error) {
    res.status(500).json({error:error.message})
  }
  
})

//update post

app.put('/api/posts/:id',async(req,res)=>{
  try{
    const post= await POST.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
    })
    if(post){
      res.status(200).json(post)
    }else{
      res.status(404).json("id doesnot exist")
    }
  }catch(error){
    res.status(500).json({error:error.message})
  }
})

//delete post

app.delete('/api/posts/:id',async(req,res)=>{
  try{
    const post= await POST.findByIdAndDelete(req.params.id)
    if(post){
      res.status(200).json(post)
    }else{
      res.status(404).json("id doesnot exist")
    }
  }catch(error){
    res.status(500).json({error:error.message})
  }
})

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});