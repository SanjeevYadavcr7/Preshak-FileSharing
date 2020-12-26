const router = require('express').Router();

router.get('/', (req,res) => {
    return res.render('newhomePage');
})

module.exports = router;
