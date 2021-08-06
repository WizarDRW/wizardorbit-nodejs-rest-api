var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    impressions: Array,
    categories: Array,
    description: String,
    descriptions: Array,
    status: String,
    image_path: String,
    short_description: String,
    create_date: Date,
    showcases: Array,
    tags: Array,
    connects: Array,
    user_id: Schema.ObjectId
});

module.exports = mongoose.model("news", schema);