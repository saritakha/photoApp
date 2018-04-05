const express = require('express');
const path = require('path');
const multer = require('multer');
const coordinates = require('./modules/coordinates');
const database = require('./modules/database');
const https = require('https');
const fs = require('fs');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//tls/ssl certificate/key for https
const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');

const options = {
    key: sslkey,
    cert: sslcert
};

//init app
const app = express();

//listen port 3000
//////////////////////////////////////////////////////////////////
https.createServer(options, app).listen(3000);

// //redirect server to https
//////////////////////////////////////////////////////////////////
http.createServer((req, res) => {
    res.writeHead(301, { 'Location': 'https://localhost:3000' + req.url });
    res.end();
}).listen(8080);

//authentication
//////////////////////////////////////////////////////////////////
// app.use((req, res, next) => {
//     if (req.query.token === 'SECRET_TOKEN_TOKEN') {
//         next();
//     }
//     else {
//         res.status(401).send('Please sign in.');
//     }
// });

//Passport 
//////////////////////////////////////////////////////////////////
require('dotenv').config();
app.use(bodyParser.urlencoded({extended: true}));

//Username and Password in .env
passport.use(new LocalStrategy(
    (username, password, done) => {
        if (username !== process.env.username || password !== process.env.password) {
            done(null, false, {message: 'Incorrect credentials.'});
            return;
        }
        return done(null, {});
    }
));
app.use(passport.initialize());

//login route
app.post('/login', 
  passport.authenticate('local', { 
    successRedirect: '/', 
    failureRedirect: '/login.html', 
    session: false })
);



// //for Jelastic
// app.enable('trust proxy');

// // Add a handler to inspect the req.secure flag (see 
// // http://expressjs.com/api#req.secure). This allows us 
// // to know whether the request was via http or https.
// app.use ((req, res, next) => {
//   if (req.secure) {
//     // request was via https, so do no special handling
//     next();
//   } else {
//     // request was via http, so redirect to https
//     res.redirect('https://' + req.headers.host + req.url);
//   }
// });

//use index.html 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/modules', express.static('node_modules'));

//connect mongodbs
// mongodb://sarita:sarita@localhost:27017/photoApp?authSource=photoApp
//////////////////////////////////////////////////////////////////
database.connectDB('mongodb://sarita:sarita@localhost/photoApp', app);

//database schema
//////////////////////////////////////////////////////////////////
const photoSchema = {
    time: Date,
    category: String,
    title: String,
    coordinates: {
        lat: Number,
        lng: Number,
    },
    image: String
};

// databasemodel
const Model = database.getSchema(photoSchema, 'photoModel');

//upload for the photo
//////////////////////////////////////////////////////////////////
const upload = multer({
    dest: 'public/uploads'
});

app.post('/addform', upload.single('imageupload'), function (req, res, next) {
    req.body.original = '/uploads/' + req.file.filename;
    next();
})


// get coordinates from EXIF
app.post('/addform', (req, res, next) => {
    coordinates.getCoordinates(req.file.path).then(coords => {
        req.body.coordinates = coords;
        console.log(req.body.coordinates);
        next();
    });
});

//post to form
//////////////////////////////////////////////////////////////////
app.post("/addform", (req, res) => {
    console.log(req.file.path);
    const myData = new Model({
        time: Date.now(),
        title: req.body.title,
        category: req.body.category,
        image: req.body.original,
        coordinates: req.body.coordinates
    });
    console.log(myData);
    myData.save();
    res.redirect('/');
})

//create api
//////////////////////////////////////////////////////////////////
app.get('/api', (req, res) => {
    Model.find({}, (err, data) => {
        res.json(data);
    })
})