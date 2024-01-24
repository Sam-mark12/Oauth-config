import express from "express";
import passport from "./AUTH/auth.js";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// config();
function isLogin(req,res,next){
    if(req.user){
        next();
    }
    else{
        res.sendStatus(401);
    }
}

const app = express();
app.use("/dist",express.static("dist"));
mongoose
.connect(process.env.DB_URI)
.then( () => {
    console.log("connected To Database");
})
.catch( (e) =>{
    console.log(e);
    console.log("Not Connected To The DataBase");
})

app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({
        client:mongoose.connection.getClient(),
        collectionName:"sessions",
        stringify:true
      })
}));
app.use(passport.initialize());
app.use(passport.session())

app.get("/htm",(req,res)=>{
    res.sendFile('main.html', { root: __dirname });
})

app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

app.get("/auth/google/callback", passport.authenticate("google",{
successRedirect: "/protected",
failureRedirect: "/auth/failure"
}));

app.get("/protected",isLogin,(req,res)=>{
    res.sendFile('protected.html', { root: __dirname });
});

app.get("/auth/failure",(req,res)=>{
    console.log("There is something wrong");
})

app.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { 
        console.log(err);
        return next(err); 
      }
      console.log('Logout successful');
      res.redirect('/htm');
    });
});

app.listen(4000,()=>{
    console.log("Server is running successfully");
});
