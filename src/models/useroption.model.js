var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schema = new Schema({
    user_id: { type: Schema.ObjectId, trim: true, ref: "users" },
    isViewFirstName: Boolean,
    isViewLastName: Boolean,
    isReveseFullName: Boolean,
    isViewUserName: Boolean,
    isViewEmail: Boolean,
    isViewImagePath: Boolean,
    isViewDescription: Boolean,
    isViewRole: Boolean,
    isViewTitle: Boolean,
    isViewCreateDate: Boolean,
    dark: { type: Schema.ObjectId, trim: true, ref: "themes" },
    light: { type: Schema.ObjectId, trim: true, ref: "themes" },
    passwordOptions: {
        isPrivateKey: Boolean,
        privateKey: String,
        minLength: Number,
        maxLength: Number,
        isIrregularCharracter: Boolean,
        minIrregularCharracterLength: Number,
        maxIrregularCharracterLength: Number,
        isUpperCase: Boolean,
        minUpperCaseLength: Number,
        maxUpperCaseLength: Number,
        isLowerCase: Boolean,
        minLowerCaseLength: Number,
        maxLowerCaseLength: Number,
        isNumber: Boolean,
        minNumberLength: Number,
        maxNumberLength: Number
    },
});

module.exports = mongoose.model("useroptions", schema);