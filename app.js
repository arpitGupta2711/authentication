//jshint esversion:6
require('dotenv').config()
console.log(process.env) 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ["password"] });
const User = new mongoose.model("User", userSchema);
app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});
app.get("/logout",function(req,res){
  res.render("login")
})
app.post("/register", function (req, res) {
  const email = req.body.username;
  const passwr = req.body.password; 
  const newUser = new User({
    email: email,
    password: passwr,
  });
  // console.log(newUser);
  newUser.save(function (err) {
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});
app.post("/login", function (req, res) {
  const email = req.body.username;
  const passwr = req.body.password;
  User.findOne({email:email},function(err,foundEmail){
    if(err){
      console.log(err);
    }
    else{
      if(foundEmail.password===passwr){
        res.render("secrets")
      }
      else{
        res.send("bhkk bsdk");
      }
    }
  })
});



app.listen(3000, function () {
  console.log("Starting listening on port 3000");
});
