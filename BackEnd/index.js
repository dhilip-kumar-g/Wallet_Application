const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries.js')
const cors = require("cors")
const port = 3000
   


app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended: true,}))
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })

app.post('/notes',db.insertNotes)  
app.get('/notes',db.getNotes) 
app.put('/notes',db.updateNote)
app.delete('/notes',db.deleteNote)
app.get('/notes/:id',db.cache,db.getByNote)
 