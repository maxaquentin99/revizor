const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectID;
const path = require('path');
var history = require('connect-history-api-fallback');
const cors = require('cors')
const DB = require('./data');
const app = express();
const port = process.env.PORT || 8080;

app.use(history())
app.use(cors());
app.use('/images', express.static('public'));
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let db = null;
let dbase = null;
let answers = null;
let clients = null;

app.use(async (req, res, next) => {
  db        = await new DB();
  dbase     =  await db.db('revizor');
  answers    = dbase.collection('answers');
  clients    = dbase.collection('clients');
  next();
})

//clients
app.post('/login', async (req, res) => {
  try {
    let user = await clients.findOne({ 
      username: req.body.username
    });
    if(user){
      if(user.password === req.body.password){
        let token = jwt.sign(user, 'secret');
        res.send({token: token, user: user}) 
      } else {
        res.status(403).send('Password incorrect')
      }
    } else {
      res.status(403).send('No such user');
    }
  } catch(err){
      throw err;
  }
});

//questions
app.get('/ask', async (req, res) => {
  try {
    let token = req.headers.token;
    let user = jwt.decode(token, 'secret');
    let result = await clients.findOne({_id: ObjectId(user._id)});
    res.send(result);
    return result;
    } catch(err){
    throw err;
  }
});

//answers
app.post('/result', async (req, res) => {
  try {
    if(req.headers['x-token']){
      let decoded = await jwt.verify(req.headers['x-token'],'secret');
    if(req.headers['x-token']){
      let result = answers.insertOne({
      client: decoded._id,
      questionone: req.body.questionone, 
      questiontwo: req.body.questiontwo, 
      questionthree: req.body.questionthree,
      comment: req.body.comment, 
      time: Date(),
      });
      res.send(result);
    }
    } else{ 
    }
    } catch(err){
      throw err;
  }
});

app.listen(port);