const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Create a User using : POST "/api/auth/". Doesn't require Auth
router.post(
    '/',
    [
        body('email', 'Enter a valid email').isEmail(),
        body('name', 'Enter a valid name').isLength({ min: 3 }),
        body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    ],
    async (req, res) => {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Create a new user
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });
            res.json(user);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);

module.exports = router;
