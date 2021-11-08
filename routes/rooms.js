const express = require('express');
const router = express.Router();
const auth = require('./helpers/auth');
const Room = require('../models/room');
const Post = require('../models/post');
const postsRouter = require('./posts');

// Rooms index
router.get('/', (req, res, next) => {
    Room.find({}, 'topic', (err, rooms) => {
        if(err) {
            console.error(err);
        } else {
            res.render('rooms/index', { rooms: rooms });
        }
    })
});

// Rooms new
router.get('/new', auth.requireLogin, (req, res, next) => {
    res.render('rooms/new');
});

// Rooms show
router.get('/:id', auth.requireLogin, (req, res, next) => {
    Room.findById(req.params.id, (err, room) => {
        if(err) {
            console.error(err);
        }
        
        // Show all comments that come with the posts by telling Mongoose to populate the query
        Post.find({ room: room }).sort({ points: -1 }).populate('comments').exec((err, posts) => {
            if(err) {
                console.error(err);
            }
            
            res.render('rooms/show', { room: room, posts: posts, roomId: req.params.id });
        });
    });
});

// Rooms edit
router.get('/:id/edit', auth.requireLogin, (req, res, next) => {
    Room.findById(req.params.id, (err, room) => {
        if(err) {
            console.error(err);
        }
        res.render('rooms/edit', { room: room });
    });
});

// Rooms update
router.post('/:id', auth.requireLogin, (req, res, next) => {
    Room.findByIdAndUpdate(req.params.id, req.body, (err, room) => {
        if(err) {
            console.error(err);
        }
        res.redirect('/rooms/' + req.params.id);
    });
});

// Rooms create
router.post('/', auth.requireLogin, (req, res, next) => {
    let room = new Room(req.body);

    room.save((err, room) => {
        if(err) {
            console.log(err);
        }

        return res.redirect('/rooms');
    })
});

// Nest the routes to posts
router.use('/:roomId/posts', postsRouter);

module.exports = router;