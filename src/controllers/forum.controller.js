var Model = require("../models/forum.model")
var UserOptionModel = require("../models/useroption.model")
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const userRole = require("../utils/userRoles.utils")
const dotenv = require('dotenv');
var mongoose = require("mongoose");
dotenv.config();

/**
 * A login params dto
 * @tags forum
 * @typedef {object} ForumDto - Forum Client
 * @property {string} name.required - Name
 * @property {string} create_date - Create Date
 * @property {object} user_data - User Owner Data
 * @property {array<object>} categories - Categories
 * @property {array<object>} tags - Tags for SEO
 * @property {string} description.required - Description
 */
/**
 * A login params dto
 * @tags forum
 * @typedef {object} ForumCommentDto - Forum Client
 * @property {string} user_id - User id
 * @property {number} id - ID
 * @property {number} comment_id - Comment id
 * @property {string} description - Description
 * @property {string} create_date - Create Date
 */
class ForumController {
    getAll = async (req, res, next) => {
        await Model.aggregate([{
            $lookup:
            {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user_data"
            }
        },
        {
            $unwind: '$user_data'
        },
        {
            $lookup:
            {
                from: "useroptions",
                localField: "user_id",
                foreignField: "user_id",
                as: "user_option"
            }
        },
        {
            $project: {
                'user_data.password': 0,
                'user_data.role': 0,
                user_id: 0
            }
        }], function (err, posts) {
            if (err) console.log(err);
            res.send(posts);
        });
    };

    getPublishedAll = async (req, res, next) => {
        await Model.aggregate([
            {
                $match: {
                    status: "Published"
                }
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            {
                $unwind: '$user_data'
            },
            {
                $lookup:
                {
                    from: "useroptions",
                    localField: "user_data._id",
                    foreignField: "user_id",
                    as: "user_option"
                }
            },
            {
                $unwind: '$user_option'
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "comments.user_id",
                    foreignField: "_id",
                    as: "comments_user_data"
                }
            },
            {
                $lookup:
                {
                    from: "useroptions",
                    localField: "comments_user_data._id",
                    foreignField: "user_id",
                    as: "comments_user_option"
                }
            },
            {
                $project: {
                    'name': 1,
                    'short_description': 1,
                    'categories': 1,
                    'connects': 1,
                    'comments': 1,
                    'description': 1,
                    'create_date': 1,
                    'user_data._id': 1,
                    'user_data.image_path': { $cond: { if: { $eq: ["$user_option.isViewImagePath", true] }, then: '$user_data.image_path', else: "$$REMOVE" } },
                    'user_data.first_name': { $cond: { if: { $eq: ["$user_option.isViewFirstName", true] }, then: '$user_data.first_name', else: "$$REMOVE" } },
                    'user_data.last_name': { $cond: { if: { $eq: ["$user_option.isViewLastName", true] }, then: '$user_data.last_name', else: "$$REMOVE" } },
                    'user_data.email': { $cond: { if: { $eq: ["$user_option.isViewEmail", true] }, then: '$user_data.email', else: "$$REMOVE" } },
                    'user_data.username': 1,
                    'user_data.title': { $cond: { if: { $eq: ["$user_option.isViewTitle", true] }, then: '$user_data.title', else: "$$REMOVE" } },
                    'comments_user_data._id': 1,
                    'comments_user_data.image_path': { $cond: [{ $eq: ["$comments_user_option.isViewImagePath", true] }, '$comments_user_data.image_path', "$$REMOVE"] },
                    'comments_user_data.first_name': { $cond: [{ $eq: ["$comments_user_option.isViewFirstName", true] }, '$comments_user_data.first_name', "$$REMOVE"] },
                    'comments_user_data.last_name': { $cond: [{ $eq: ["$comments_user_option.isViewLastName", true] }, '$comments_user_data.last_name', "$$REMOVE"] },
                    'comments_user_data.email': { $cond: [{ $eq: ["$comments_user_option.isViewEmail", true] }, '$comments_user_data.email', "$$REMOVE"] },
                    'comments_user_data.username': 1,
                    'comments_user_data.title': { $cond: [{ $eq: ["$comments_user_option.isViewTitle", true] }, '$comments_user_data.title', "$$REMOVE"] },

                }
            }], function (err, posts) {
                if (err) console.log(err);
                res.send(posts);
            });
    };

    getByUserPublishedAll = async (req, res, next) => {
        const ObjectId = mongoose.Types.ObjectId;
        var result = await Model.aggregate([
            {
                $match: {
                    user_id: ObjectId(req.params.user_id),
                    status: "Published"
                }
            }])
        res.send(result)
    };

    getFindAll = async (req, res, next) => {
        Model.find({ name: { $regex: req.params.text, $options: 'i' } },
            function (err, posts) {
                if (err) console.log(err);
                res.send(posts);
            });
    };

    getAllTop = async (req, res, next) => {
        Model.aggregate([
            { "$sort": { "finalTotal": -1 } },
            { "$limit": Number(req.params.count) }])
            .exec(function (err, result) {
                res.send(result);
            });
    };

    getById = async (req, res, next) => {
        var data = (await this.byId(req.currentUser ? req.currentUser.role : userRole.Client, req.params.id))[0]
        if (req.currentUser == undefined || req.currentUser.role == userRole.Client) {
            var userdatas = data.comments_user_data;
            for (let i = 0; i < userdatas.length; i++) {
                var findOption = await UserOptionModel.findOne({ user_id: userdatas[i]._id });
                var options = [
                    { opt: 'isViewFirstName', key: 'first_name' },
                    { opt: 'isViewLastName', key: 'last_name' },
                    { opt: 'isViewEmail', key: 'email' },
                    { opt: 'isViewImagePath', key: 'image_path' },
                    { opt: 'isViewTitle', key: 'title' },
                ];
                let user = { _id: userdatas[i]._id, username: userdatas[i].username };
                for (let j = 0; j < options.length; j++) {
                    if (findOption[options[j].opt]) user = { ...user, [options[j].key]: userdatas[i][options[j].key] };
                }
                userdatas[i] = user;
            }
        }
        res.send(data)
    };

