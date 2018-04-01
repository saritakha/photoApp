const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const ExifImage = require('exif').ExifImage;
const multer = require('multer');

//init app
const app = express();

//use index.html 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/modules', express.static('node_modules'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: false
// }));

//connect to mongodb
//////////////////////////////////////////////////////////////////
mongoose.connect('mongodb://localhost/photoApp').then((data) => {
    app.listen(3000, () => {
        console.log('server connected');
    });
}, err => {
    console.log('Connection to db failed: ' + err);
});

//connect to mongodb
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
    thumbnail: String,
    image: String,
    original: String
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

// / EXIF 
//////////////////////////////////////////////////////////////////
const getCoordinates = (path_to_image) => {
    return new Promise((resolve, reject) => {
        new ExifImage({
            image: path_to_image
        }, (error, exifData) => {
            if (error) {
                reject('Error: ' + error.message);
            } else {
                resolve({
                    lat: gpsToDecimal(exifData.gps.GPSLatitude,
                        exifData.gps.GPSLatitudeRef),
                    lng: gpsToDecimal(exifData.gps.GPSLongitude,
                        exifData.gps.GPSLongitudeRef),
                });
            }
        });
    });
}

// convert GPS coordinates to GoogleMaps format
const gpsToDecimal = (gpsData, hem) => {
    let d = parseFloat(gpsData[0]) + parseFloat(gpsData[1] / 60) +
        parseFloat(gpsData[2] / 3600);
    return (hem === 'S' || hem === 'W') ? d *= -1 : d;
};

// usage
getCoordinates('image.jpg').then(resp => {
    console.log(resp);
});

//post to form
//////////////////////////////////////////////////////////////////
app.post("/addform", (req, res) => {

    const myData = new catModel({
        time: Date.now(),
        title: req.body.title,
        category: req.body.category,
        details: req.body.description,
        coordinates: getCoordinates(req.file.path),
        thumbnail: String,
        image: req.body.original,
        original: String
    });
    myData.save();
})

//////////////////////////////////////////////////////////////////
app.get('/api', (req, res) => {
    catModel.find({}, (err, data) => {
        res.json(data);
    })
})