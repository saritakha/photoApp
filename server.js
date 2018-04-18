'use strict';

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
const dbObject = require('mongodb').ObjectID;
const moment = require('moment');
const ejs = require('ejs');
const cookiesParser = require('cookies-parser');
const helmet = require('helmet');
const cors = require('cors');
const users = require('./routes/users');

//init app
const app = express();

//set view engine
//////////////////////////////////////////////////////////////////
app.set('view engine', 'ejs');

//middleware
app.use(helmet());

// app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(passport.initialize());
app.use(express.static('public'));
//Parse aplication/json
app.use(bodyParser.json());
app.use('/users', users);

//tls/ssl certificate/key for https
const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');

const options = {
    key: sslkey,
    cert: sslcert
};

//listen port 3000
//////////////////////////////////////////////////////////////////
https.createServer(options, app).listen(3000);

// //redirect server to https
//////////////////////////////////////////////////////////////////
http.createServer((req, res) => {
    res.writeHead(301, {
        'Location': 'https://localhost:3000' + req.url
    });
    res.end();
}).listen(8080);

//authentication
////////////////////////////////////////////////////////////////
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
//Username and Password in .env
passport.use(new LocalStrategy(
    (username, password, done) => {
        if (username !== process.env.DB_USR || password !== process.env.DB_PWD) {
            done(null, false, {
                message: 'Incorrect credentials.'
            });
            return;
        }
        return done(null, {});
    }
));

//login route
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        session: false
    })
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

//connect mongodb
//////////////////////////////////////////////////////////////////
database.connectDB(`mongodb://${process.env.DB_USR}:${process.env.DB_PWD}@${process.env.DB_HOST}/photoApp`, app);

//database schema
//////////////////////////////////////////////////////////////////
const photoSchema = {
    time: String,
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

//set route for accesing data
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/form', (req, res) => {
    res.render('form');
})

app.get('/update/:id', (req, res) => {
     res.render('updates');  
});

//upload for the photo
//////////////////////////////////////////////////////////////////
const upload = multer({
    dest: 'public/uploads'
});

app.post('/add', cors(), upload.single('imageupload'), function (req, res, next) {
    req.body.original = '/uploads/' + req.file.filename;
    next();
})

// get coordinates from EXIF
app.post('/add', cors(), (req, res, next) => {
    coordinates.getCoordinates(req.file.path).then(coords => {
        req.body.coordinates = coords;
        console.log(req.body.coordinates);
        next();
    });
});

//post to form
//////////////////////////////////////////////////////////////////
app.post("/add", cors(), (req, res) => {
    console.log(req.file.path);
    const myData = new Model({
        time: moment(Date.now()).format('LLLL'),
        title: req.body.title,
        category: req.body.category,
        image: req.body.original,
        coordinates: req.body.coordinates
    });
    console.log(myData);
    myData.save();
    res.redirect('/');
})

// Post request from the form 
app.post('/edit', upload.single('imageupload'), (req, res, next) => {
req.body.original = '/uploads/' + req.file.filename;

coordinates.getCoordinates(req.file.path).then(coords => {
    req.body.coordinates = coords;
    console.log(req.body.coordinates);
    next();
});
        Model.findOneAndUpdate({
                _id: req.body.id
            }, {
                $set: {
                    image:req.body.original,
                    title: req.body.title,
                    category: req.body.category,
                    time: moment(Date.now()).format('LLLL')
                }
            },
            (err, photo) => {
                if(err) console.log(err);
                photo.save();
                res.redirect('/');
            }
        )   
})


// app.post('/edit', cors(), upload.single('imageupload'), function (req, res, next) {
//     req.body.original = '/uploads/' + req.file.filename;
//     next();
// })

// // get coordinates from EXIF
// app.post('/edit', cors(), (req, res, next) => {
//     coordinates.getCoordinates(req.file.path).then(coords => {
//         req.body.coordinates = coords;
//         console.log(req.body.coordinates);
//         next();
//     });
// });

// //post to form
// //////////////////////////////////////////////////////////////////
// app.post("/edit", cors(), (req, res) => {
//     console.log(req.body.id);
//     Model.findOneAndUpdate({
//                         _id: req.body.id
//                     }, {
//                         $set: {
//                             title: req.body.title,
//                             category: req.body.category,
//                             time: req.body.time
//                         }
//                     });
//     res.redirect('/');
// })

//delete
app.delete('/:id', function (req, res) {
    let id = req.params.id;
    Model.remove({_id: id}, (err) => {
      if(err)  console.log(err);
    });
    res.redirect('/');
});

//create api
//////////////////////////////////////////////////////////////////
app.get('/api', (req, res) => {
    Model.find({}, (err, data) => {
        res.json(data);
    })
})