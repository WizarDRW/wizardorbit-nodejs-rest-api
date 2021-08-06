var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schema = new Schema({
    user_id: { type: Schema.ObjectId, trim: true, ref: "users" },
    create_date: Date,
    title: String,
    datas: Array
});

module.exports = mongoose.model("logs", schema);