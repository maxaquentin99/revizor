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
        
        let sd   = new Date(new Date().setHours(0,0,0,0));
        let start_day = new Date("2015-03-25T12:00:00-06:00").toString();
        let d   = new Date(new Date().setHours(0,0,0,0)).getDate();
        console.log(start_day);
        let end_day     = new Date().setHours(23,59,59,9999);
        let day_answers = await answers.find({ $and: [
            {client: all_users._id},
            {time: {$gte: start_day}},
            {time: {$lte: end_day}},
        ]}).toArray();
        
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
// cron.schedule('* * * * *', sendDailyData);