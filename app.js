const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const multer = require('multer')

const session = require('express-session');
const passport = require('passport');

// Getting user model
require('./models/User');

// Passport Configuration
require('./config/passport')(passport);

// Getting routes
const auth = require('./routes/auth');
const mainRoute = require('./routes/main');
const notesRoute = require('./routes/notes');
var upload = multer({ dest: __dirname + '/uploads' })

// Getting keys
const keys = require('./config/keys');
const formatDate = require('./helpers/moment');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect(keys.mongoURI, {
        useMongoClient: true
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const app = express();



//setting up views
app.engine('handlebars', exphbs({
    helpers: {
        formatDate: formatDate
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use('/favicon.ico', express.static('public/images/favicon.ico'));
///serve static files
app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Use Routes
app.use('/', mainRoute);
app.use('/auth', auth);
app.use('/notes', notesRoute);



const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});