const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

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
app.post("/signin", (req, res) => {
    const { email, password } = req.body;
    db.select('email', 'hash').from('login')
    .where('email','=',email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
          return db.select('*').from('users')
          .where('email', '=' , email)
          .then(user => {
              console.log(user);
              res.json(user[0])
          })
          .catch(err => res.status(400).json('if error'));
      } else {
          res.status(400).json('else error');
      }
    })
    .catch(err => {
      res.status(400).json('hatali giris');
    })
  });

// REGISTER
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })
  .catch((err) => res.status(400).json("unable to register"))
});

// USER PROFOLE - ID
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({
      id: id,
    })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("user not found");
      }
    })
    .catch((err) => res.status(400).json("error"));
});

// COUNTING ENTRIES BY ID
app.put("/image", (req, res) => {
  const { id } = req.body;
  console.log(`recived id: ${id}`);
  db.select("*")
    .from("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => {
      res.status(400).json("error to get entries");
    });
});

// LISTEN THE APP
app.listen(3000, () => {
  console.log("app is running on port 3000");
});
