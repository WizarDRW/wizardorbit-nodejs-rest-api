var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    description: String,
    path: String,
    status: Boolean,
    sort: String,
    children: Object
});

module.exports = mongoose.model("menus", schema);