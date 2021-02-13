const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
const User = require('../models/user.model');

let errors, user;

// Register Form
router.get('/register', (req, res) => {
  res.render('register', { errors });
});

// Register Process
router.post(
  '/register',

  check('name', 'Name is required').notEmpty(),
  check('email', 'Email is required').notEmpty(),
  check('email', 'Email is not valid').isEmail(),
  check('username', 'Username is required').notEmpty(),
  check('password', 'Password is required').notEmpty(),
  check('password2').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),

  (req, res) => {
    // Get Errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('register', { errors: errors.array(), user });
    }

    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          console.log(err);
        }
        newUser.password = hash;

        newUser.save((err) => {
          if (err) {
            console.log(`Error: ` + err);
          }
          req.flash('success', 'You are now registered and can login.');
          res.redirect('/users/login');
        });
      });
    });
  }
);

// Login Form
router.get('/login', (req, res) => {
  res.render('login');
});

// Login Process
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
