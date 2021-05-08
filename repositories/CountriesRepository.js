const sequelize = require('../config/dbConfig').sequelize;
var DataTypes = require('sequelize/lib/data-types');
const CountryModel = require('../models/countries')(sequelize,DataTypes);

// Find One
module.exports.findAll = (whereData) => {
    return new Promise((resolve, reject) => {
        CountryModel.findAll({
            where: whereData,
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}