var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schema = new Schema({
    ip_address: String,
});

module.exports = mongoose.model("ipaddresses", schema);