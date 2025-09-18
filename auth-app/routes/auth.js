const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

//Register user
router.post('/register', async (req, res) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({username, email, password});
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch(err){
        console.error('Registration error:', err); 
        res.status(400).json({ error: err.message || String(err) });
    }
});

//Login user
router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({ error: 'Invalid passoword' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
             expiresIn: '1h' });

        res.json({ token });
    }
    catch(err){
        res.status(500).json({ error: 'Login failed' });
    }
});

//Protected route
router.get('/profile', authMiddleware, async (req, res) => {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
});

module.exports = router;
