const Pool = require('pg').Pool
const redis = require("redis")
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

        const queryStr = `SELECT * FROM Wallet` 
        pool.query(queryStr, (error, results) => {
        if (error) {
          throw error
        }
     
        response.status(200).json(results.rows)
    })
  }
const getByNote = async (request,response,next)=>{

    try{

      console.log('Fetching data...')
      const note = request.params.id
      console.log(note)
      const queryStr = `SELECT note,amount,date FROM WALLET WHERE note='${note}'`
      pool.query(queryStr,(error,result)=>{
      if(error)
        throw error

        let data = result.rows
        console.log(data[0].amount)
        data = data.map(d => JSON.stringify(d))
        redisClient.setEx(note,1000,data,function(err,reply){
          if(err)
            throw err

          console.log("hi")
        })
   
      response.status(200).json(result.rows)
     
  })
  }
    catch{
      console.error(err)
      response.status(500)
    }
   
}
function cache(req,res,next){

 
    console.log("cache")
   
    const note = req.params.id
    console.log(note)
    redisClient.get(note,(err,data)=>{
  
    console.log("insidecache")
    if(err)
      throw err;
    }).then(resv =>{

   console.log("success")
   if(resv !== null)
    {
      res.send(resv)
    }
    else{
      next()
    }
 })

  
}
const insertNotes = (request,response) => {
  
  const note = request.body.note 
  const amount = request.body.amount

  console.log(note,amount)
  const queryStr = `INSERT INTO Wallet(note,amount,date) VALUES('${note}',${amount},to_timestamp(${Date.now()} / 1000.0))`
  pool.query(queryStr,(err,result)=>{
    if(err)
      throw err;
    response.status(200).send('Note added')
  })
}
const updateNote = (request, response) => {
  
  const { note, amount } = request.body
  
  pool.query('UPDATE Wallet SET amount = $1 WHERE note = $2',[amount,note],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Updated`)
    }
  )
}
const deleteNote = (request, response) => {
  
  const note = request.body.note
  pool.query('DELETE FROM Wallet WHERE note = $1', [note], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Note deleted`)
  })
}
  module.exports={
      getNotes,
      getByNote,
      insertNotes,
      updateNote,
      deleteNote,
      cache
  }