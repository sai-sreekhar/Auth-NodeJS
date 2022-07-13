const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/',verify, (req,res) => {
    // res.json({
    //     posts: {
    //         title: 'My First Post',
    //         description: 'Randoms posts shouldn\'t be accessed without being logged in'
    //         }
    //     })
    res.send(req.user)
})


module.exports = router;
