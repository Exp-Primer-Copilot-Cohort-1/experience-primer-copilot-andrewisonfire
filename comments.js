// create web server
var express = require('express');
var app = express();
// create server
var server = require('http').createServer(app);
// create socket server
var io = require('socket.io')(server);
// create database
var mongoose = require('mongoose');git add comments.js
mongoose.connect('mongodb://localhost:27017/chat', {useNewUrlParser: true, useUnifiedTopology: true});
// create model
var chatSchema = new mongoose.Schema({
    name: String,
    message: String,
    date: {type: Date, default: Date.now}
});
var Chat = mongoose.model('Message', chatSchema);

// create web server
app.use(express.static(__dirname + '/public'));
// create socket server
io.on('connection', function (socket) {
    console.log('a user connected');
    // get message
    Chat.find({}, function (err, docs) {
        if (err) throw err;
        socket.emit('load old msgs', docs);
    });
    // send message
    socket.on('send message', function (data) {
        var newMsg = new Chat({name: data.name, message: data.message});
        newMsg.save(function (err) {
            if (err) throw err;
            io.emit('new message', {name: data.name, message: data.message});
        });
    });
    // disconnect
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

server.listen(3000, function () {
    console.log('listening on *:3000');
});const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { response } = require('express');
const { request } = require('http');

// get all comments
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        res.json({ message: err });
    }
});

// get specific comment
router.get('/:commentId', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        res.json(comment);
    } catch (err) {
        res.json({ message: err });
    }
});

// submit a comment
router.post('/', async (req, res) => {
    const comment = new Comment({
        text: req.body.text,