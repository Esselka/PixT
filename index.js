const express = require('express')
const app = express()
const path = require('path')

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname) + '/index.html')
})

app.get('/app.js', (req, res) => {
    res.sendFile(path.join(__dirname) + '/app.js')
})

app.get('/infos_SC.js', (req, res) => {
    res.sendFile(path.join(__dirname) + '/infos_SC.js')
})

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname) + '/admin.html')
})

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname) + '/style.css')
})

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000/")
})