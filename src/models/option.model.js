var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schema = new Schema({
    json_social: Object,
    ico: String,
    header_logo: String,
    main_logo: String,
    title: String,
    main_title: String,
    codedby: String,
    startus: String
});

module.exports = mongoose.model("options", schema);