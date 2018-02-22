const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const checkAuth = require('../config/auth');

//load notes model
const Notes = require('../models/Notes');

//multer upload path



//multer storage
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +
            path.extname(file.originalname));

    }
})




const upload = multer({
    storage: storage,
    limits: { fileSize: 16000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('files')

//check file
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /pdf/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Please upload pdf file Bro');
    }
}



router.get('/', checkAuth, function(req, res) {
    Notes.find().populate('user').sort({ date: -1 }).exec(function(err, data) {
        if (err) {
            res.render('index', {
                msg: error
            })
        } else {
            // console.log(data);
            res.render('notes/index', { data: data });
        }
    })
})

///post form 

router.post('/', checkAuth, (req, res, next) => {

    upload(req, res, function(err) {
        if (err) {
            res.render('notes/upload', { msg: err })
        } else if (req.file == undefined) {
            res.render('notes/upload', { msg: 'Please upload a file' })
        } else {


            ///save into database
            const newNote = {

                semester: req.body.semester,
                subject: req.body.subject,
                branch: req.body.branch,
                unit: req.body.unit,
                description: req.body.description,
                filename: req.file.filename,
                path: req.file.path,
                user: req.user
            }
            new Notes(newNote)
                .save()
                .then(data => {
                    // console.log(data);
                    res.redirect('/')
                }).catch((error) => {
                    console.log(error);
                })

        }
    })

})

///Show notes route
router.get('/show/:id', checkAuth, (req, res) => {
    // console.log(req.params.id);
    Notes.findOne({ _id: req.params.id })
        .populate('user')
        .then(data => {
            console.log(data);
            res.render('notes/show', { data: data });
        })
})

///upload notes route p
router.get('/upload', checkAuth, (req, res) => {
    res.render('notes/upload');
})

module.exports = router;