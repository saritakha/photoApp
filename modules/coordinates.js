'use strict';

class Coordinates {
  constructor() {
    this.ExifImage = require('exif').ExifImage;
  }

  getCoordinates(image) {
    return new Promise((resolve, reject) => {
      new this.ExifImage({
        image: image
      }, (error, exifData) => {
        if (error) {
          reject('Error: ' + error.message);
        } else {
          if (exifData.gps.GPSLatitude) {
            resolve({
              lat: this.gpsToDecimal(exifData.gps.GPSLatitude,
                exifData.gps.GPSLatitudeRef),
              lng: this.gpsToDecimal(exifData.gps.GPSLongitude,
                exifData.gps.GPSLongitudeRef),
            });
          } else {
            resolve({  //set default value if image does not have coordinates
              lat: 40.748817,
              lng: -73.985428,
            })
          }
        }
      });
    });
  }

  // convert GPS coordinates to GoogleMaps format
  gpsToDecimal(gpsData, hem) {
    let d = parseFloat(gpsData[0]) + parseFloat(gpsData[1] / 60) +
      parseFloat(gpsData[2] / 3600);
    return (hem === 'S' || hem === 'W') ? d *= -1 : d;
  };
}

module.exports = new Coordinates();