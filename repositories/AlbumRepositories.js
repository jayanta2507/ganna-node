const sequelize = require('../config/dbConfig').sequelize;
var DataTypes = require('sequelize/lib/data-types');
const AlbumModel = require('../models/albums')(sequelize, DataTypes);
const ArtistModel = require('../models/artists')(sequelize, DataTypes);

AlbumModel.belongsTo(ArtistModel, { foreignKey: 'artist_id' })

// Find All
module.exports.findAll = (where, data) => {
    return new Promise((resolve, reject) => {
        AlbumModel.findAll({
            where: where,
            order: [
                ['createdAt', 'desc']
            ],
            limit: data.limit,
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// List Albums
module.exports.listAlbums = (where, data) => {
    return new Promise((resolve, reject) => {
        AlbumModel.findAndCountAll({
            where: where,
            include: [
                {
                    model: ArtistModel,
                    attributes: ['full_name']
                }
            ],
            offset: data.offset,
            limit: data.limit,
            order: data.order,
            group: ['id'],
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Count
module.exports.count = (where) => {
    return new Promise((resolve, reject) => {
        AlbumModel.count({
            where: where,
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Find One
module.exports.findOne = (where) => {
    return new Promise((resolve, reject) => {
        AlbumModel.findOne({
            where: where,
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

module.exports.artistDetails = (where) => {
    return new Promise((resolve, reject) => {
        AlbumModel.findOne({
            where: where,
            include: [
                {
                    model: ArtistModel,
                    attributes: ['full_name']
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

// Find And Count All
module.exports.findAndCountAll = (where, data) => {
    return new Promise((resolve, reject) => {
        AlbumModel.findAndCountAll({
            where: where,
            order: [
                ['createdAt', 'desc']
            ],
            limit: data.limit,
            offset: data.offset,
            group: ['id']
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

module.exports.createAlbum = (data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {}
            //if trunsaction exist
        if (t != null) options.transaction = t;
        AlbumModel.create(data, options)
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
        AlbumModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}

// Update
module.exports.delete = (where, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
            //if trunsaction exist
        if (t != null) options.transaction = t;
        AlbumModel.destroy(options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}