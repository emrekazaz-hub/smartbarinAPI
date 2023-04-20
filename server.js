const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
    users : [
        {
            id : '123',
            name : 'jhon',
            email : 'jhon@gmail.com',
            password : 'jhon123',
            entries : 0,
            joined : new Date()
        },
        {
            id : '124',
            name : 'sally',
            email : 'sally@gmail.com',
            password : 'sally124',
            entries : 0,
            joined : new Date()
        }
    ]
}

// HOME PAGE
app.get('/',(req,res)=>{
    res.send(database.users);
});


// SIGN IN
app.post('/signin', (req,res) =>{
    if(req.body.email === database.users[0].email &&
         req.body.password === database.users[0].password){
            res.json('giris basarili');
    }else{
        res.status(400).json('error logging in');
    }
});

// REGISTER
app.post('/register', (req,res)=>{
    const {email, name, password} = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
});
    database.users.push({
        id: '1234',
        name : name,
        email : email,
        entries : 0,
        joined : new Date()
    })
    res.json(database.users[database.users.length-1])
});

// USER PROFOLE - ID
app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            return res.json(user);
        }
    });
    if(!found){
        res.status(400).json('not found');
    }
});

// COUNTING ENTRIES BY ID
app.put('/image', (req,res) => {
    const {id} = req.body;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if(!found){
        res.status(4040).json('not found');
    }
});

// LISTEN THE APP
app.listen(3000, ()=> {
    console.log("app is running on port 3000");
});
