// ################################ NPM Packages ################################ //
require('dotenv').config();
const nodemailer = require('nodemailer');

// ################################ Configurations ################################ //
const transportOptions = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
}

// Send Mail
module.exports.sendMail = (messageData) => {
    return new Promise((resolve, reject) => {
        const mailTransport = nodemailer.createTransport(transportOptions);

        const message = {
            from: `${process.env.MAIL_FROM}<${process.env.MAIL_FROM_ADDRESS}>`, // Sender address
            to: messageData.toEmail, // List of recipients
            subject: messageData.subject, // Subject line
            html: messageData.html // Html text body
        };

        mailTransport.sendMail(message, function(err, info) {
            if (err) {
                console.log("MAIL ERROR : ", err);
                reject(err);
            } else {
                console.log("INFO : ", info);
                resolve(true);
            }
        });
    })
}

module.exports.nestedLoop = (obj) => {
    return new Promise((resolve, reject) => {
        const res = {};
        function recurse(obj, current) {
            for (const key in obj) {
                let value = obj[key];
                if(value != undefined) {
                    if (value && typeof value === 'object') {
                        recurse(value, key);
                    } else {
                          // Do your stuff here to var value
                        if(value === null) value = {};  
                        res[key] = value;
                    }
                }
            }
        }
        recurse(obj);
        resolve(res);
    })
}