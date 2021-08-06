const Model = require('../models/about.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

class AboutController {
    getAll = async (req, res, next) => {
        const abouts = await Model.find({ type: { $ne: 'release' } });
        if (!abouts) {
            throw new HttpException(404, 'Abouts not found');
        }
        res.send(abouts)
    };

    getById = async (req, res, next) => {
        const about = await Model.findOne({ _id: req.params.id });
        if (!about) {
            throw new HttpException(404, 'About not found');
        }

        res.send(about);
    };

    getReleases = async (req, res, next) => {
        const releases = await Model.find({ type: 'release' }).sort({create_date: -1});
        if (!releases) {
            throw new HttpException(404, 'Releases not found');
        }

        res.send(releases);
    };

    getReleaseById = async (req, res, next) => {
        const release = await Model.findOne({ _id: req.params.id });
        if (!release) {
            throw new HttpException(404, 'Release not found');
        }

        res.send(release);
    };

    getByType = async (req, res, next) => {
        const about = await Model.findOne({ type: req.params.type });
        if (!about) {
            throw new HttpException(404, 'About not found');
        }

        res.send(about);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);

        var data = {
            ...req.body,
            create_date: new Date()
        }

        const result = await Model.create(data);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send(result);
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        // do the update query and get the result
        // it can be partial edit
        const result = await Model.updateOne({ _id: req.params.id}, req.body);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'About not found' :
            affectedRows && changedRows ? 'About updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    delete = async (req, res, next) => {
        const result = await Model.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'About not found');
        }
        res.send('About has been deleted');
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }
}
module.exports = new AboutController;