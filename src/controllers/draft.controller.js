const Model = require("../models/draft.model")
var mongoose = require("mongoose");

class DraftController {
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

    getById = async (req, res, next) => {
        const ObjectId = mongoose.Types.ObjectId;
        Model.aggregate([
            {
                $match: {
                    _id: ObjectId(req.params.id),
                },
            }], function (err, result) {
                res.send(result[0]);
            })
    };

    getByUserId = async (req, res, next) => {
        const ObjectId = mongoose.Types.ObjectId;
        Model.aggregate([
            {
                $match: {
                    user_id: ObjectId(req.params.user_id),
                },
            }], function (err, result) {
                res.send(result);
            })
    };

    create = async (req, res, next) => {
        var obj = { ...req.body, create_date: new Date() }
        var result = await Model.create(obj)

        res.status(201).send(result);
    };

    update = async (req, res, next) => {
        if (req.currentUser._id == req.body.user_id || req.currentUser.role != "Client") {
            Model.updateOne({ _id: req.params.id }, req.body).then((raw) => {
                if (raw.ok == 1)
                    res.status(200).send(req.body);
                else
                    res.status(500).send({ status: 500 })
            })
        } else
            res.status(403).send({ status: 403 });
    };

    delete = async (req, res, next) => {
        var result = await Model.deleteOne({ _id: req.params.id })
        if (result.deletedCount > 0) {
            res.status(200).send(req.params.id);
        }
        else res.status(500).send("Can't delete!")
    };
}

module.exports = new DraftController;