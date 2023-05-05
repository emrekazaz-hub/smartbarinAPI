const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profileid = require("./controllers/profileID");
const entries = require("./controllers/entries");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "2013",
    database: "smart-brain",
  },
});

db.select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  });


// HOME PAGE
app.get("/", (req, res) => {
  res.send(database.users);
});

// SIGN IN
app.post("/signin", (req,res) => {signin.handleSignin(req, res, db, bcrypt)});

// REGISTER
app.post("/register", (req,res) => {register.handleRegister(req,res,db,bcrypt)});

// USER PROFOLE - ID
app.get("/profile/:id", (req,res) => {profileid.handleProfileId(req,res,db)});

// COUNTING ENTRIES BY ID
app.put("/image", (req,res) => {entries.handleEntries(req,res,db)});

// LISTEN THE APP
app.listen(3000, () => {
  console.log("app is running on port 3000");
});
