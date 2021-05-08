/*!
 * UsersController.js
 * Containing all the controller actions related to `USER`
 * Author: Suman Rana
 * Date: 7th February, 2021`
 * MIT Licensed
 */
/**
 * Module dependencies.
 * @private
 */

// ################################ Repositories ################################ //
const userRepositories = require('../../repositories/UsersRepositories');

// ################################ Sequelize ################################ //
const sequelize = require('../../config/dbConfig').sequelize;

// ################################ Response Messages ################################ //
const responseMessages = require('../../ResponseMessages');

// ################################ Common Function ################################ //
const commonFunction = require('../../helpers/commonFunctions');

// ################################ NPM Packages ################################ //
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const moment = require('moment');

// ################################ Globals ################################ //
const jwtOptionsAccess = global.constants.jwtAccessTokenOptions;
const jwtOptionsRefresh = global.constants.jwtRefreshTokenOptions;

/*
|------------------------------------------------ 
| API name          :  registerUser
| Response          :  Respective response message in JSON format
| Logic             :  Register User
| Request URL       :  BASE_URL/api/register
| Request method    :  POST
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.registerUser = (req, res) => {
    (async() => {
        let purpose = "Register User"
        try {
            let body = req.body;
            let userCount = await userRepositories.count({ where: { email: body.email } });

            if (userCount == 0) {
                let userData;
                await sequelize.transaction(async(t) => {
                    let createUserData = {
                        full_name: body.full_name,
                        email: body.email,
                        mobile_no: body.mobile_no,
                        password: md5(body.password),
                        dob: body.dob,
                        profile_image: `/uploads/profile_images/default_image.png`,
                        country_id: body.country_id,
                        login_type: 'system',
                    }

                    userData = await userRepositories.create(createUserData, t);
                })

                delete userData.password;
                delete userData.login_type;
                delete userData.otp;
                delete userData.otp_expire_time;
                delete userData.otp_status;
                delete userData.is_active;

                let accessToken = jwt.sign({ user_id: userData.id, email: userData.email }, jwtOptionsAccess.secret, jwtOptionsAccess.options);
                let refreshToken = jwt.sign({ user_id: userData.id, email: userData.email }, jwtOptionsRefresh.secret, jwtOptionsRefresh.options);

                userData['access_token'] = accessToken;
                userData['refresh_token'] = refreshToken;

                return res.send({
                    status: 200,
                    msg: responseMessages.registrationSuccess,
                    data: userData,
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 409,
                    msg: responseMessages.duplicateEmail,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (e) {
            console.log("REGISTER USER ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

/*
|------------------------------------------------ 
| API name          :  userLogin
| Response          :  Respective response message in JSON format
| Logic             :  User Login
| Request URL       :  BASE_URL/api/login
| Request method    :  POST
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.userLogin = (req, res) => {
    (async() => {
        let purpose = "User Login";
        try {
            let body = req.body;
            let whereData = {
                email: body.email,
                password: md5(body.password),
                is_active: 1
            }
            let userData = await userRepositories.findOne(whereData);

            if (userData) {
                let jwtOptionsAccess = global.constants.jwtAccessTokenOptions;
                let jwtOptionsRefresh = global.constants.jwtRefreshTokenOptions;
                let accessToken = jwt.sign({ user_id: userData.id, email: userData.email }, jwtOptionsAccess.secret, jwtOptionsAccess.options);
                let refreshToken = jwt.sign({ user_id: userData.id, email: userData.email }, jwtOptionsRefresh.secret, jwtOptionsRefresh.options);

                delete userData.password;
                delete userData.login_type;
                delete userData.otp;
                delete userData.otp_expire_time;
                delete userData.otp_status;
                delete userData.is_active;

                userData['access_token'] = accessToken;
                userData['refresh_token'] = refreshToken;

                return res.send({
                    status: 200,
                    msg: responseMessages.loginSuccess,
                    data: userData,
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 403,
                    msg: responseMessages.invalidCreds,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (e) {
            console.log("User Login ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

/*
|------------------------------------------------ 
| API name          :  socialLogin
| Response          :  Respective response message in JSON format
| Logic             :  Social Login
| Request URL       :  BASE_URL/api/social-login
| Request method    :  POST
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.socialLogin = (req, res) => {
    (async() => {
        let purpose = "Social Login";
        try {
            let body = req.body;
            let userDetails = await userRepositories.findOne({ email: body.email });
            if (userDetails) {
                if (userDetails.login_type == body.login_type) {
                    delete userDetails.password;
                    delete userDetails.login_type;
                    delete userDetails.otp;
                    delete userDetails.otp_expire_time;
                    delete userDetails.otp_status;
                    delete userDetails.is_active;

                    // userDetails['country_id'] = {};
                    userDetails['Country'] = {};

                    let accessToken = jwt.sign({ user_id: userDetails.id, email: userDetails.email }, jwtOptionsAccess.secret, jwtOptionsAccess.options);
                    let refreshToken = jwt.sign({ user_id: userDetails.id, email: userDetails.email }, jwtOptionsRefresh.secret, jwtOptionsRefresh.options);

                    userDetails['access_token'] = accessToken;
                    userDetails['refresh_token'] = refreshToken;

                    return res.send({
                        status: 200,
                        msg: responseMessages.loginSuccess,
                        data: userDetails,
                        purpose: purpose
                    })
                } else {
                    return res.send({
                        status: 409,
                        msg: responseMessages.duplicateEmail,
                        data: {},
                        purpose: purpose
                    })
                }
            } else {
                let createUserData = {
                    full_name: body.full_name,
                    email: body.email,
                    mobile_no: body.mobile_no ? body.mobile_no : null,
                    password: md5(body.password),
                    dob: body.dob ? body.dob : null,
                    profile_image: body.profile_image ? body.profile_image : `/uploads/profile_images/default_image.png`,
                    login_type: body.login_type,
                }

                let userData = await userRepositories.create(createUserData);

                delete userData.password;
                delete userData.login_type;
                delete userData.otp;
                delete userData.otp_expire_time;
                delete userData.otp_status;
                delete userData.is_active;

                // userData['country_id'] = {};
                userData['Country'] = {};

                let accessToken = jwt.sign({ user_id: userData.id, email: userData.email }, jwtOptionsAccess.secret, jwtOptionsAccess.options);
                let refreshToken = jwt.sign({ user_id: userData.id, email: userData.email }, jwtOptionsRefresh.secret, jwtOptionsRefresh.options);

                userData['access_token'] = accessToken;
                userData['refresh_token'] = refreshToken;


                return res.send({
                    status: 200,
                    msg: responseMessages.loginSuccess,
                    data: userData,
                    purpose: purpose
                })
            }
        } catch (e) {
            console.log("Social Login ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

/*
|------------------------------------------------ 
| API name          :  forgotPassword
| Response          :  Respective response message in JSON format
| Logic             :  Forgot Password
| Request URL       :  BASE_URL/api/forgot-password
| Request method    :  POST
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.forgotPassword = (req, res) => {
    (async() => {
        let purpose = "Forgot Password"
        try {
            let body = req.body;
            let userDetails = await userRepositories.findOne({ email: body.email });

            if (!userDetails) {
                return res.send({
                    status: 404,
                    msg: responseMessages.invalidUser,
                    data: {},
                    purpose: purpose
                })
            }

            const otpValue = Math.floor(1000 + Math.random() * 9000);
            let updateData = await userRepositories.update({ id: userDetails.id }, { otp: otpValue });

            if (updateData[0] == 1) {
                let mailData = {
                    toEmail: userDetails.email,
                    subject: 'We sent you an OTP to reset your password',
                    // html: `<p>Your OTP is <b>${otpValue}</b></p>`,
                    html: `<body style="background: #f2f2f2;">
                    <div style="width:100%; max-width:600px; margin:0 auto; padding:40px 15px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:8px 0;text-align: center; background:#7f7e7e;">
                      <tr>
                        <th scope="col"><img src="logo.png" alt="" width="150" /></th>
                      </tr>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:60px 40px;text-align: left; background:#fff;">
                      <tr>
                        <th scope="col">
                        <p style="font-size:17px; font-weight:500; color:#000; line-height:24px;">Hi ${userDetails.full_name},</p>
                        <p style="font-size:17px; font-weight:500; color:#000; line-height:24px; margin-top: 20px;">Please use the following code to authorize your device: <strong style="font-size:20px; color:#ff301e;"> ${otpValue}</strong></p>
                        <p style="font-size:17px; font-weight:500; color:#000; line-height:24px; margin-top: 20px;">If you don't recognize this activity, please <a href="#" style="color:#ff301e; margin:0 2px;">reset your password</a>
                          immediately. You can also reach us by responding to this email.</p>
                        <p style="font-size:17px; font-weight:500; color:#000; line-height:24px; margin-top: 20px;">Thanks for your time,</p>
                        <p style="font-size:17px; font-weight:500; color:#000; line-height:24px;">The Kawawa Sound Team </p>    
                        
                        </th>
                      </tr>
                    </table>
                    
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:20px 0;text-align: center; background:#f2f2f2;">
                      <tr>
                        <th scope="col">
                        <p style="font-size:15px; font-weight:500; color:rgb(82, 82, 82)"><a href="#" style="color:rgb(82, 82, 82); margin:0 2px;">Terms & Condition</a> I <a href="#" style="color:rgb(82, 82, 82); margin:0 2px;">Privacy Policy</a> I <a href="#" style="color:rgb(82, 82, 82); margin:0 2px;">Rate App</a></p>
                        <p style="font-size:15px; font-weight:500; color:rgb(82, 82, 82); margin-top: 8px;">655 Montgomery Street, Suite 490, Dpt 17022, San Francisco, CA 94111</p>
                        <p style="font-size:15px; font-weight:500; color:rgb(82, 82, 82); margin-top: 8px;">© 2021 Kawawa Sound Inc.</p>
                        </th>
                      </tr>
                    </table>
                    </div>
                    </body>`
                }
                await commonFunction.sendMail(mailData);

                return res.send({
                    status: 200,
                    msg: responseMessages.otpSendMessgae,
                    data: {},
                    purpose: purpose
                })
            }
            console.log("UPDATE : ", updateData);
        } catch (e) {
            console.log("Forgot Password ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

/*
|------------------------------------------------ 
| API name          :  verifyOTP
| Response          :  Respective response message in JSON format
| Logic             :  Verify OTP
| Request URL       :  BASE_URL/api/verify-otp
| Request method    :  POST
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.verifyOTP = (req, res) => {
    (async() => {
        let purpose = "Verify OTP";
        try {
            let body = req.body;
            let whereData = {
                otp: body.otp,
                email: body.email
            }
            let checkOTP = await userRepositories.findOne(whereData)

            if (checkOTP) {
                return res.send({
                    status: 200,
                    msg: responseMessages.validOTP,
                    data: {},
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 403,
                    msg: responseMessages.invalidOTP,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (e) {
            console.log("Verify OTP ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

/*
|------------------------------------------------ 
| API name          :  resetPassword
| Response          :  Respective response message in JSON format
| Logic             :  Reset Password
| Request URL       :  BASE_URL/api/reset-password
| Request method    :  POST
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.resetPassword = (req, res) => {
    (async() => {
        let purpose = "Reset Password";
        try {
            let body = req.body;
            let userDetails = await userRepositories.findOne({ otp: body.otp });

            if (userDetails) {
                let updateData = await userRepositories.update({ id: userDetails.id }, { password: md5(body.password), otp: null });

                if (updateData[0] == 1) {
                    return res.send({
                        status: 200,
                        msg: responseMessages.resetPass,
                        data: {},
                        purpose: purpose
                    })
                } else {
                    return res.send({
                        status: 500,
                        msg: responseMessages.serverError,
                        data: {},
                        purpose: purpose
                    })
                }
            } else {
                return res.send({
                    status: 404,
                    msg: responseMessages.invalidOTP,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (e) {
            console.log("Reset Password ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

/*
|------------------------------------------------ 
| API name          :  fetchUserDetails
| Response          :  Respective response message in JSON format
| Logic             :  Fetch User Details
| Request URL       :  BASE_URL/api/fetch-user-details
| Request method    :  GET
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.fetchUserDetails = (req, res) => {
    (async() => {
        let purpose = "Fetch User Details";
        try {
            let userID = req.headers.userID;

            let userCount = await userRepositories.count({ id: userID, is_active: 1 });
            let allDownloadCount = await userRepositories.downloadCount({ where: { user_id: userID } });
            let monthStartDate = moment().startOf('month').format('YYYY-MM-DD');
            let monthEndDate = moment().endOf('month').format('YYYY-MM-DD');
            let monthlyDownloadCount = await userRepositories.downloadCount({ where: { user_id: userID, createdAt: { $lte: monthEndDate, $gte: monthStartDate } } });

            if (userCount > 0) {
                let userDetails = await userRepositories.findOne({ id: userID });
                delete userDetails.password;
                delete userDetails.login_type;
                delete userDetails.otp;
                delete userDetails.otp_expire_time;
                delete userDetails.otp_status;
                delete userDetails.is_active;
                userDetails.downloadCount = {
                    allTime: allDownloadCount,
                    thisMonth: monthlyDownloadCount
                }

                return res.send({
                    status: 200,
                    msg: responseMessages.userDetailsFetch,
                    data: {
                        user_details: userDetails
                    },
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 500,
                    msg: responseMessages.userNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (err) {
            console.log("Fetch User Details ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

/*
|------------------------------------------------ 
| API name          :  updateUserName
| Response          :  Respective response message in JSON format
| Logic             :  Update User Name
| Request URL       :  BASE_URL/api/update-user-details
| Request method    :  PUT
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.updateUserName = (req, res) => {
    (async() => {
        let purpose = "Update User Name";
        try {
            let userID = req.headers.userID;

            let userCount = await userRepositories.count({ id: userID, is_active: 1 });

            if (userCount > 0) {
                await userRepositories.update({ id: userID }, { full_name: req.body.full_name });
                let userDetails = await userRepositories.findOne({ id: userID });
                delete userDetails.password;
                delete userDetails.login_type;
                delete userDetails.otp;
                delete userDetails.otp_expire_time;
                delete userDetails.otp_status;
                delete userDetails.is_active;

                return res.send({
                    status: 200,
                    msg: responseMessages.userDetailsUpdate,
                    data: {
                        user_details: userDetails
                    },
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 500,
                    msg: responseMessages.userNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (err) {
            console.log("Name Update ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

/*
|------------------------------------------------ 
| API name          :  updateProfilePicture
| Response          :  Respective response message in JSON format
| Logic             :  Update User Profile Picture
| Request URL       :  BASE_URL/api/update-user-picture
| Request method    :  PUT
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.updateProfilePicture = (req, res) => {
    (async() => {
        let purpose = "Update Profile Picture";
        try {
            let userID = req.headers.userID;

            let userCount = await userRepositories.count({ id: userID, is_active: 1 });

            if (userCount > 0) {
                await userRepositories.update({ id: userID }, { profile_image: `${global.constants.profile_photo_url}/${req.file.filename}` });
                let userDetails = await userRepositories.findOne({ id: userID });
                delete userDetails.password;
                delete userDetails.login_type;
                delete userDetails.otp;
                delete userDetails.otp_expire_time;
                delete userDetails.otp_status;
                delete userDetails.is_active;

                return res.send({
                    status: 200,
                    msg: responseMessages.userPictureUpdate,
                    data: {
                        user_details: userDetails
                    },
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 500,
                    msg: responseMessages.userNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (err) {
            console.log("Picture Update ERROR : ", err);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

/*
|------------------------------------------------ 
| API name          :  updateUserCountry
| Response          :  Respective response message in JSON format
| Logic             :  Update User Country
| Request URL       :  BASE_URL/api/update-user-country
| Request method    :  PUT
| Author            :  Abhisek Paul
|------------------------------------------------
*/
module.exports.updateUserCountry = (req, res) => {
    (async() => {
        let purpose = "Update User Country";
        try {
            let userID = req.headers.userID;

            let userCount = await userRepositories.count({ id: userID, is_active: 1 });

            if (userCount > 0) {
                await userRepositories.update({ id: userID }, { country_id: req.body.country_id });
                let userDetails = await userRepositories.findOne({ id: userID });
                delete userDetails.password;
                delete userDetails.login_type;
                delete userDetails.otp;
                delete userDetails.otp_expire_time;
                delete userDetails.otp_status;
                delete userDetails.is_active;

                return res.send({
                    status: 200,
                    msg: responseMessages.userCountryUpdate,
                    data: {
                        user_details: userDetails
                    },
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 500,
                    msg: responseMessages.userNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (err) {
            console.log("Country Update ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}