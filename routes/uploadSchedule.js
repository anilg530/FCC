const express = require('express');
const router = express.Router();
const vision = require('../controllers/vision-controller');

router.get('/form', (req, res) => {
    res.render('uploadSchedule');
})

router.post('/save', (req, res) => {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');


    let sampleFile = req.files.sampleFile;
    vision.detect(sampleFile.data, req).then(()=>{
        console.log('2');
        res.redirect('confirm_schedule');
    });


});

module.exports = router;

    
    
    

