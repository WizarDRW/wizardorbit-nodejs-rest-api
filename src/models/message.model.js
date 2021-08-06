var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schema = new Schema({
    user_id: { type: Schema.ObjectId, trim: true, ref: "users" },
    messages: [{ user_id: { type: Schema.ObjectId, ref: "users" }, messages: [{ create_date: Date, text: String, seen: Boolean }] }]
});

module.exports = mongoose.model("messages", schema);