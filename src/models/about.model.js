var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schema = new Schema({
    type: String,
    create_date: Date,
    descriptions: Object,
    option: Object
});

module.exports = mongoose.model("abouts", schema);