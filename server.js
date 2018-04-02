const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const ExifImage = require('exif').ExifImage;
const multer = require('multer');
const coordinates = require('./coordinates');

//init app
const app = express();

//use index.html 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/modules', express.static('node_modules'));

//connect to mongodb
//////////////////////////////////////////////////////////////////
mongoose.connect('mongodb://localhost/photoApp').then((data) => {
    app.listen(3000, () => {
        console.log('server connected');
    });
}, err => {
    console.log('Connection to db failed: ' + err);
});

//database schema
//////////////////////////////////////////////////////////////////
const Schema = mongoose.Schema;
const catSchema = new Schema({
    time: Date,
    title: String,
    category: String,
    details: String,
    coordinates: {
        lat: Number,
        lng: Number,
    },
    image: String
})


//database model
//////////////////////////////////////////////////////////////////
const catModel = mongoose.model('catModel', catSchema);

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
app.use('/addform', (req, res, next) => {
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
    const myData = new catModel({
        time: Date.now(),
        title: req.body.title,
        category: req.body.category,
        details: req.body.details,
        image: req.body.original,
       });
       console.log(myData);
    myData.save();
})

//////////////////////////////////////////////////////////////////
app.get('/api', (req, res) => {
    catModel.find({}, (err, data) => {
        res.json(data);
    })
})