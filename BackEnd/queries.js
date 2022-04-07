#!/usr/bin/env node
const Pool = require('pg').Pool
const redis = require("redis")
const amqp = require("./rabbitmq/send.js");

const redisClient = redis.createClient()
redisClient.on('connect', () => console.log('Connected to Redis!'))
redisClient.on('error', (err) => console.log('Redis Client Error', err))
redisClient.connect()


const pool = new Pool({
  user: 'ecom-dhilip.g',
  host: 'localhost',
  database: 'firstproject',
  password: '',
  port: 5432,
})

const getNotes = (request, response) =>  {
        //console.log("called")
        const queryStr = `SELECT * FROM Wallet` 
        pool.query(queryStr, (error, results) => {
        if (error) {
          throw error
        }
      //  console.log(results.rows)
        response.status(200).json(results.rows)
       // console.log(results.rows)
       // return results.rows
    })
  }
  const getCreditBal = (request, response) =>  {

    const queryStr = `SELECT * FROM creditBalance order by username` 
    pool.query(queryStr, (error, results) => {
    if (error) {
      throw error
    }
 
    response.status(200).json(results.rows)
    })
  }
  const getDebitBal = (request, response) =>  {

    const queryStr = `SELECT * FROM debitBalance order by username` 
    pool.query(queryStr, (error, results) => {
    if (error) {
      throw error
    }
 
    response.status(200).json(results.rows)
    })
  }
  const getBal = (request, response) =>  {

    const queryStr = `SELECT * FROM balance` 
    pool.query(queryStr, (error, results) => {
    if (error) {
      throw error
    }
 
    response.status(200).json(results.rows)
    })
  }
 /* async function getBalCron(){

      console.log("called")
    const queryStr = `SELECT * FROM balance` 
    pool.query(queryStr, (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows)
   // return results.rows
    })
  }*/
  const getBalbyId = (request, response) =>  {

    const id = request.params.id
  
   // console.log("JS",request.params)
    const queryStr = `SELECT * FROM balance where username='${id}'` 
    pool.query(queryStr, (error, results) => {
    if (error) {
      throw error
    }
   // console.log(results.rows)
    
    response.status(200).json(results.rows)
    })
  }
  const putBalance = (request, response) => {
  
    const id = request.body.balance
    pool.query('UPDATE balance SET bal = $1',[id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`Updated`)
      }
    )
  }
const getByNote = async (request,response,next)=>{

    try{

      console.log('Fetching data...from postgresql database...')
      const user = request.params.id
     // console.log(user)
      const queryStr = `SELECT * FROM Wallet WHERE username='${user}'`
      pool.query(queryStr,(error,result)=>{
      if(error)
        throw error

        let data = result.rows
      //  console.log(data);
       // console.log(data[0].amount)
        // data = data.map(d => JSON.stringify(d))
        let cacheData = JSON.stringify(data);
        //console.log(data);
        //console.log("data is "+data)
        redisClient.setEx(user,1000,cacheData,function(err,reply){
          if(err)
            throw err

         // console.log("hi")
        })
   
      response.status(200).send({data:data})
     
  })
  }
    catch{
      console.error(err)
      response.status(500)
    }
   
}
function cache(req,res,next){

 
   // console.log("cache")
   
    const user = req.params.id
   // console.log(user)
    redisClient.get(user,(err,data)=>{
  
//    console.log("insidecache")
    if(err)
      throw err;
    }).then(resv =>{

  // console.log("success")
   if(resv !== null)
    {
      console.log("Fetching data from redis cache...")
    //  console.log(resv)
      res.send({data: JSON.parse(resv)})
    }
    else{
      next()
    }
 })

  
}
const insertNotes = (request,response) => {
  
  const note = request.body.note 
  var amount = request.body.amount
  var user = request.body.user
  var action = request.body.action
  var email = request.body.email
  const date = Date.now()
  const mailId = email
  var msg=""
 // console.log(request.body)
  let queryStr = `SELECT * FROM balance where username='${user}'` 
    pool.query(queryStr, (error, results) => {
    if (error) {
      throw error
    }
  //  console.log(results)
    if(action == "debit" && parseInt(results.rows[0].balance)-parseInt(amount) <=0){
    //console.log(results.rows[0].balance)
    response.status(400).send({msg:"insufficent balance"})
    
    
    }
    else{

      queryStr = `INSERT INTO Wallet(note,amount,date,username,action,email) VALUES('${note}',${amount}, to_timestamp(${date} / 1000),'${user}','${action}','${email}')`
      pool.query(queryStr,(err,result)=>{
        if(err)
          throw err;
        msg=`Amount ${amount} is ${action}ed to ${user}`
       // console.log(msg)
        var data = `${mailId},${msg}`
        amqp.sendToQueue(data);
        response.status(200).json({msg: 'Note added', data: {note: note, amount: amount, date: new Date(date),username:user,action:action,email:email}})
      })
    }
    })
  }
const updateNote = (request, response) => {
  
  console.log(request.body)
//  const { id,note, amount } = request.body
  const id = request.body.sl_no
  const note = request.body.note
  const amount = request.body.amount
  
 // console.log(id,note,amount)
  pool.query('UPDATE Wallet SET amount = $1,note=$2 WHERE sl_no = $3',[amount,note,id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Updated`)
    }
  )
}
const deleteNote = (request, response) => {
  
 // console.log(request.body)
  const sl_no = request.params.id
  /*if(isNaN(sl_no))
  {
    response.status(400).send(`Record not found`)
    return
  }*/
  console.log(sl_no)
  pool.query('DELETE FROM Wallet WHERE sl_no = $1', [sl_no], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Note deleted`)
  })
}
  module.exports={
      getCreditBal,
      getDebitBal,
      getBal,
     // getBalCron,
      getBalbyId,
      putBalance,
      getNotes,
      getByNote,
      insertNotes,
      updateNote,
      deleteNote,
      cache
  }