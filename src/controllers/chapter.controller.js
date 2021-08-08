var Model = require("../models/chapter.model")
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const userRole = require("../utils/userRoles.utils")
const googleDriveService = require("../utils/googledrive.utils.js");
const ApiService = require("../services/api.service")
var urlParser = require('url-parse');
const dotenv = require('dotenv');
var mongoose = require("mongoose");
dotenv.config();
ApiService.init(process.env.AI_SERVICE)
/**
 * A login params dto
 * @tags chapter
 * @typedef {object} ChapterDto - Chapter Client
 * @property {string} name.required - Name
 * @property {string} image_path - Image Path
 * @property {string} short_description - Short Description
 * @property {string} create_date - Create Date
 * @property {object} user_data - User Owner Data
 * @property {array<object>} categories - Categories
 * @property {array<object>} tags - Tags for SEO
 * @property {array<object>} descriptions - Descriptions
 */

/** */
class ChapterController {
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
                    localField: "user_id",
                    foreignField: "user_id",
                    as: "user_option"
                }
            },
            {
                $unwind: '$user_option'
            },
            {
                $project: {
                    'name': 1,
                    'description': 1,
                    'image_path': 1,
                    'short_description': 1,
                    'create_date': 1,
                    'showcases': 1,
                    'categories': 1,
                    'tags': 1,
                    'descriptions': 1,
                    'user_data._id': 1,
                    'user_data.image_path': { $cond: { if: { $eq: ["$user_option.isViewImagePath", true] }, then: '$user_data.image_path', else: "$$REMOVE" } },
                    'user_data.first_name': { $cond: { if: { $eq: ["$user_option.isViewFirstName", true] }, then: '$user_data.first_name', else: "$$REMOVE" } },
                    'user_data.last_name': { $cond: { if: { $eq: ["$user_option.isViewLastName", true] }, then: '$user_data.last_name', else: "$$REMOVE" } },
                    'user_data.email': { $cond: { if: { $eq: ["$user_option.isViewEmail", true] }, then: '$user_data.email', else: "$$REMOVE" } },
                    'user_data.username': 1,
                    'user_data.title': { $cond: { if: { $eq: ["$user_option.isViewTitle", true] }, then: '$user_data.title', else: "$$REMOVE" } },
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
        var data = await Model.aggregate([
            { "$sort": { "finalTotal": -1 } }]);
        var data = {
            chapters: data,
            limit: parseInt(req.params.count)
        }
        var result = (await ApiService.post(`chapter/`, data))
        res.send(result.data)
    };

    getById = async (req, res, next) => {
        var data = (await this.byId(req.currentUser ? req.currentUser.role : userRole.Client, req.params.id))[0]
        res.send(data)
    };

    getByUserId = async (req, res, next) => {
        const ObjectId = mongoose.Types.ObjectId;
        Model.aggregate([
            {
                $match: {
                    user_id: ObjectId(req.params.user_id),
                }
            },], function (err, result) {
                res.send(result);
            })
    };

    create = async (req, res, next) => {
        this.checkValidation(req);
        var obj = { ...req.body, create_date: new Date() }
        var returnData = await Model.create(obj);
        if (req.currentUser.role == userRole.Client) res.status(201).send(returnData);
        var response = (await this.byId(req.currentUser.role, returnData._id))[0];
        res.status(201).send(response);
    };

    update = async (req, res, next) => {
        this.checkValidation(req);
        if (req.currentUser._id == req.body.user_id || req.currentUser.role != userRole.Client) {
            Model.updateOne({ _id: req.params.id }, req.body).then((raw) => {
                if (raw.ok > 0)
                    res.status(200).send(req.body);
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
        var find = (await this.byId(req.currentUser.role, req.params.id))[0];
        var response = await Model.deleteOne({ _id: req.params.id })
        if (response.deletedCount > 0) {
            if (find.image_path) {
                var url = new urlParser(find.image_path, true);
                await googleDriveService.deleteFile(url.query.id);
            }
            find.descriptions.forEach(async (el) => {
                if (el.type == 'image') {
                    var urldes = new urlParser(el.val, true);
                    await googleDriveService.deleteFile(urldes.query.id);
                }
            });
            res.status(200).send(req.params.id)
        }
        else res.status(500).send("Can't delete!")
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }

    async byId(role = userRole.Client, id) {
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
                        localField: "user_id",
                        foreignField: "user_id",
                        as: "user_option"
                    }
                },
                {
                    $unwind: '$user_option'
                },
                {
                    $project: {
                        'name': 1,
                        'description': 1,
                        'image_path': 1,
                        'short_description': 1,
                        'create_date': 1,
                        'showcases': 1,
                        'categories': 1,
                        'tags': 1,
                        'descriptions': 1,
                        'user_data._id': 1,
                        'user_data.image_path': { $cond: { if: { $eq: ["$user_option.isViewImagePath", true] }, then: '$user_data.image_path', else: "$$REMOVE" } },
                        'user_data.first_name': { $cond: { if: { $eq: ["$user_option.isViewFirstName", true] }, then: '$user_data.first_name', else: "$$REMOVE" } },
                        'user_data.last_name': { $cond: { if: { $eq: ["$user_option.isViewLastName", true] }, then: '$user_data.last_name', else: "$$REMOVE" } },
                        'user_data.email': { $cond: { if: { $eq: ["$user_option.isViewEmail", true] }, then: '$user_data.email', else: "$$REMOVE" } },
                        'user_data.username': 1,
                        'user_data.title': { $cond: { if: { $eq: ["$user_option.isViewTitle", true] }, then: '$user_data.title', else: "$$REMOVE" } },
                    }
                },
                {
                    $limit: 1
                }
            ]);
        } else if (role == userRole.Admin || role == userRole.SuperUser)
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
                    $project: {
                        'user_id': 0,
                        'user_data.password': 0,
                    }
                },
                {
                    $limit: 1
                }
            ]);
        else
            return null;
    }
}
module.exports = new ChapterController;