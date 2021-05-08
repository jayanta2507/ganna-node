const jwt = require('jsonwebtoken');
const responseMessages = require('../ResponseMessages');

// ################################ Repositories ################################ //
const userRepositories = require('../repositories/UsersRepositories');
const artistRepositories = require('../repositories/ArtistsRepositories');
const adminRepositories = require('../repositories/AdminRepositories');

// ################################ Globals ################################ //
const jwtOptionsAccess = global.constants.jwtAccessTokenOptions;

//User Authentication
module.exports.authenticateRequestAPI = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            let accessToken = req.headers.authorization.split(' ')[1];
            jwt.verify(accessToken, jwtOptionsAccess.secret, async (err, decodedToken) => {
                if (err) {
                    return res.json({
                        status: 401,
                        msg: responseMessages.authFailure,
                    })
                }
                else {
                    let userCount = await userRepositories.count({ where: { id: decodedToken.user_id } });
                    
                    if(userCount > 0) {
                        req.headers.userID = decodedToken.user_id;
                        next();
                    }
                    else{
                        return res.json({
                            status: 401,
                            msg: responseMessages.authFailure,
                        })
                    }
                }
            });
        }
        else {
            return res.json({
                status: 401,
                msg: responseMessages.authRequired
            })
        }
    }
    catch (e) {
        console.log("Middleware Error : ", e);
        res.json({
            status: 500,
            message: responseMessages.serverError,
        })
    }
}

// Artist Authentication
module.exports.authenticateArtistRequestAPI = async (req, res, next) => {
    try{
        if (req.headers.authorization) {
            let accessToken = req.headers.authorization.split(' ')[1];
            jwt.verify(accessToken, jwtOptionsAccess.secret, async (err, decodedToken) => {
                if (err) {
                    return res.status(401).json({
                        status: 401,
                        msg: responseMessages.authFailure,
                    })
                }
                else {
                    let userCount = await artistRepositories.count({ where: { id: decodedToken.user_id } });
                    
                    if(userCount > 0) {
                        req.headers.userID = decodedToken.user_id;
                        next();
                    }
                    else{
                        return res.status(401).json({
                            status: 401,
                            msg: responseMessages.authFailure,
                        })
                    }
                }
            });
        }
        else {
            return res.status(401).json({
                status: 401,
                msg: responseMessages.authRequired
            })
        }
    }
    catch(err) {
        console.log("Artist Middleware Error : ", e);
        res.status(500).json({
            status: 500,
            msg: responseMessages.serverError,
        })
    }
}

// Admin Authentication
module.exports.authenticateAdminRequestAPI = async (req, res, next) => {
    try{
        if (req.headers.authorization) {
            let accessToken = req.headers.authorization.split(' ')[1];
            jwt.verify(accessToken, jwtOptionsAccess.secret, async (err, decodedToken) => {
                if (err) {
                    return res.status(401).json({
                        status: 401,
                        msg: responseMessages.authFailure,
                    })
                }
                else {
                    let userCount = await adminRepositories.countAdmin({ id: decodedToken.user_id } );
                    
                    if(userCount > 0) {
                        req.headers.userID = decodedToken.user_id;
                        next();
                    }
                    else{
                        return res.status(401).json({
                            status: 401,
                            msg: responseMessages.authFailure,
                        })
                    }
                }
            });
        }
        else {
            return res.status(401).json({
                status: 401,
                msg: responseMessages.authRequired
            })
        }
    }
    catch(err) {
        console.log("Artist Middleware Error : ", e);
        res.status(500).json({
            status: 500,
            msg: responseMessages.serverError,
        })
    }
}