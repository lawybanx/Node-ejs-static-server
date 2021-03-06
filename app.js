const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// dotenv
dotenv.config({ path: './config/config.env' });

// Connect MongoDB at default port 27017.
connectDB();

// Express Init
const app = express();

// Bring in Models
const Article = require('./models/article');
// const User = require('./models/user.model');

// EJS
app.set('view engine', 'ejs');

// Body-parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
);

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Passport Config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Enable Global User Variable
app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Home Route
app.get('/', (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(`Error: ` + err);
    } else {
      res.render('index', { title: 'Articles', articles });
    }
  });
});

// Routes //
app.use('/users', require('./routes/users'));
app.use('/articles', require('./routes/articles'));

// Port
const PORT = process.env.PORT || 3000;

// Start Server
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
