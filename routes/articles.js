const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Bring in Models
const Article = require('../models/article');
const User = require('../models/user.model');

let errors;

// Add Route
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('add_articles', { errors });
});

// Add POST Route
router.post(
  '/add',
  body('title', 'Title is required').notEmpty(),
  // body('author', 'Author is required').notEmpty(),
  body('body', 'Body is required').notEmpty(),

  (req, res) => {
    // Get Errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('add_articles', { errors: errors.array() });
    }

    let article = new Article({
      title: req.body.title,
      author: req.user._id,
      body: req.body.body,
    });

    article.save((err) => {
      if (err) {
        console.log(`Error: ` + err);
      } else {
        req.flash('success', 'Article Added');
        res.redirect('/');
      }
    });
  }
);

// Edit Single Article
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    if (article.author != req.user._id) {
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    if (err) {
      console.log(`Error: ` + err);
    } else {
      res.render('edit_article', { article });
    }
  });
});

// Update Submit
router.post('/edit/:id', (req, res) => {
  let article = {};

  article.title = req.body.title;
  article.author = req.user._id;
  article.body = req.body.body;

  let query = { _id: req.params.id };

  Article.updateOne(query, article, (err) => {
    if (err) {
      console.log(`Error: ` + err);
    } else {
      req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  });
});

// Delete Single Article
router.delete('/:id', (req, res) => {
  let query = { _id: req.params.id };

  Article.deleteOne(query, (err) => {
    if (err) {
      console.log(`Error: ` + err);
    }
  });
});

// Get Single Article
router.get('/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    User.findById(article.author, (err, user) => {
      res.render('article', { article, author: user.name });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
