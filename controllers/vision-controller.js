var exports = module.exports = {};


const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
    keyFilename: './FirstClassConnect-service-account.json'
});

exports.detect = (image) => {
    client.textDetection(image).then((results) => {
        const detections = results[0].textAnnotations;

        console.log('Text:');
        detections.forEach(text => console.log(text));
    })

        .catch((err) => {
            console.log(err);
        });

}




