const Model = require('../models/message.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
var mongoose = require("mongoose");
dotenv.config();

class MessageController {
    getAll = async (req, res, next) => {
        var data = await Model.find({ tailable: true, awaitData: true })

        res.send(data);
    };

    getByUserId = async (req, res, next) => {
        const ObjectId = mongoose.Types.ObjectId;
        const data = await Model.aggregate([
            {
                $match: {
                    user_id: ObjectId(req.params.id)
                }
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "messages.user_id",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            {
                $limit: 1
            },
            { "$project": {
                "messages": { 
                  "$map": {
                    "input": { "$zip": { "inputs": [ "$user_data", "$messages.messages" ] } },
                    "as": "el",
                    "in": { 
                      "user_data": { "$arrayElemAt": [ "$$el", 0 ] }, 
                      "messages": { "$arrayElemAt": [ "$$el", 1 ] }
                    }
                  }
                }
             }}
        ]);
        if (!data) {
            throw new HttpException(404, 'Message not found');
        }

        res.send(data[0]);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);

        const result = await MenuModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Menu was created!');
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        // do the update query and get the result
        // it can be partial edit
        const result = await MenuModel.update(req.body, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Menu not found' :
            affectedRows && changedRows ? 'Menu updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    delete = async (req, res, next) => {
        const result = await MenuModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Menu not found');
        }
        res.send('Menu has been deleted');
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }
}
module.exports = new MessageController;