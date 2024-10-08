const PORT = process.env.PORT || 4000;
const express = require("express");
const app = express();
const fs = require('fs')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { type } = require("os");
const { request } = require("http");
const { error } = require("console");
app.use(express.json());
app.use(cors());
// const mongoURL = process.env.MONGODB_URL_LOCAL;

//Database connect with mongoDB
mongoose.connect("mongodb://localhost:27017/E-comm-backend", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  // router Apis
  app.get("/",(req,res)=>{
    res.send("Express app is runing")
  })

  // Image Storage multer
  const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cd)=>{
      return cd(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)})`)
    }
  })
  const upload = multer({storage:storage});

  app.use('/images',express.static('upload/images'))


  //Creating a Endpoint  for images
  app.post("/upload",upload.single('product'),(req,res)=>{
      res.json({
        success:1,
        image_url:`http://localhost:${PORT}/images/${req.file.filename}`
      })
  })

  //  Schema for Creating product
  const Product = mongoose.model("Product",{
    id:{
      type:Number,
      required:true,
    },
    name:{
      type:String,
      required:true,
    },
    image:{
      type:String,
      required:true,
    },
    category:{
      type:String,
      required:true,
    },
    new_price:{
      type:Number,
      required:true
    },
    old_price:{
      type:Number,
      required:true,
    },
    date:{
      type:Date,
      default:Date.now
    },
    avilable:{
      type:Boolean,
      default:true
    }

  })



  app.post('/addproduct',async(req,res)=>{
    //  give a ids number
    let products = await Product.find({});
    let id;
    if(products.length>0){
      let last_product_array = products.slice(-1);
      let last_product = last_product_array[0];
      id = last_product.id+1;
    }
    else{
      id=1;
    }
  
    
    const product = new Product({
      id:id,
      name:req.body.name,
      image:req.body.image,
      category:req.body.category,
      new_price:req.body.new_price,
      old_price:req.body.old_price
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
      success:true,
      name:req.body.name
    })
  })
  //Delete API
  app.post('/removeproduct',async (req,res)=>{
         await Product.findOneAndDelete({id:req.body.id})
         console.log("Removed");
         res.json({
          success:true,
          name:req.body.name
         })
  })
   //Creating API for getting all products
   app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All product Fetched");
    res.send(products);
   });

   //Shema Creating for User Model
   const Users = mongoose.model('Users',{
    name:{
      type:String,
    },
    email:{
      type:String,
      unique:true,
    },
    password:{
      type:String
    },
    cartData:{
      type:Object,
    },
    date:{
      type:Date,
      default:Date.now,
    }
   })
   //Creating a Endpoint for registering the user
   app.post('/signup',async(req,res)=>{
    let check = await Users.findOne({email:req.body.email});
    if(check){
      return res.status(400).json({success:false,errors:"existing user found with same email"})
    }
    let cart={};
    for(let i = 0; i<300; i++){
      cart[i]=0;
    }
    const user = new Users({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      cartData:cart,
    })

    await user.save();

    const data ={
      user:{
        id:user.id
      }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
   });

//Creating a Endpoint for login the user
  app.post('/login',async(req,res)=>{
        let user = await Users.findOne({email:req.body.email});
        if(user){
          const passCompare = req.body.password === user.password;
          if(passCompare){
            const data = {
              user:{
                id:user.id
              }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token})
          }
          else{
            res.json({success:false,errors:"Wrong Password"});
          }
        } 
        else{
          res.json({success:false,errors:"Wrong Email Id"})
        }
  })
  //api for newCollections
  app.get('/newcollectiond', async (req,res)=>{
    let product = await Product.find({});
    let newcollection = product.slice(1).slice(-8);
    console.log("newcollection fetched");
    res.send(newcollection);
  })
//api for popular in women collections
  app.get('/popularinwoman',async (req,res)=>{
    let product = await Product.find({category:"woman"});
    let popular_in_women = product.slice(0,4);
    console.log("populer in women is fetched");
    res.send(popular_in_women);
  })

 

//creating middelware to fetch user
const fetchUser = async (req,res,next)=>{
  const token = req.header('auth-token');
  if(!token){
    res.status(401).send({errors:"plz Authenticate using validation"})
  }
  else{
    try {
      const data = jwt.verify(token,'secret_ecom');
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({errors:"plz Authenticate using validation"})
    }
  }
}


//creating a endpoint for adding a data in cartData
app.post('/addtocart',fetchUser ,async (req,res)=>{
  console.log("removed",req.body.itemId);
    console.log(req.body,req.user);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Added")  
})
//creating a endpoint for remove a data in cartData
app.post('/removeFromCart',fetchUser,async (req,res)=>{
  console.log("removed",req.body.itemId);
  let userData = await Users.findOne({_id:req.user.id})
  if(userData.cartData[req.body.itemId] >0)
    userData.cartData[req.body.itemId] -= 1;
  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
  res.send("Removed")
})

//creating a endpoint to get data
app.get('/getcart',fetchUser,async (req,res)=>{
  console.log("GetCart");
  let userData = await Users.findOne({_id:req.user.id});
  res.json(userData.cartData)
  if(!userData){
    console.log("error");
    
  }
  else{
    console.log("done");
    
  }
})



  app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
});

const db = mongoose.connection;