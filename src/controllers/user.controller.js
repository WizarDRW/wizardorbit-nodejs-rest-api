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
var mongoose = require("mongoose");
dotenv.config();

/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class UserController {
    getAllUsers = async (req, res, next) => {
        var result = await Model.aggregate([
            {
                $project: {
                    password: 0
                }
            }
        ]);

        res.send(result)
    };

    getUserById = async (req, res, next) => {
        await Model.findById(req.params.id, (err, raw) => {
            if (err) console.log(err);
            else if (raw) {
                const { password, ...withoutpassword } = raw._doc;
                res.send(withoutpassword)
            } else throw HttpException(404, 'Not found!')
        })
    };

    getUserProfile = async (req, res, next) => {
        const ObjectId = mongoose.Types.ObjectId;
        var result = await Model.aggregate([
            {
                $match: {
                    username: req.params.username
                },
            },
            {
                $lookup:
                {
                    from: "useroptions",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "user_option"
                }
            },
            {
                $unwind: '$user_option'
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    connections: 1,
                    image_path: { $cond: { if: { $eq: ["$user_option.isViewImagePath", true] }, then: '$image_path', else: "$$REMOVE" } },
                    first_name: { $cond: { if: { $eq: ["$user_option.isViewFirstName", true] }, then: '$first_name', else: "$$REMOVE" } },
                    last_name: { $cond: { if: { $eq: ["$user_option.isViewLastName", true] }, then: '$last_name', else: "$$REMOVE" } },
                    email: { $cond: { if: { $eq: ["$user_option.isViewEmail", true] }, then: '$email', else: "$$REMOVE" } },
                    title: { $cond: { if: { $eq: ["$user_option.isViewTitle", true] }, then: '$title', else: "$$REMOVE" } },
                }
            }
        ]);
        res.send(result[0]);
    }

    getUserByMail = async (req, res, next) => {
        Model.aggregate([
            {
                "$group": {
                    "email": res.params.email,
                }
            },])
            .exec(function (err, result) {
                res.send(result);
            });
    };

    create = async (req, res, next) => {
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
            var result = await Model.create(data);

            const { password, ...withoutPassword } = result._doc;

            res.status(201).send(withoutPassword);
        }
    };

    updateUser = async (req, res, next) => {
        this.checkValidation(req);
        if (req.currentUser._id != req.body._id && req.currentUser.role != userRole.SuperUser) throw new HttpException(403, "Permission denied!!!");
        await this.hashPassword(req);

        const { confirm_password, ...restOfUpdates } = req.body;
        var data = { ...restOfUpdates, update_date: new Date() }
        var result = await Model.updateOne({ _id: req.params.id }, data);

        if (result.nModified > 0) res.status(200).send(data);
        else res.status(301).send('No updated!')
    };

    updateUserStatus = async (req, res, next) => {
        this.checkValidation(req);
        var result = await Model.updateOne({ _id: req.params.id }, { $set: { "status": req.body.status } })
        if (result.nModified > 0) res.status(200).send(req.body)
        else res.status(301).send("Status no updated!")
    };

    deleteUser = async (req, res, next) => {
        var result = await Model.deleteOne({ _id: req.params.id })
        if (result.deletedCount > 0) res.status(200).send(req.params.id);
        else res.status(301).send("No deleted!")
    };

    userRegister = async (req, res, next) => {
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

    userGoogleRegister = async (req, res, next) => {
        var a = googleAuth.getUrl(req.body);
        res.send(a)
    }

    userLogin = async (req, res, next) => {
        this.checkValidation(req);

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

        // user matched!
        req.session.isAuth = true;
        req.session.user_id = user._id;

        res.status(200).send(req.session.isAuth);
    };

    userGoogleLogin = async (req, res, next) => {

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

    // hash password if it exists
    hashPassword = async (req) => {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }
    }
}
module.exports = new UserController;