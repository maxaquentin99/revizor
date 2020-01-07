const telegraph = require('telegraph-node')
const ph = new telegraph()

let token = '931f5889edbaa2fcb033df6af5ffafc5c4b0638fbe8e9c511a53e27571ae';
// ph.createAccount().then((result) => {
//     console.log(result)
// })

ph.createPage(token, 'First CSpace post', [{tag: 'h1', children: ['Cspace post for feedbacks']}], {
    return_content: true
}).then((result) => {
    console.log(result)
})