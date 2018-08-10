var express = require("express");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();
// var router = express.Router();

app.use(logger("dev"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res) {
    axios.get("https://www.npr.org/sections/news/").then(function(response) {
        var $ = cheerio.load(response.data);
        $("div.item-info").each(function(i, element) {
            var result = {};
            
            result.title = $(this)
            .children("h2.title")
            .children("a")
            .text();
            result.summary = $(this)
            .children("p.teaser")
            .children("a")
            .text();
            result.link = $(this)
            .children("h2.title")
            .children("a")
            .attr("href");

            db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle);
            })
            .catch(function(err) {
                return res.json(err);
            });
            // db.Article.find({title: result.title})
            // .then(function(articleFound) {
            //     console.log(articleFound);
            //     console.log(result.title + " already exists.")
            //     result.found = true;
            //     if (result.found === true) {
            //     } else {
            //     };
            // });
        });
    });
    res.send("Scrape complete.")
});

app.get("/articles", function(req, res) {
    db.Article.find({}).then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.get("/saved", function(req, res) {
    db.Article.find({isSaved: true})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// router.get("/articles/saved", function(req, res) {
//     console.log("loading saved");
//     db.Article.find({isSaved: true})
//     .then(function(dbArticle) {
//         var hbsObject = {
//             articles: dbArticle
//         }
//         res.render("saved", hbsObject)
//     })
//     .catch(function(err) {
//         res.json(err);
//     });
// });

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
    console.log(req.body);
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true})
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        if (err) {
            res.json(err);
        };
    });
});

//Save an article
app.get("/articles/:id/save", function(req, res) {
    db.Article.findOne( {_id: req.params.id} )
    .then(function(dbArticle) {
        dbArticle.saveArticle();
        res.json(dbArticle);
    });
});

//Clear all articles except for those that are saved
app.get("/clear", function(req, res) {
    db.Article.remove({isSaved: false})
    .then(function(dbArticle) {
        res.send("Unsaved articles cleared.")
    });
});


app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});