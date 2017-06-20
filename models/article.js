// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true, 
    unique: true
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  created: {
    type: Date, 
    default: Date.now
  },
  saved: {
    type: Boolean,
    default: false
  },
  new: {
    type: Boolean,
    default: true
  },
  // notes property for the user
  notes: [{
    // Store ObjectIds in the array
    type: Schema.Types.ObjectId,
    // The ObjectIds will refer to the ids in the Note model
    ref: "Note"
  }]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;