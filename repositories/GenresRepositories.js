const sequelize = require('../config/dbConfig').sequelize;
var DataTypes = require('sequelize/lib/data-types');
const GenresModel = require('../models/genres')(sequelize,DataTypes);

// Find All
module.exports.findAll = (whereData) => {
    return new Promise((resolve, reject) => {
        GenresModel.findAll(whereData).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}