    getByUserId = async (req, res, next) => {
        const ObjectId = mongoose.Types.ObjectId;
        await Model.aggregate([
            {
                $match: {
                    user_id: ObjectId(req.params.user_id),
                }
            }
        ],
            function (err, result) {
                if (err) console.log(err);
                res.send(result);
            }
        )
    };

    create = async (req, res, next) => {
        this.checkValidation(req);
        var obj = { ...req.body, create_date: new Date() }
        var returnData = await Model.create(obj)
        if (req.currentUser.role == userRole.Client) res.status(201).send(returnData);
        else res.status(201).send((await this.byId(req.currentUser.role, returnData._id))[0]);
    };

    createComment = async (req, res, next) => {
        var comment = await Model.findOne({ _id: req.params.id });
        var id = comment.comments.length > 0 ? comment.comments[comment.comments.length - 1].id + 1 : 1;
        var obj = {
            id: id,
            ...req.body,
            create_date: new Date()
        }
        comment.comments.push({ ...obj })
        await Model.updateOne({ _id: comment._id }, comment)
        res.status(201).send(obj);
    };

    update = async (req, res, next) => {
        var obj = { ...req.body, update_date: new Date() }
        if (req.currentUser._id == req.body.user_id || req.currentUser.role != userRole.Client) {
            Model.updateOne({ _id: req.params.id }, obj).then((raw) => {
                if (raw.ok > 0)
                    res.status(200).send(obj);
                else
                    res.status(500).send("Güncellenmedi")
            })
        } else
            res.status(403).send("Forbidden!");
    };



    updateImpression = async (req, res, next) => {
        var raw = await Model.findOne({ _id: req.body.id });
        if (raw) {
            if (raw.impressions.filter(x => x.ip == req.body.ip_address).length == 0) {
                raw.impressions.push({ ip: req.body.ip_address, count: 1 });
                Model.updateOne({ _id: raw._id }, raw).then(x => {
                    if (x.ok > 0)
                        res.send("Updated!");
                    else
                        throw new HttpException(x)

                })
            } else {
                raw.impressions.find(x => x.ip == req.body.ip_address).count += 1;
                Model.updateOne({ _id: raw._id }, raw).then(x => {
                    if (x.ok > 0)
                        res.send("Updated!");
                    else
                        throw new HttpException(x)

                })
            }
        }
    };

    delete = async (req, res, next) => {
        var response = await Model.deleteOne({ _id: req.params.id })
        if (response.deletedCount > 0) res.status(200).send(req.params.id);
        else res.status(500).send("Can't delete!")
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }

    byId = async (role, id) => {
        const ObjectId = mongoose.Types.ObjectId;
        if (role == userRole.Client) {

            return await Model.aggregate([
                {
                    $match: {
                        _id: ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user_data"
                    }
                },
                {
                    $unwind: "$user_data"
                },
                {
                    $lookup:
                    {
                        from: "useroptions",
                        localField: "user_data._id",
                        foreignField: "user_id",
                        as: "user_option"
                    }
                },
                {
                    $unwind: '$user_option'
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "comments.user_id",
                        foreignField: "_id",
                        as: "comments_user_data"
                    }
                },
                {
                    $lookup:
                    {
                        from: "useroptions",
                        localField: "comments_user_data._id",
                        foreignField: "user_id",
                        as: "comments_user_option"
                    }
                },
                {
                    $project: {
                        'name': 1,
                        'short_description': 1,
                        'categories': 1,
                        'connects': 1,
                        'comments': 1,
                        'description': 1,
                        'create_date': 1,
                        'user_data._id': 1,
                        'user_data.image_path': { $cond: { if: { $eq: ["$user_option.isViewImagePath", true] }, then: '$user_data.image_path', else: "$$REMOVE" } },
                        'user_data.first_name': { $cond: { if: { $eq: ["$user_option.isViewFirstName", true] }, then: '$user_data.first_name', else: "$$REMOVE" } },
                        'user_data.last_name': { $cond: { if: { $eq: ["$user_option.isViewLastName", true] }, then: '$user_data.last_name', else: "$$REMOVE" } },
                        'user_data.email': { $cond: { if: { $eq: ["$user_option.isViewEmail", true] }, then: '$user_data.email', else: "$$REMOVE" } },
                        'user_data.username': 1,
                        'user_data.title': { $cond: { if: { $eq: ["$user_option.isViewTitle", true] }, then: '$user_data.title', else: "$$REMOVE" } },
                        'comments_user_data': 1,
                    }
                },
                {
                    $limit: 1
                }
            ]);

        }
        else if (role == userRole.Admin || role == userRole.SuperUser)

            return await Model.aggregate([
                {
                    $match: {
                        _id: ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user_data"
                    }
                },
                {
                    $unwind: "$user_data"
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "comments.user_id",
                        foreignField: "_id",
                        as: "comments_user_data"
                    }
                },
                {
                    $project: {
                        'user_id': 0,
                        'user_data.password': 0,
                    }
                },
                {
                    $limit: 1
                }
            ]);

        else return null;
    }
}
module.exports = new ForumController;