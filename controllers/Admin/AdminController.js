/*!
 * AdminController.js
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
const adminRepositories = require('../../repositories/AdminRepositories');
const artistRepositories = require('../../repositories/ArtistsRepositories');

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
| API name          :  userLogin
| Response          :  Respective response message in JSON format
| Logic             :  User Login
| Request URL       :  BASE_URL/admin/login
| Request method    :  POST
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.adminLogin = (req, res) => {
    (async() => {
        let purpose = "Admin Login";
        try {
            let body = req.body;
            let whereData = {
                email: body.email,
                password: md5(body.password),
                is_active: 1
            }
            let userData = await adminRepositories.findOne(whereData);

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

                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.loginSuccess,
                    data: userData,
                    purpose: purpose
                })
            } else {
                return res.status(403).send({
                    status: 403,
                    msg: responseMessages.invalidCreds,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (e) {
            console.log("User Login ERROR : ", e);
            return res.status(500).send({
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
| API name          :  addCountry
| Response          :  Respective response message in JSON format
| Logic             :  Add Country
| Request URL       :  BASE_URL/admin/country-add
| Request method    :  POST
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.addCountry = (req, res) => {
    (async() => {
        let purpose = "Add Country";
        try {
            let body = req.body;
            let countryCount = await adminRepositories.countCountry({ country_code: body.country_code.toUpperCase() });

            if (countryCount > 0) {
                return res.status(409).send({
                    status: 409,
                    msg: responseMessages.duplicateCountry,
                    data: {},
                    purpose: purpose
                })
            } else {
                let createData = {
                    name: body.name,
                    country_code: body.country_code.toUpperCase(),
                    telephone_code: body.telephone_code
                }

                let countryDet = await adminRepositories.addCountry(createData);
                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.countryAdd,
                    data: countryDet,
                    purpose: purpose
                })
            }
        } catch (err) {
            console.log("Add Country ERROR : ", err);
            return res.status(500).send({
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
| API name          :  listCountry
| Response          :  Respective response message in JSON format
| Logic             :  Fetch Country List
| Request URL       :  BASE_URL/admin/country-list
| Request method    :  GET
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.listCountry = (req, res) => {
    (async() => {
        let purpose = "List Country";
        try {
            let queryParam = req.query;
            let where = {};
            let data = {};
            let page = queryParam.page ? parseInt(queryParam.page) : 1;
            data.limit = 20;
            data.offset = data.limit ? data.limit * (page - 1) : null;
            data.order = [];

            if (queryParam.sortKey && queryParam.sortType) {
                data.order = [
                    [queryParam.sortKey, queryParam.sortType.toUpperCase()]
                ];
            } else {
                data.order = [
                    ['is_active', 'DESC'],
                    ['id', 'DESC']
                ]
            }

            if (queryParam.search) {
                where.name = { $like: `%${queryParam.search}%` };
            }

            let countryList = await adminRepositories.listCountry(where, data);
            let dataResp = {
                country_list: countryList.rows,
                total_count: countryList.count.length
            }
            return res.status(200).send({
                status: 200,
                msg: responseMessages.countryList,
                data: dataResp,
                purpose: purpose
            })
        } catch (err) {
            console.log("List Country ERROR : ", err);
            return res.status(500).send({
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
| API name          :  statusChangeCountry
| Response          :  Respective response message in JSON format
| Logic             :  Country Status Change
| Request URL       :  BASE_URL/admin/country-status-change/<< Country ID >>
| Request method    :  PUT
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.statusChangeCountry = (req, res) => {
    (async() => {
        let purpose = "Country Status Change";
        try {
            let countryID = req.params.id;

            let countryDetails = await adminRepositories.fetchCountry({ id: countryID });

            if (countryDetails) {
                let updateData = {};
                if (countryDetails.is_active == 1) updateData.is_active = 0;
                else updateData.is_active = 1;

                await adminRepositories.updateCountry({ id: countryID }, updateData);

                let respData = await adminRepositories.fetchCountry({ id: countryID });

                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.countryUpdate,
                    data: {
                        country_details: respData
                    },
                    purpose: purpose
                })

            } else {
                return res.status(404).send({
                    status: 404,
                    msg: responseMessages.countryNoyFound,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (err) {
            console.log("Country Status Change ERROR : ", err);
            return res.status(500).send({
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
| API name          :  addGenre
| Response          :  Respective response message in JSON format
| Logic             :  Add Genre
| Request URL       :  BASE_URL/admin/genre-add
| Request method    :  POST
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.addGenre = (req, res) => {
    (async() => {
        let purpose = "Add Genre";
        try {
            let body = req.body;
            let genreCount = await adminRepositories.countGenre({ name: body.name });

            if (genreCount > 0) {
                return res.status(409).send({
                    status: 409,
                    msg: responseMessages.duplicateGenre,
                    data: {},
                    purpose: purpose
                })
            } else {
                let createData = {
                    name: body.name,
                }

                let genreDet = await adminRepositories.addGenre(createData);

                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.genreAdd,
                    data: genreDet,
                    purpose: purpose
                })
            }
        } catch (err) {
            console.log("Add Genre ERROR : ", err);
            return res.status(500).send({
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
| API name          :  listGenre
| Response          :  Respective response message in JSON format
| Logic             :  Fetch Genre List
| Request URL       :  BASE_URL/admin/genre-list
| Request method    :  GET
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.listGenre = (req, res) => {
    (async() => {
        let purpose = "List Genre";
        try {
            let queryParam = req.query;
            let where = {};
            let data = {};
            let page = queryParam.page ? parseInt(queryParam.page) : 1;
            data.limit = 20;
            data.offset = data.limit ? data.limit * (page - 1) : null;

            if (queryParam.search) {
                where.name = { $like: `%${queryParam.search}%` };
            }

            let genreList = await adminRepositories.listGenre(where, data);
            let dataResp = {
                genre_list: genreList.rows,
                total_count: genreList.count.length
            }
            return res.status(200).send({
                status: 200,
                msg: responseMessages.genreList,
                data: dataResp,
                purpose: purpose
            })
        } catch (err) {
            console.log("List Genre ERROR : ", err);
            return res.status(500).send({
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
| API name          :  deleteGenre
| Response          :  Respective response message in JSON format
| Logic             :  Delete Genre
| Request URL       :  BASE_URL/admin/delete-genre/<< Genre ID >>
| Request method    :  DELETE
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.deleteGenre = (req, res) => {
    (async() => {
        let purpose = "Delete Genre";
        try {
            let genreID = req.params.id;

            let genreCount = await adminRepositories.countGenre({ id: genreID });

            if (genreCount > 0) {
                await adminRepositories.deleteGenre({ id: genreID })

                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.genreDelete,
                    data: {},
                    purpose: purpose
                })

            } else {
                return res.status(404).send({
                    status: 404,
                    msg: responseMessages.genreNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (err) {
            console.log("Delete Genre ERROR : ", err);
            return res.status(500).send({
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
| API name          :  artistList
| Response          :  Respective response message in JSON format
| Logic             :  Fetch Artist List
| Request URL       :  BASE_URL/admin/genre-list
| Request method    :  GET
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.listArtists = (req, res) => {
    (async() => {
        let purpose = "Artists List"
        try {
            let queryParam = req.query;
            let where = {};
            let data = {};
            let page = queryParam.page ? parseInt(queryParam.page) : 1;
            data.limit = 20;
            data.offset = data.limit ? data.limit * (page - 1) : null;

            if (queryParam.search) {
                where.full_name = { $like: `%${queryParam.search}%` };
            }

            let artistList = await artistRepositories.artistListAdmin(where, data);

            return res.status(200).json({
                status: 200,
                msg: responseMessages.artistListAdmin,
                data: {
                    artistList: artistList.rows,
                    totalCount: artistList.count.length
                },
                purpose: purpose
            })
        } catch (err) {
            console.log("Artists List ERROR : ", err);
            return res.status(500).send({
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
| API name          :  artistDetails
| Response          :  Respective response message in JSON format
| Logic             :  Fetch Artist Details
| Request URL       :  BASE_URL/admin/artist-details/<< Artist ID >>
| Request method    :  GET
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.artistDetails = (req, res) => {
    (async() => {
        let purpose = "Artist Details"
        try {
            let artistID = req.params.id;

            let artistCount = await artistRepositories.count({ id: artistID });
            if (artistCount > 0) {
                let artistDetails = await artistRepositories.artistDetailsAdmin({ id: artistID });

                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.artistDetailsFetch,
                    data: {
                        artist_details: artistDetails
                    },
                    purpose: purpose
                })
            } else {
                return res.status(404).send({
                    status: 404,
                    msg: responseMessages.artistNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (err) {
            console.log("Artist Details ERROR : ", err);
            return res.status(500).send({
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
| API name          :  verifyArtist
| Response          :  Respective response message in JSON format
| Logic             :  Verify Artist
| Request URL       :  BASE_URL/admin/artist-verify/<< Artist ID >>
| Request method    :  PUT
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.verifyArtist = (req, res) => {
    (async() => {
        let purpose = "Verify Artist";
        try {
            let artistID = req.params.id;

            let artistCount = await artistRepositories.count({ id: artistID });

            if (artistCount > 0) {
                let artistDetails = await artistRepositories.artistDetailsAdmin({ id: artistID });

                let updateData = {};
                updateData.is_active = !artistDetails.is_active;

                await artistRepositories.updateArtist({ id: artistID }, updateData);

                let msg = '';
                if (artistDetails.is_active == 0) msg = 'Artist verified successfully';
                else msg = 'Artist unverified successfully';

                return res.status(200).send({
                    status: 200,
                    msg: msg,
                    data: {},
                    purpose: purpose
                })
            } else {
                return res.status(404).send({
                    status: 404,
                    msg: responseMessages.artistNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (err) {
            console.log("Verify Artist ERROR : ", err);
            return res.status(500).send({
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
| API name          :  addPodcastCategory
| Response          :  Respective response message in JSON format
| Logic             :  Add Podcast Category
| Request URL       :  BASE_URL/admin/poscast-category-add
| Request method    :  POST
| Author            :  Abhisek Paul
|------------------------------------------------
*/
module.exports.addPodcastCategory = (req, res) => {
    (async() => {
        let purpose = "Add Podcast Category";
        try {
            let body = req.body;
            let genreCount = await adminRepositories.countPodcastCategory({ name: body.name });

            if (genreCount > 0) {
                return res.status(409).send({
                    status: 409,
                    msg: responseMessages.duplicatePodcastcategory,
                    data: {},
                    purpose: purpose
                })
            } else {
                let createData = {
                    name: body.name,
                }

                let podcastCatDet = await adminRepositories.addPodcastCategory(createData);

                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.podcastcategoryAdd,
                    data: podcastCatDet,
                    purpose: purpose
                })
            }
        } catch (err) {
            console.log("Add Podcast Category ERROR : ", err);
            return res.status(500).send({
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
| API name          :  listPodcastCategory
| Response          :  Respective response message in JSON format
| Logic             :  Fetch Podcast Category List
| Request URL       :  BASE_URL/admin/poscast-category-list
| Request method    :  GET
| Author            :  Abhisek Paul
|------------------------------------------------
*/
module.exports.listPodcastCategory = (req, res) => {
    (async() => {
        let purpose = "List Podcast Category";
        try {
            let queryParam = req.query;
            let where = {};
            let data = {};
            let page = queryParam.page ? parseInt(queryParam.page) : 1;
            data.limit = 20;
            data.offset = data.limit ? data.limit * (page - 1) : null;

            if (queryParam.search) {
                where.name = { $like: `%${queryParam.search}%` };
            }

            let podcastCategoryList = await adminRepositories.listPodcastCategory(where, data);
            let dataResp = {
                podcast_category_list: podcastCategoryList.rows,
                total_count: podcastCategoryList.count.length
            }
            return res.status(200).send({
                status: 200,
                msg: responseMessages.podcastcategoryList,
                data: dataResp,
                purpose: purpose
            })
        } catch (err) {
            console.log("List Podcast Category ERROR : ", err);
            return res.status(500).send({
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
| API name          :  deletePodcastCategory
| Response          :  Respective response message in JSON format
| Logic             :  Delete Podcast Category
| Request URL       :  BASE_URL/admin/delete-podcast-category/<< Category ID >>
| Request method    :  DELETE
| Author            :  Abhisek Paul
|------------------------------------------------
*/
module.exports.deletePodcastCategory = (req, res) => {
    (async() => {
        let purpose = "Delete Podcast Category";
        try {
            let genreID = req.params.id;

            let genreCount = await adminRepositories.countPodcastCategory({ id: genreID });

            if (genreCount > 0) {
                await adminRepositories.deletePodcastCategory({ id: genreID })

                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.podcastCategoryDelete,
                    data: {},
                    purpose: purpose
                })

            } else {
                return res.status(404).send({
                    status: 404,
                    msg: responseMessages.podcastNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (err) {
            console.log("Delete Podcast Category ERROR : ", err);
            return res.status(500).send({
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
| API name          :  acceptArtist
| Response          :  Respective response message in JSON format
| Logic             :  Accept Artist
| Request URL       :  BASE_URL/admin/accept-artist/<< Artist ID >>
| Request method    :  PUT
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.acceptArtist = (req, res) => {
    (async() => {
        let purpose = "Approve Artist";
        try {
            let artistID = req.params.id;

            let artistCount = await artistRepositories.count({ id: artistID });

            if (artistCount > 0) {
                await artistRepositories.artistDetailsAdmin({ id: artistID });

                let updateData = {};
                updateData.is_active = 1;

                await artistRepositories.updateArtist({ id: artistID }, updateData);
                let artistDetails = await artistRepositories.findOne({ id: artistID });

                let mailData = {
                    toEmail: artistDetails.email,
                    subject: 'Account has been accepted',
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
                        <p style="font-size:17px; font-weight:500; color:#000; line-height:24px;">Hi ${artistDetails.full_name},</p>
                        <p style="font-size:17px; font-weight:500; color:#000; line-height:24px; margin-top: 20px;">Your artist account has been accepted by admin.</p>
                        <p style="font-size:17px; font-weight:500; color:#000; line-height:24px; margin-top: 20px;">Thanks for your time.</p>
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


                let msg = 'Artist approved successfully';

                return res.status(200).send({
                    status: 200,
                    msg: msg,
                    data: {},
                    purpose: purpose
                })
            } else {
                return res.status(404).send({
                    status: 404,
                    msg: responseMessages.artistNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (err) {
            console.log("Approve Artist ERROR : ", err);
            return res.status(500).send({
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
| API name          :  declineArtist
| Response          :  Respective response message in JSON format
| Logic             :  Decline Artist
| Request URL       :  BASE_URL/admin/decline-artist/<< Artist ID >>
| Request method    :  PUT
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.declineArtist = (req, res) => {
    (async() => {
        let purpose = "Decline Artist";
        try {
            let artistID = req.params.id;

            let artistCount = await artistRepositories.count({ id: artistID });

            if (artistCount > 0) {
                await artistRepositories.artistDetailsAdmin({ id: artistID });

                let updateData = {};
                updateData.is_active = 2;
                updateData.declined_reason = req.body.declined_reason;

                await artistRepositories.updateArtist({ id: artistID }, updateData);
                let artistDetails = await artistRepositories.findOne({ id: artistID });

                let mailData = {
                    toEmail: artistDetails.email,
                    subject: 'Account has been declined',
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
                        <p style="font-size:17px; font-weight:500; color:#000; line-height:24px;">Hi ${artistDetails.full_name},</p>
                        <p style="font-size:17px; font-weight:500; color:#000; line-height:24px; margin-top: 20px;">Your artist account has been declined for <strong style="font-size:20px; color:#ff301e;"> ${artistDetails.declined_reason}</strong></p>
                        <p style="font-size:17px; font-weight:500; color:#000; line-height:24px; margin-top: 20px;">Thanks for your time, Please contact the administrator to approve your account</p>
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

                let msg = 'Artist declined successfully';

                return res.status(200).send({
                    status: 200,
                    msg: msg,
                    data: {},
                    purpose: purpose
                })
            } else {
                return res.status(404).send({
                    status: 404,
                    msg: responseMessages.artistNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (err) {
            console.log("Verify Artist ERROR : ", err);
            return res.status(500).send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}