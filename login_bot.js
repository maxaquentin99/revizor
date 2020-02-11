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
bot.use(session());
bot.use(flow.middleware());

// Scenes initiation
const login            = new Scene('login');
const password         = new Scene('password');
const start            = new Scene('start');

bot.command('login', (ctx) => {ctx.flow.enter('login')})
login.command('login', (ctx) => {ctx.flow.enter('login')})
password.command('login', (ctx) => {ctx.flow.enter('login')})

login.enter(ctx => {
    try { 
        ctx.reply('Введите логин заведения: ')
    } catch (err){
        throw err;
    }
});

login.on('message', async ctx => {
    try {
        let client = await users.findOne({username: ctx.message.text});
        console.log(client);
        if(client) {
            ctx.session.state = { user : client };
            ctx.flow.enter('password');
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
        if(!ctx.session.state) {
            ctx.flow.enter('login');
        }
        let user = ctx.session.state.user;
        let msg  = ctx.message.text;
        if(user.password === msg) {
            let b_user = await users.findOne({username: user.username});
            if(!b_user.clients) b_user.clients = [];
            b_user.clients.push(user._id);
            let inserted = await bot_users.updateOne({chat_id: ctx.from.id}, {
                $set: {
                    logged_in: true,
                    clients: b_user.clients,
                    client_id: user._id,
                    chat_id: ctx.from.id,
                }
            }, {upsert: true})
            ctx.reply('Супер! Вы теперь будете получать отзывы своих клиентов тут! ')
            ctx.flow.leave('password');
            console.log(inserted)
        } else {
            ctx.reply('Пароль неверный');
        }
    } catch (err){
        throw err;
    }
});

bot.start(async ctx => {
    await ctx.reply('Hi! Пожалуйста, введите логин и пароль чтобы войти в свой аккаунт');
    ctx.flow.enter('login');
})



// SCENE register
flow.register(login);
flow.register(password);
flow.register(start);

bot.startPolling();
