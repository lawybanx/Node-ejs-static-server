const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

//Export the model
module.exports = mongoose.model('Article', articleSchema);
