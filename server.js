// Required Dependencies
const express = require('express');
const path = require('path');
const { uid } = require('uid');
const fs = require('fs')
let notes = require('./db/db.json')


// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Setup data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('/api/notes', function (req, res) {
    res.json(notes);
});



app.post('/api/notes', function (req, res) {
    let newNote = {title: req.body.title, text: req.body.text, id: uid()}
    notes.push(newNote);
    const createNote = JSON.stringify(notes)
    fs.writeFile(path.join(__dirname, 'db', 'db.json'), createNote, err => {
        if (err) { console.log(err) }
        res.json(newNote)
    });
});
 
app.delete('/api/notes/:id', function (req, res) {
    notes = notes.filter(val => val.id !== req.params.id)
    const deleteNote = JSON.stringify(notes)
    fs.writeFile(path.join(__dirname, 'db', 'db.json'), deleteNote, err => {
        if (err) { console.log(err) }
        res.sendStatus(200);

    });
});

// Setup listener
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});