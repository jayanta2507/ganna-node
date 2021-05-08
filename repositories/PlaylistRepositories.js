const sequelize = require('../config/dbConfig').sequelize;
var DataTypes = require('sequelize/lib/data-types');
const PlaylistModel = require('../models/playlists')(sequelize, DataTypes);
const PlaylistSongsModel = require('../models/playlist_songs')(sequelize, DataTypes);
const SongsModel = require('../models/songs')(sequelize, DataTypes);
const FavouritesModel = require('../models/favourites')(sequelize, DataTypes);
SongsModel.hasMany(FavouritesModel, { foreignKey: 'file_id', as: 'is_favourite' });

PlaylistSongsModel.belongsTo(SongsModel, { foreignKey: 'file_id', as: 'song_details' })

// Create Playlist
module.exports.createPlaylist = (data) => {
    return new Promise((resolve, reject) => {
        PlaylistModel.create(data).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Create Playlist
module.exports.findOne = (where) => {
    return new Promise((resolve, reject) => {
        PlaylistModel.findOne({
            where: where
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Count
module.exports.count = (whereData) => {
    return new Promise((resolve, reject) => {
        PlaylistModel.count({
            where: whereData,
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

module.exports.playlistSongsCount = (where) => {
    return new Promise((resolve, reject) => {
        PlaylistSongsModel.count({
            where: where
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

module.exports.playlistSongsAdd = (data) => {
    return new Promise((resolve, reject) => {
        PlaylistSongsModel.create(data).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

module.exports.playlistList = (where, data) => {
    return new Promise((resolve, reject) => {
        PlaylistModel.findAndCountAll({
            where: where,
            attributes: ['id','name'],
            offset: data.offset,
            limit: data.limit,
            group: ['id']
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

module.exports.playlistSongs = (where, data) => {
    return new Promise((resolve, reject) => {
        PlaylistSongsModel.findAndCountAll({
            where: where,
            include: [
                {
                    model: SongsModel,
                    where: { is_active: 1 },
                    include: [
                        {
                            model: FavouritesModel,
                            where: { user_id: data.user_id },
                            as: 'is_favourite',
                            attributes: ['id'],
                            required:false
                        }
                    ],
                    as:'song_details',
                    attributes: ['id','name','cover_picture','length','file_name','details']
                }
            ],
            offset: data.offset,
            limit: data.limit,
            group: ['id']
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}