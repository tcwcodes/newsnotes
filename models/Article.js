var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    isSaved: {
        type: Boolean,
        default: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

ArticleSchema.methods.saveArticle = function() {
    if (this.isSaved === false) {
        console.log("Saving article ... ");
        this.isSaved = true;
        this.save();
        console.log(this);
    } else {
        console.log("Unsaving article ... ");
        this.isSaved = false;
        this.save();
        console.log(this);
    };
};

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;