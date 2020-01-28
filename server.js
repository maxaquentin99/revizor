const express    = require('express');
const bodyParser = require('body-parser');
const jwt        = require('jsonwebtoken');
const ObjectId   = require('mongodb').ObjectID;
const cors       = require('cors')
var   history    = require('connect-history-api-fallback');
const Telegram   = require('telegraf/telegram')
const tg_token   = '998789488:AAHPSeHvgNktSIWNaTEXamzTYSk3-PlZOjc';
var multer       = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/avatars')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+'-'+file.originalname)
  }
})
var upload = multer({ storage: storage })

let bot_options  = {
  agent: null,
  webhookReply: true
}
let   bot        = new Telegram(tg_token, bot_options);
const DB         = require('./data');
const app        = express();
const port       = process.env.PORT || 5000;

app.use(history())
app.use(cors());
app.use('/avatars', express.static('avatars'));
app.use('/images', express.static('public'));
app.use('/', express.static('build'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let db        = null;
let dbase     = null;
let answers   = null;
let clients   = null;
let bot_users = null;

app.use(async (req, res, next) => {
  db         =  await new DB();
  dbase      =  await db.db('revizor');
  clients    = dbase.collection('clients');
  answers    = dbase.collection('answers');
  bot_users  = dbase.collection('bot-users');
  next();
})

app.post('/api/login', async (req, res) => {
  try {
      let user = await clients.findOne({ 
        username: req.body.username
      });
      if(user){
        if(user.password === req.body.password){
          let token = jwt.sign(user, 'secret');
          res.send({token: token})
        } else {
          res.status(403).send('Password incorrect!')
        }
      } else {
        res.status(403).send('No such user!');
      }
    } catch(err){
        throw err;
    }
});

app.get('/api/get/clients', async (req, res) => {
  try {
  let result = await clients.find({}).toArray()
  res.send(result);
  return result;
  } catch(err){
  throw err;
  }
})

app.post('/api/update/client/username', async (req, res) => {
  try {
    let result = await clients.updateOne( { _id: ObjectId(req.body._id)},
    {$set: {username: req.body.username}});
    res.send(result);
    } catch(err){
    throw err;
  }
});

app.post('/api/update/client/password', async (req, res) => {
  try {
    let result = await clients.updateOne( { _id: ObjectId(req.body._id)},{$set: {password: req.body.password}});
    res.send(result);
    } catch(err){
    throw err;
  }
});

app.post('/api/delete/client', async (req, res) => {
  try{
    let result = await clients.deleteOne( { _id: ObjectId(req.body._id)} );
    res.send(result);
  } catch(err){
    throw err;
  }
});

app.post('/api/signup/client', async (req, res) => {
  try {
    let result = await clients.insertOne({
      brandname: req.body.brandname,
      username: req.body.username, 
      password: req.body.password, 
      time: Date()
    });
  res.send(result);
  } catch(err){
  throw err;
  }
});

app.get('/api/get/questions', async (req, res) => {
  try {
    let token = req.headers.token;
    let user  = jwt.decode(token, 'secret');
    let result   = await clients.findOne({_id: ObjectId(user._id)});
    res.send(result);
    return result;
    } catch(err){
    throw err;
  }
});

app.post('/api/update/questions', async (req, res) => {
  try {
    if(req.headers['token']){
      let token   = req.headers['token'];
      let decoded = await jwt.decode(token,'secret');
      if(req.body._id) delete req.body._id;
      let edited  = await clients.updateOne({_id: ObjectId(decoded._id)}, {
        $set: {
          ...req.body
        }
      });
      res.send({edited})
    } else {
      res.status(403).send('Permission forbidden') 
    }
  } catch (err) {
    res.status(500).send('Damn man, smth goes wrong') 
    throw err;
  }
});

app.post('/api/upload/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if(req.headers['token']){
      let token   = req.headers['token'];
      let decoded = await jwt.decode(token,'secret');
      if(!req.file) {
        res.send('Nothing changed')
        return;
      };
      let form = JSON.parse(req.body.form);
      form.employees[form.index].img = req.file.filename;
      let edited  = await clients.updateOne({_id: ObjectId(decoded._id)}, {
        $set: {
          employees: form.employees
        }
      });
      res.send({edited: edited, filename: req.file.filename});
    } else {
      res.status(403).send('Permission forbidden') 
    }
  } catch (err) {
    res.status(500).send('Damn man, smth goes wrong') 
    throw err;
  }
});



app.post('/api/post/answers', upload.single('picture'), async (req, res) => {
  try {
    if(req.headers['token']){
    let form = JSON.parse(req.body.form);
    let token     = req.headers.token;
    let decoded   = await jwt.verify(token,'secret');
    let client    = await clients.findOne({_id: ObjectId(decoded._id)})
    let recievers = await bot_users.find({ $or: [{clients: client._id}, {client_id: client._id}] }).toArray();
    let pic  = null;
    if(req.file) pic = req.file.filename;
    let result    = await answers.insertOne({
      client: decoded._id,
      client_name: decoded.username,
      answers: form.answers,
      time: new Date().getTime(),
      picture: pic,
    });
    console.log(pic)
    let text = '';
    for(let i=0;i<form.answers.length;i++){
      let answer = form.answers[i];
      if(typeof form.answers[i] === 'object') {
        answer = form.answers[i].answer
        let reasons = form.answers[i].reasons
        if(answer === 'Like'){
          text = text + `Поздравляем!✅ Вашему заведению поставилики Like\n`;
        } else if(answer === 'Dislike') {
          text = text + `Внимание!❌ Вашему заведению поставили Dislike\n Причина: \n`;
          for (let i = 0; i < reasons.length; i++) {
            if(reasons[i]) text = text + ` - ${reasons[i].text}\n`
          }
          if(form.answers[i].employee) text = text + `Сотрудник - ${form.answers[i].employee}`
        } else {
          text = text + `❌ Вашему заведению поставили ${answer}\n Причины: \n`;
          for (let i = 0; i < reasons.length; i++) {
            if(reasons[i]) text = text + ` - ${reasons[i].text}\n`
          }
          if(form.answers[i].employee) text = text + `Сотрудник - ${form.answers[i].employee}\n`
        }
      }
      else text = text+`${form.questions[i].bot_text} - ${answer}\n`;
    }
    for(let i=0;i<recievers.length;i++){
      bot.sendMessage(recievers[i].chat_id, client.username+'\n\n'+text)
      if(client.camera){
        bot.sendPhoto(recievers[i].chat_id,'http://revizor.space/avatars/'+req.file.filename);
      }
    }
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

app.listen(port, () => {
  console.log(port);
});