const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT = "crackItMofo";

// create a user
router.post('/createUser', body('name').isLength({ min: 5 }), body('email').isEmail(), body('password').isLength({ min: 8 }), body('email').custom(async value => {
    const user = await User.findOne({ email: value });
    if (user) {
        throw new Error('E-mail already in use');
    }
}), async (req, res) => {
    const result = validationResult(req);
    let success = false;
    if (result.isEmpty()) {
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        req.body.password = secPass;
        const user = User(req.body);
        user.save();
        const data = {
            user:{
                id: user.id
            }
        };
        const authtoken = jwt.sign(data, JWT);
        success = true;
        return res.send({success, authtoken});
    }
    res.status(409).json({success, errors: result.array() });
})

//user login authentication
router.post('/login', body('email').isEmail(), body('password').exists(), body('email').custom(async (value, {req}) => {
    const user = await User.findOne({ email: value });
    if (!user) {
        throw new Error('please try to login with correct credentials');
    }
    const passwordCompare = await bcrypt.compare(req.body.password, user.password);
        if(!passwordCompare){
            throw new Error('please try to login with correct credentials');
        }
}), async (req, res) => {
    const result = validationResult(req);
    let success = false;
    if (result.isEmpty()) {
        const user = await User.findOne({email: req.body.email});
        const data = {
            user:{
                id: user.id
            }
        };
        const authtoken = jwt.sign(data, JWT);
        success = true;
        return res.send({success, authtoken});
    }
    res.status(409).json({success, errors: result.array() });
})

//getting user details
router.post('/getUser', fetchuser, async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    res.send(user);
})

module.exports = router