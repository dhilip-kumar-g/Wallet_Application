const cron = require("node-cron")
const db = require('./queries.js')
async function check(){
await axios.get('http://localhost:3000/balance')
    .then(response=> {
       var data = response.data
       for(let i=0;i<data.length;i++)
        {
            if(Number(data.balance) < 0)
            console.log(data.username)
        }
    })
    .catch(error=>console.log(error))
}
check()

/*
cron.schedule("*5 * * * * *",async function(){
    await axios.get('http://localhost:3000/balance')
    .then(response=> {
       var data = response.data
       for(let i=0;i<data.length;i++)
        {
            if(Number(data.balance) < 0)
            console.log(data.username)
        }
    })
    .catch(error=>console.log(error))


 
 })*/