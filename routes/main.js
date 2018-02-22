const express = require('express');
const router = express.Router();
///auth
const checkAuth = require('../config/auth');
const Notes = require('../models/Notes');




//main route index
router.get('/', (req, res) => {
    if (!(req.user)) {
        res.render('index/welcome');
    } else {
        Notes.find({ user: req.user.id }).populate('user').sort({ date: -1 }).exec(function(err, data) {
            if (err) {
                console.log(err);
            } else {
                // console.log(data);
                res.render('index/dashboard', { data: data })
            }
        })
    }
});



///dashboard
router.get('/dashboard', checkAuth, (req, res) => {
    // check if user is present:)
    ///check the notes submitted by user
    // console.log(req.user.id);
    Notes.find({ user: req.user.id }).populate('user').sort({ date: -1 }).exec(function(err, data) {
        if (err) {
            console.log(err);
        } else {
            // console.log(data);
            res.render('index/dashboard', { data: data })
        }
    })
});

///about page
router.get('/about', (req, res) => {
    res.render('index/about');
})






module.exports = router;