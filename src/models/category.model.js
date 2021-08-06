var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schema = new Schema({
    type: String,
    categories: Array
});

module.exports = mongoose.model("categories", schema);