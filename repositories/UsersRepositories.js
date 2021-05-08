const sequelize = require('../config/dbConfig').sequelize;
var DataTypes = require('sequelize/lib/data-types');
const UsersModel = require('../models/users')(sequelize,DataTypes);
const CountryModel = require('../models/countries')(sequelize, DataTypes);
const DonwloadModel = require('../models/downloads')(sequelize, DataTypes);

// Associations
UsersModel.belongsTo(CountryModel, { foreignKey: 'country_id' });


// Count
module.exports.count = (whereData) => {
    return new Promise((resolve, reject) => {
        UsersModel.count(whereData).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Count
module.exports.downloadCount = (whereData) => {
    return new Promise((resolve, reject) => {
        DonwloadModel.count(whereData).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Find One
module.exports.findOne = (whereData) => {
    return new Promise((resolve, reject) => {
        UsersModel.findOne({
            where: whereData,
            include: [
                {
                    model: CountryModel,
                }
            ]
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Create 
module.exports.create = (data, t=null) => {
    return new Promise((resolve, reject)=>{
        let options = {}
        //if trunsaction exist
        if (t != null) options.transaction = t;
        UsersModel.create(data, options)
        .then((result) => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        })
        .catch((err) => {
            reject(err);
        });
    })
}

// Update
module.exports.update = (where, data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
            where: where
        }
        //if trunsaction exist
        if (t != null) options.transaction = t;
        UsersModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}