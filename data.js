// const url ='mongodb+srv://Joki7777:@Roadtotheparadise7@revizor-eaqz8.mongodb.net/revizor?retryWrites=true&w=majority';
const url ="mongodb://localhost:27017";
var MongoClient = require('mongodb').MongoClient;
let connection = null;
class MongoConnect {
  constructor (){
    return new Promise(async (resolve, reject) =>  {
      if(connection == null){
        connection = await MongoClient.connect(url, { useNewUrlParser: true, autoReconnect:true, useUnifiedTopology: true })
        resolve(connection)
      } else {
        resolve(connection)
      }
    })
  }
}
module.exports = MongoConnect;

