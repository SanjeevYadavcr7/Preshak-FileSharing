const router = require('express').Router();

router.get('/', (req,res) => {
    return res.render('howWorks');
})


module.exports = router;
