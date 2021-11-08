const express = require('express');
const router = express.Router({mergeParams: true});
const auth = require('./helpers/auth');
const Room = require('../models/room');
const Post = require('../models/post');
const Comment = require('../models/comment');

// Comments new
router.get('/new', auth.requireLogin, (req, res, next) => {
    Room.findById(req.params.roomId, (err, room) => {
        if(err) {
            console.error(err);    
        }

        Post.findById(req.params.postId, (err, post) => {
            if(err) {
                console.error(err);   
            }
            
            res.render('comments/new', { post: post, room: room });
        })
    });
});

// Comments create
router.post('/', auth.requireLogin, (req, res, next) => {
    Room.findById(req.params.roomId, (err, room) => {
        if(err) {
            console.error(err);
        }

        Post.findById(req.params.postId, (err, room) => {
            if(err) {
                console.error(err);
            }  
            
            let comment = new Comment(req.body);
            post.comments.unshift(comment);

            post.save((err, post) => {
                if(err) {
                    console.log(err);
                }

                comment.save((err, comment) => {
                    if(err) {
                        console.log(err);
                    }
                    
                    return res.redirect(`/rooms/${room.id}`);
                });
            });
        });
    });
});

module.exports = router;