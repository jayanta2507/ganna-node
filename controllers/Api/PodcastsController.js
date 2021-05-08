/*!
 * PodcastsController.js
 * Containing all the controller actions related to `PODCASTS`
 * Author: Suman Rana
 * Date: 7th May, 2021`
 * MIT Licensed
 */
/**
 * Module dependencies.
 * @private
 */

// ################################ Repositories ################################ //
const podcastRepository = require('../../repositories/PodcastRepositories');
const artistRepositories = require('../../repositories/ArtistsRepositories');
const userRepositories = require('../../repositories/UsersRepositories');
const userPlayedHistoryRepo = require('../../repositories/UserPlayedHistoriesRepositories');

// ################################ Sequelize ################################ //
const sequelize = require('../../config/dbConfig').sequelize;

// ################################ Response Messages ################################ //
const responseMessages = require('../../ResponseMessages');

// ################################ Common Function ################################ //
// const commonFunction = require('../../helpers/commonFunctions');

// ################################ NPM Packages ################################ //
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const moment = require('moment');

// ################################ Globals ################################ //
const jwtOptionsAccess = global.constants.jwtAccessTokenOptions;
const jwtOptionsRefresh = global.constants.jwtRefreshTokenOptions;

module.exports.podcastHomepage = (req, res) => {
    (async()=>{
        let purpose = "Podcast Homepage";
        try {
            let whereCategory = {
                where: { is_active: 1 },
                order: [['createdAt','desc']]
            };
            let podcastCategories = await podcastRepository.findAllPodcastCategory(whereCategory);
            podcastCategories.unshift(
                {
                    "id": 0,
                    "name": "All",
                    "is_active": 1,
                }
            )

            let dataResp = {
                categories: podcastCategories
            }

            return res.send({
                status: 200,
                msg: responseMessages.homeFetch,
                data: dataResp,
                purpose: purpose
            })
        }
        catch(err) {
            console.log("Podcast Homepage Error : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}