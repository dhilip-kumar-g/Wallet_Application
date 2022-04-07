const express = require('express')
const cron = require("node-cron")
const axios = require('axios')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries.js')
const cors = require("cors")
const email = require('./rabbitmq/Email')
const port = 3000

cron.schedule("*/20 * * * * * ",async function(){

  await axios.get('http://localhost:3000/balance')
  .then(response=> {
     var data = response.data
    var mailId=""
    // console.log(data[0].balance)
     for(let i=0;i<data.length;i++)
      {
        
       // console.log(data[i])
          if(parseInt(data[i].balance) <=50)
          {
              Notify(data[i])
          }
          //console.log(data[i].username)
      }
      
  })
  .catch(error=>console.log(error))

})
async function Notify(data){

  await axios.get(`http://localhost:3000/notes/${data.username}`)
              .then(response=>{
                 // console.log(response.data)
                  const obj = response.data.data;
                 // console.log(obj[0].email)
                  mailId = obj[0].email
                  //console.log(mailId)
                  email.sendEmail(mailId,"Your balance is below 100")
              })
              .catch(error=>console.log(error))

}




app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended: true,}))
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })

////cron.schedule("*/5 * * * * *",function(){

 // var data = db.getBalCron()
 //console.log(data)
 // for(let i=0;i<data.length;i++)
  {
   // if(Number(data[0][1]) < 0)
   // console.log("this"  + data.length)
  }

//})

app.post('/notes',db.insertNotes)  
app.get('/notes',db.getNotes) 
app.put('/notes',db.updateNote)
app.delete('/notes/:id',db.deleteNote)
app.get('/notes/:id',db.cache,db.getByNote)
app.get('/creditbalance',db.getCreditBal)
app.get('/debitbalance',db.getDebitBal)
app.get('/balance',db.getBal)
app.get('/balance/:id',db.getBalbyId)
app.put('/balance',db.putBalance)