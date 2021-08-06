var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schema = new Schema({
    user_id: { type: Schema.ObjectId, trim: true, ref: "users" },
    name: String,
    description: String,
    private: Boolean,
    image_path: String,
    contents: [{ type: Schema.ObjectId }]
});

module.exports = mongoose.model("libraries", schema);