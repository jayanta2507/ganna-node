/*!
 * CommonController.js
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
const countryRepository = require('../../repositories/CountriesRepository');

// ################################ Response Messages ################################ //
const responseMessages = require('../../ResponseMessages');

/*
|------------------------------------------------ 
| API name          :  fetchCountries
| Response          :  Respective response message in JSON format
| Logic             :  Fetch Countries
| Request URL       :  BASE_URL/api/countries
| Request method    :  GET
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.fetchCountries = (req, res) => {
    (async() => {
        let purpose = "Fetch Countries";
        try {
            let whereData = { is_active: { $in: [0, 1] } };
            let countriesData = await countryRepository.findAll(whereData);

            let data = {
                countries: countriesData
            }

            return res.send({
                status: 200,
                msg: responseMessages.countryFetch,
                data: data,
                purpose: purpose
            })
        } catch (e) {
            console.log("Fetch Countries Error : ", e);
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
| API name          :  fetchActiveCountries
| Response          :  Respective response message in JSON format
| Logic             :  Fetch Active Countries
| Request URL       :  BASE_URL/api/active-countries
| Request method    :  GET
| Author            :  Suman Rana
|------------------------------------------------
*/
module.exports.fetchActiveCountries = (req, res) => {
    (async() => {
        let purpose = "Fetch Active Countries";
        try {
            let whereData = { is_active: 1 };
            let countriesData = await countryRepository.findAll(whereData);

            let data = {
                countries: countriesData
            }

            return res.send({
                status: 200,
                msg: responseMessages.countryFetch,
                data: data,
                purpose: purpose
            })
        } catch (e) {
            console.log("Fetch Active Countries Error : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}