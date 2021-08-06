var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schema = new Schema({
    user_id: { type: Schema.ObjectId, trim: true, ref: "users" },
    create_date: Date,
    update_date: Date,
    type: String,
    data: Object
});

module.exports = mongoose.model("drafts", schema);