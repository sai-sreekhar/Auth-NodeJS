const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
        return res.status(400).send("Email Already Exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })

    try {
        const savedUser = await user.save();
        res.send({ user: savedUser._id });
    } catch (error) {
        res.status(400).send(error)
    }

})

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send("User Email Doesn't Exist");
    }

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) {
        return res.status(400).send("Password isn't Valid");
    }

    const token = jwt.sign({_id:user._id, email:user.email, password:user.password}, process.env.TOKEN_SECRET, {expiresIn: '24h'});
    res.header('auth-token',token).send(token);
})

module.exports = router;
