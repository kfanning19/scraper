// Requiring our Note and Article models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Set up Mongoose
var mongoose = require("mongoose");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Database configuration with mongoose
mongoose.connect(" mongodb://heroku_vbq5x4mc:5ttr0neh288ibk59j1e8dajvmr@ds149221.mlab.com:49221/heroku_vbq5x4mc");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});



module.exports = function(app) {
    app.get("/", function(req, res) {
        res.redirect("/articles")

    });
    // This will get the articles we scraped from the mongoDB
    app.get("/articles", function(req, res) {
        // Grab every doc in the Articles array
        Article.find({}).sort({ "created": -1 }).exec(function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Or send the doc to the browser as a json object
            else {
                res.render("home", { articles: doc });
            }
        });
    });
    app.get("/saved", function(req, res) {
        // Grab every doc in the Articles array
        Article.find({}).sort({ "created": -1 }).exec(function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Or send the doc to the browser as a json object
            else {
                res.render("saved", { articles: doc });
            }
        });
    });
    // A GET request to scrape the echojs website
    app.get("/scrape", function(req, res) {

        request("http://www.npr.org/sections/news/", function(error, response, html) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(html);
            // Now, we grab every h2 within an article tag, and do the following:
            $("h2.title").each(function(i, element) {

                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this).children("a").text();
                result.link = $(this).children("a").attr("href");
                result.summary = $(this).siblings("p").text();

                // Using our Article model, create a new entry
                // This effectively passes the result object to the entry (and the title and link)
                var entry = new Article(result);

                // Now, save that entry to the db
                entry.save(function(err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    }
                    // Or log the doc
                    else {
                        console.log(doc);
                    }
                });

            });
            res.send("Scrape Complete")
        });
        // Tell the browser that we finished scraping the text

    });



    // Grab an article by it's ObjectId
    app.get("/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        Article.findOne({ "_id": req.params.id })
            // ..and populate all of the notes associated with it
            .populate("notes")
            // now, execute our query
            .exec(function(error, doc) {
                // Log any errors
                if (error) {
                    console.log(error);
                }
                // Otherwise, send the doc to the browser as a json object
                else {
                    res.json(doc);
                }
            });
    });
    app.post("/save/article/:id", function(req, res) {
        Article.findOneAndUpdate({ "_id": req.params.id }, { $set: { "saved": true } })
            .exec(function(err, doc) {
                if (err) {
                    console.log(err)
                } else {
                    res.send(doc);
                }
            })
    });
    app.post("/unsave/article/:id", function(req, res) {
        Article.findOneAndUpdate({ "_id": req.params.id }, { $set: { "saved": false } })
            .exec(function(err, doc) {
                if (err) {
                    console.log(err)
                } else {
                    res.send(doc);
                }
            })
    });

    // Create a new note or replace an existing note
    app.post("/save/note/:id", function(req, res) {
        // Create a new note and pass the req.body to the entry
        var newNote = new Note(
            body: req.body.text,
            article: req.params.id);

        // And save the new note the db
        newNote.save(function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Otherwise
            else {
                // Use the article id to find and update it's note
                Article.findOneAndUpdate({ "_id": req.params.id }, { "notes": doc._id })
                    // Execute the above query
                    .exec(function(err, doc) {
                        // Log any errors
                        if (err) {
                            console.log(err);
                        } else {
                            // Or send the document to the browser
                            res.send(doc);
                        }
                    });
            }
        });
    });


    app.delete("/notes/:id", function(req, res) {
        Article.notes.remove({ "_id": req.params.id })
            .exec(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    res.send(doc);
                }
            })
    });
}
