var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    impressions: Array,
    categories: Array,
    description: String,
    status: String,
    create_date: Date,
    update_date: Date,
    comments: [{
        user_id: { type: Schema.ObjectId, ref: "users" },
        id: Number,
        comment_id: Number,
        description: String,
        create_date: Date
    }],
    short_description: String,
    tags: Array,
    connects: Array,
    user_id: Schema.ObjectId
});

module.exports = mongoose.model("forums", schema);