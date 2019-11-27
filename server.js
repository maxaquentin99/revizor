const express    = require('express');
const bodyParser = require('body-parser');
const jwt        = require('jsonwebtoken');
const ObjectId   = require('mongodb').ObjectID;
const path       = require('path');
const cors       = require('cors')
const Telegram   = require('telegraf/telegram')
const tg_token   = '998789488:AAHPSeHvgNktSIWNaTEXamzTYSk3-PlZOjc';
let bot_options  = {
  agent: null,        
  webhookReply: true 
}
let   bot        = new Telegram(tg_token, bot_options);
const DB         = require('./data');
const app        = express();
const port       = process.env.PORT || 80;
// var   history    = require('connect-history-api-fallback');

app.use(cors());
app.use('/images', express.static('public'));
app.use('/',       express.static(path.join(__dirname, 'build')));
app.use('/static', express.static(path.join('build/static')));
app.use('/login',  express.static(path.join(__dirname, 'build')));
app.use('/admin',  express.static(path.join(__dirname, 'revizor-admin/dist')))
app.use('/css',    express.static(path.join(__dirname, 'revizor-admin/dist/css')))
app.use('/js',     express.static(path.join(__dirname, 'revizor-admin/dist/js')))
app.use('/img',    express.static(path.join(__dirname, 'revizor-admin/dist/img')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let db        = null;
let dbase     = null;
let answers   = null;
let clients   = null;
let bot_users = null;
let questions = null;

app.use(async (req, res, next) => {
  db         = await new DB();
  dbase      =  await db.db('revizor');
  answers    = dbase.collection('answers');
  clients    = dbase.collection('clients');
  bot_users  = dbase.collection('bot-users');
  questions  = dbase.collection('questions');
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
    let result        = await clients.findOne({_id: ObjectId(user._id)});
    let qs            = await questions.findOne({client_id: user._id});
    result.question_kit = qs;
    if(!result.question_kit){ 
      result.question_kit = {
        client_id: user._id,
        questions: []
      }
    }
    console.log(result)
    res.send(result);
    return result;
    } catch(err){
    throw err;
  }
});

//answers
app.post('/result', async (req, res) => {
  try {
    if(req.headers['token']){
    let token     = req.headers.token;
    let decoded   = await jwt.verify(token,'secret');
    let recievers = await bot_users.find({client_id: decoded._id}).toArray();
    let result    = await answers.insertOne({
      client: decoded._id,
      answers: req.body.answers,
      question_kit: req.body.question_kit,
      time: Date()
    });
    let text = '';
    req.body.answers.map((item) => {
      text = text +' \n '+ item;
      return 0;
    })
    recievers.forEach(element => {
      bot.sendMessage(element.chat_id, text);
    }); 
    res.send(result);
      }
    else { 
      res.status(403).send('No permission')
      }
  } catch(err){
    res.status(500).send('Damn man, smth goes wrong') 
    throw err;
  }
});

app.post('/edit/questions', async (req, res) => {
  try {
    if(req.headers['token']){
      let token   = req.headers['token'];
      let decoded = await jwt.verify(token,'secret');
      if(req.body._id) delete req.body._id;
      let edited  = await questions.updateOne({client_id: decoded._id}, {
        $set: {
          ...req.body
        }
      },
      {
        upsert: true
      })
      res.send({edited})
    } else {
      res.status(403).send('Permission forbidden') 
    }
  } catch (err) {
    res.status(500).send('Damn man, smth goes wrong') 
    throw err;
  }
}); 

app.listen(port);