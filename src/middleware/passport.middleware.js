const localStrategy = require('passport-local').Strategy
const samlStrategy = require('passport-saml').Strategy
const bcrypt = require('bcryptjs');

const UserModel = require('../models/user.model');

module.exports = function (passport) {
    passport.use(new samlStrategy(
        {
            entryPoint: 'http://localhost:8081/login',
            issuer: 'http://localhost:3000',
            cert: "cert",
        },
        function (profile, done) {
            console.log(profile);
            findByEmail(profile.email, function (err, user) {
                if (err) {
                    return done(err);
                }
                return done(null, user);
            });
        }
    ));
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser((id, done) => {
        let user = UserModel.findOne({ _id: id })
        done(null, user)
    })
    return passport;
}