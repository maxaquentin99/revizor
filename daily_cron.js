let mongo = require('./data')
let cron  = require('node-cron');
const Telegram   = require('telegraf/telegram')
const tg_token   = '998789488:AAHPSeHvgNktSIWNaTEXamzTYSk3-PlZOjc';
let bot_options  = {
    agent: null,
    webhookReply: true
  }
let bot = new Telegram(tg_token, bot_options);

let sendDailyData = async () => {
    try {
        let connection = await new mongo();
        let dbase     = await connection.db('revizor');
        let clients     = dbase.collection('clients');
        let answers   = dbase.collection('answers');
        let bot_users = dbase.collection('bot_users');
        
        let all_users = await clients.findOne({username: "revizor"});
        console.log(all_users);
        let recievers = await bot_users.find({client_id: all_users._id}).toArray();
        
        let start_day   = new Date().setHours(0,0,0,0)
        start_day = start_day + 24*60*60*1000;
        
        console.log(new Date(start_day));
        let end_day     = new Date().setHours(23,59,59,9999);
        start_day = start_day + 24*60*60*1000;
        // let day_answers = await answers.find({ $and: [
        //     // {client: all_users._id},
        //     {time: {$gte: start_day}},
        //     {time: {$lte: end_day}},
        // ]}).toArray();
        let day_answers = await answers.find({client: all_users._id}).toArray()
        
        let l = day_answers.length;
        
        // day_answers.forEach(day_answer => {
            //     day_answer.answers.forEach(a => {
                //         if(typeof a === 'object'){
                //         } 
                //     })
        // })
        console.log(JSON.stringify(day_answers))
        console.log(l);
        for(let i=0;i<recievers.length;i++){
            bot.sendMessage(recievers[i].chat_id, `N of answers: ${l}\n`+JSON.stringify(day_answers))
        }
    } catch (err) {
        throw err;
    }
}

// smile string
// smile_num int
// comment
// like

// Date 

// answers length


//  if(num_smile) Оценка за сервис - 4.5

// Причины:
// - Не отзывчивый персонал - 10
// - Время ожидания - 5
// - Качество - 5

// Проблема решилась (да) - 6
// Проблема решилась (нет) - 1
// Вероятность рекомендации - 4,7

// Комментарии:
// - Все было супер
// - Персонал грубый
// - долго ждали заказ
sendDailyData()
cron.schedule('10 * * * *', sendDailyData);