const Telegraf         = require('telegraf')
const tg_token         = '998789488:AAHPSeHvgNktSIWNaTEXamzTYSk3-PlZOjc';
const DB               = require('./data');
const bot              = new Telegraf(tg_token)
const TelegrafFlow     = require('telegraf-flow')
const { Scene }        = TelegrafFlow
const flow             = new TelegrafFlow()
const session          = require('telegraf/session')
var db    = null;
var dbase = null;
var users = null;
var bot_users = null;

// needed middlewares
bot.use(async (ctx, next) => {
    db    = await new DB();
    dbase = await db.db('revizor');
    users = await dbase.collection('clients');
    bot_users = await dbase.collection('bot-users');
    next();
})
bot.use(session())
bot.use(flow.middleware())

// Scenes initiation
const login            = new Scene('login');
const password         = new Scene('password');
const start            = new Scene('start');


login.enter(ctx => {
    try { 
        ctx.reply('Введите свой логин: ')
    } catch (err){
        throw err;
    }
});

login.on('message', async ctx => {
    try {
        let client = await users.findOne({username: ctx.message.text});
        console.log(client)
        if(client) {
            ctx.flow.enter('password');
            ctx.session.state.user = client;
        }
        else ctx.reply('Извините, но такой логин не найден. Введите другой логин:')
    } catch (err){
        throw err;
    }
})


password.enter(ctx => {
    try { 
        ctx.reply('Введите пароль: ');
    } catch (err){
        throw err;
    }
});

password.on('message', async (ctx) => {
    try {
        let user = ctx.session.state.user;
        let msg  = ctx.message.text;
        if(user.password === msg) {
            let inserted = await bot_users.updateOne({chat_id: ctx.from.id}, {
                $set: {
                    logged_in: true,
                    client_id: user._id,
                    chat_id: ctx.from.id,
                }
            }, {upsert: true})
            ctx.reply('Супер! Вы теперь будете получать отзывы своих клиентов тут! ')
            console.log(inserted)
        } else {
            ctx.reply('Пароль неверный');
        }
    } catch (err){
        throw err;
    }
});

bot.start(async ctx => {
    // ctx.session.state = { user: {}}
    // let us = await bot_users.find().toArray();
    // ctx.reply(us);
    await ctx.reply('Hi! Пожалуйста, введите логин и пароль чтобы войти в свой аккаунт');
    ctx.flow.enter('login');
})



// SCENE register
flow.register(login);
flow.register(password);
flow.register(start);

bot.startPolling();
