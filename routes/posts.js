const express = require('express');
const router = express.Router({mergeParams: true});
const auth = require('./helpers/auth');
const Room = require('../models/room');
const Post = require('../models/post');
const commentsRouter = require('./comments');

// Posts new
router.get('/new', auth.requireLogin, (req, res, next) => {
    Room.findById(req.params.roomId, (err, room) => {
        if(err) {
            console.error(err);    
        }
        res.render('posts/new', { room: room });
    });
});

// Posts create
router.post('/', auth.requireLogin, (req, res, next) => {
    Room.findById(req.params.roomId, (err, room) => {
        if(err) {
            console.error(err)    
        }
        
        let post = new Post(req.body);
        post.room = room;
        
        post.save((err, room) => {
            if(err) {
                console.log(err);
            }
            return res.redirect(`/rooms/${room._id}`);
        });
    });
});

// Posts update
router.post('/:id', auth.requireLogin, (req, res, next) => {
    Post.findById(req.params.id, (err, post) => {
        post.points += parseInt(req.body.points);

        post.save((err, post) => {
            if(err) {
                console.error(err);
            }

            return res.redirect(`/rooms/${post.room}`);
        });
    });
});




// Nest the routes to comments
router.use('/:postId/comments', commentsRouter);

module.exports = router;