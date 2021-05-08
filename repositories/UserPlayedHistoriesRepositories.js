const sequelize = require('../config/dbConfig').sequelize;
var DataTypes = require('sequelize/lib/data-types');
const PlayedHistoryModel = require('../models/user_played_histories')(sequelize, DataTypes);
const SongsModel = require('../models/songs')(sequelize, DataTypes);
const ArtistModel = require('../models/artists')(sequelize, DataTypes);
const GenresModel = require('../models/genres')(sequelize, DataTypes);
const AlbumsModel = require('../models/albums')(sequelize, DataTypes);
const FavouritesModel = require('../models/favourites')(sequelize, DataTypes);

SongsModel.hasMany(FavouritesModel, { foreignKey: 'file_id', as: 'is_favourite' });
PlayedHistoryModel.belongsTo(SongsModel, { foreignKey: 'file_id', as: 'song_details' });
SongsModel.belongsTo(ArtistModel, { foreignKey: 'artist_id', as: 'artist_details' });
SongsModel.belongsTo(GenresModel, { foreignKey: 'genre_id', as: 'genre_details' });
SongsModel.belongsTo(AlbumsModel, { foreignKey: 'album_id', as: 'album_details' });

module.exports.allRecentlyPlayed = (where, data) => {
    return new Promise((resolve, reject) => {
        PlayedHistoryModel.findAndCountAll({
            where: where,
            order: [
                ['updatedAt', 'desc']
            ],
            include: [{
                model: SongsModel,
                where: { is_active: 1 },
                attributes: ['id', 'name', 'cover_picture', 'file_name', 'length', 'is_paid', 'type', 'artist_id', 'genre_id', 'album_id', 'country_id', 'is_paid', 'createdAt', 'updatedAt'],
                include: [{
                        model: ArtistModel,
                        as: 'artist_details',
                        attributes: ['id', 'full_name', 'profile_image', 'type']
                    },
                    {
                        model: GenresModel,
                        as: 'genre_details',
                        attributes: ['id', 'name']
                    },
                    {
                        model: AlbumsModel,
                        as: 'album_details',
                        attributes: ['id', 'name', 'cover_picture', 'total_songs']
                    },
                    {
                        model: FavouritesModel,
                        where: { user_id: data.user_id },
                        as: 'is_favourite',
                        attributes: ['id'],
                        required: false
                    }
                ],
                as: 'song_details',
                required: true
            }],
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

module.exports.recentlyPlayed = (where, data) => {
    return new Promise((resolve, reject) => {
        PlayedHistoryModel.findAll({
            where: where,
            order: [
                ['updatedAt', 'desc']
            ],
            include: [{
                model: SongsModel,
                where: { is_active: 1 },
                attributes: ['id', 'name', 'cover_picture', 'file_name', 'length', 'is_paid', 'type', 'artist_id', 'genre_id', 'album_id', 'country_id', 'is_paid', 'createdAt', 'updatedAt'],
                include: [{
                        model: ArtistModel,
                        as: 'artist_details',
                        attributes: ['id', 'full_name', 'profile_image', 'type']
                    },
                    {
                        model: GenresModel,
                        as: 'genre_details',
                        attributes: ['id', 'name']
                    },
                    {
                        model: AlbumsModel,
                        as: 'album_details',
                        attributes: ['id', 'name', 'cover_picture', 'total_songs']
                    },
                    {
                        model: FavouritesModel,
                        where: { user_id: data.user_id },
                        as: 'is_favourite',
                        attributes: ['id'],
                        required: false
                    }
                ],
                as: 'song_details',
                required: true
            }],
            limit: data.limit,
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

module.exports.recentlyPlayedAllData = (where, data) => {
    return new Promise((resolve, reject) => {
        PlayedHistoryModel.findAll({
            where: where,
            order: [
                ['updatedAt', 'desc']
            ],
            include: [{
                model: SongsModel,
                where: { is_active: 1 },
                attributes: ['id', 'name', 'cover_picture', 'file_name', 'length', 'is_paid', 'type', 'artist_id', 'genre_id', 'album_id', 'country_id', 'is_paid', 'createdAt', 'updatedAt'],
                include: [{
                        model: ArtistModel,
                        as: 'artist_details',
                        attributes: ['id', 'full_name', 'profile_image', 'type']
                    },
                    {
                        model: GenresModel,
                        as: 'genre_details',
                        attributes: ['id', 'name']
                    },
                    {
                        model: AlbumsModel,
                        as: 'album_details',
                        attributes: ['id', 'name', 'cover_picture', 'total_songs']
                    },
                    {
                        model: FavouritesModel,
                        where: { user_id: where.user_id },
                        as: 'is_favourite',
                        attributes: ['id'],
                        required: false
                    }
                ],
                as: 'song_details',
                required: true
            }],
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Count
module.exports.findOne = (whereData) => {
    return new Promise((resolve, reject) => {
        PlayedHistoryModel.findOne({
            where: whereData,
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Delete
module.exports.destroy = (where, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
            //if trunsaction exist
        if (t != null) options.transaction = t;
        PlayedHistoryModel.destroy(options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
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
        PlayedHistoryModel.update(data, options).then((result) => {
            console.log("RES : ", result);
            resolve(result)
        }).catch((err) => {
            console.log("ERR : ", err);
            reject(err);
        })
    })
}

module.exports.updateNew = (where, data) => {
    return new Promise((resolve, reject)=>{
        // PlayedHistoryModel.changed('updatedAt', true);
        PlayedHistoryModel.update(data, { where: where, silent: true }).then((result) => {
            console.log("RES 1 : ", result);
            resolve(result)
        }).catch((err) => {
            console.log("ERR 1 : ", err);
            reject(err);
        })
    })
}

// Create
module.exports.create = (data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {}
            //if trunsaction exist
        if (t != null) options.transaction = t;
        PlayedHistoryModel.create(data).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}

// Count
module.exports.count = (whereData) => {
    return new Promise((resolve, reject) => {
        PlayedHistoryModel.count({
            where: whereData,
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}