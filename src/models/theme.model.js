var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    mode: String,
    base_colors: Array,
    color_scss: Object
});

module.exports = mongoose.model("themes", schema);