const express = require('express')
const app = express()
const path = require('path')
//const router = express.Router();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname)+'/index.html')
})

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000/")
})