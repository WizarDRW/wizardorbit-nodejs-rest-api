const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

class MailController {
    sendMail = async (req, res, next) => {
        const nodemailer = require('nodemailer');
        
        let transporter = nodemailer.createTransport({
          host: 'mail.softelon.com',
          port: 465,
          secure: true,
          auth: {
            user: 'software@softelon.com',
            pass: 'Mhl597dR'
          }
        });
        
        transporter.verify(function (error, success) {
          if (error) throw error;
        });
        
        let bilgiler = {
          from: `Yazılım <software@softelon.com>`,
          to: 'info@softelon.com',
          subject: 'Sihirbaz Blog Başvuru',
          html: `<b>${req.body.email}</b><br/><b>${req.body.phone}</b><p>${req.body.text}</p>`
        };
        
        transporter.sendMail(bilgiler, function (error, info) {
          if (error) throw error;
          res.send('Eposta gönderildi ' + info.response);
        
        });
    };

    mailCheck = async (req, res, next) => {
       
    };
}
module.exports = new MailController;