const Model = require('../models/user.model');
const auth = require('../middleware/auth.middleware');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const userRole = require("../utils/userRoles.utils")
const { authLogger } = require('../utils/logger.utils');
const googleAuth = require("../utils/googleAuth.util")
dotenv.config();

/******************************************************************************
 *                              Auth Controller
 ******************************************************************************/

/**
 * A login params dto
 * @tags auth
 * @typedef {object} LoginDto
 * @property {string} email.required - The Email
 * @property {string} password.required - The Password
 */
/**
 * A login params dto
 * @tags auth
 * @typedef {object} RegisterDto
 * @property {string} email.required - The Email
 * @property {string} password.required - The Password
 */

class AuthController {
    verify = async (req, res, next) => {
        const { password, ...userWithoutPassword } = req.currentUser._doc;
        res.send({ ...userWithoutPassword });
    };

    verifySso = async (req, res, next) => {
        const { ssoToken } = req.query;

        res.status(200).json(true);
    };

    register = async (req, res, next) => {
        this.checkValidation(req);

        var isData = await Model.findOne({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });

        if (isData) {
            throw new HttpException(401, 'User already exists!');
        } else {
            await this.hashPassword(req);

            var data = {
                ...req.body,
                create_date: new Date(),
                update_date: null
            }
            await Model.create(data).then(x => {
                req.session.isAuth = true;
                req.session.user_id = x._id;
                res.status(201).send(true);
            });
        }
    };

    googleRegister = async (req, res, next) => {
        var a = googleAuth.getUrl(req.body);
        res.send(a)
    }

    login = (req, res, next) => {
        if (req.session.user_id) {
            res.redirect(req.headers['x-forwarded-proto'] + "://" + req.headers['x-forwarded-host'])
        }
        return res.render("login", {
            title: "SSO-Server | Login"
        });
    }
    doLogin = async (req, res, next) => {
        console.log(req.body);
        const { email, password: pass } = req.body;

        var user = null;
        user = await Model.findOne(
            {
                "email": email,
            });
        if (!user) {
            authLogger.error(`401 : Unable to login! Email: ${email}`)
            throw new HttpException(401, 'Unable to login!');
        }

        const isMatch = await bcrypt.compare(pass, user.password);

        if (!isMatch) {
            authLogger.error(`401 : Incorrect password! User: ${user.first_name} ${user.last_name} (${email})`)
            throw new HttpException(401, 'Incorrect password!');
        }

        req.session.isAuth = true;
        req.session.user_id = user._id;
        res.header("Access-Control-Allow-Credentials", true)

        res.send(true);
    };

    googleLogin = async (req, res, next) => {

    }

    resetPassword = async (req, res, next) => {
        this.checkValidation(req);
        await this.hashPassword(req)
        Model.findOne({ _id: req.params.id },
            function (err, raw) {
                raw.password = req.body.password
                Model.updateOne({ _id: raw._id }, raw)
            });
        res.send("Updated!");
    }

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }

    hashPassword = async (req) => {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }
    }
}
module.exports = new AuthController;