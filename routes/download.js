const router = require('express').Router();
const File = require('../models/file');
const { route } = require('./files');

router.get('/:uuid', async (req,res)=> {
    const file = await File.findOne({uuid: req.params.uuid});
    if(!file){
        return res.render('newdownload', {error: 'Link has been expired'});
    }

    const filePath = `${__dirname}/../${file.path}`;   //obtaining the filePath
    res.download(filePath);  // downloading the file
});

module.exports = router;