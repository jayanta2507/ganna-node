const sequelize = require('../config/dbConfig').sequelize;
var DataTypes = require('sequelize/lib/data-types');
const ArtistModel = require('../models/artists')(sequelize, DataTypes);
const CountryModel = require('../models/countries')(sequelize, DataTypes);
const SongsModel = require('../models/songs')(sequelize, DataTypes);
const GenresModel = require('../models/genres')(sequelize, DataTypes);
const AlbumsModel = require('../models/albums')(sequelize, DataTypes);
const FavouritesModel = require('../models/favourites')(sequelize, DataTypes);
const FollowedArtistsModel = require('../models/followed_artists')(sequelize, DataTypes);
const ArtistDetailsModel = require('../models/artist_details')(sequelize, DataTypes);
const PodcastCategoryModel = require('../models/podcast_categories')(sequelize, DataTypes);
const AlbumCategoryModel  = require('../models/album_categories')(sequelize, DataTypes);
const SongCategoryModel  = require('../models/song_categories')(sequelize, DataTypes);
const commonService = require('../helpers/commonFunctions');
const _ = require('lodash');

// Associations
ArtistModel.belongsTo(CountryModel, { foreignKey: 'country_id' });
SongsModel.belongsTo(ArtistModel, { foreignKey: 'artist_id', as: 'artist_details' });
SongsModel.belongsTo(GenresModel, { foreignKey: 'genre_id', as: 'genre_details' });
SongsModel.belongsTo(AlbumsModel, { foreignKey: 'album_id', as: 'album_details' });
SongsModel.hasOne(FavouritesModel, { foreignKey: 'file_id', as: 'is_favourite' });
ArtistModel.hasOne(FollowedArtistsModel, { foreignKey: 'artist_id', as: 'is_followed' });
ArtistModel.hasOne(ArtistDetailsModel, { foreignKey: 'artist_id', as: 'artist_account_details' });
ArtistDetailsModel.belongsTo(GenresModel, { foreignKey: 'sample_song_type', as: 'sample_song_type_details' });
ArtistDetailsModel.belongsTo(AlbumsModel, { foreignKey: 'sample_song_album', as: 'sample_song_album_details' });
ArtistDetailsModel.belongsTo(CountryModel, { foreignKey: 'bank_country', as: 'country_details' });


// Count
module.exports.count = (whereData) => {
    return new Promise((resolve, reject) => {
        ArtistModel.count(whereData).then(result => {
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
        ArtistModel.findOne({
            where: whereData,
            include: [{
                model: CountryModel,
            }]
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Artist Details
module.exports.artistDetails = (whereData, data) => {
    return new Promise((resolve, reject) => {
        ArtistModel.findOne({
            where: whereData,
            attributes: ['id','full_name','profile_image','country_id', 'is_active'],
            include: [
                {
                    model: FollowedArtistsModel,
                    as: 'is_followed',
                    where: { user_id: data.user_id },
                    required: false
                },
                {
                    model: ArtistDetailsModel,
                    as: 'artist_account_details',
                    include: [
                        {
                            model: GenresModel,
                            as: 'sample_song_type_details'
                        },
                        {
                            model: AlbumsModel,
                            as: 'sample_song_album_details'
                        }
                    ],
                    required: false
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

// Artist Details Admin
module.exports.artistDetailsAdmin = (whereData, data) => {
    return new Promise((resolve, reject) => {
        ArtistModel.findOne({
            where: whereData,
            attributes: ['id','full_name','email','mobile_no','dob','login_type','is_active','current_reg_step','reg_steps_completed','profile_image','country_id'],
            include: [
                {
                    model: ArtistDetailsModel,
                    as: 'artist_account_details',
                    include: [
                        {
                            model: CountryModel,
                            as: 'country_details'
                        },  
                        {
                            model: GenresModel,
                            as: 'sample_song_type_details'
                        },
                        {
                            model: AlbumsModel,
                            as: 'sample_song_album_details'
                        }
                    ],
                    required: false
                },
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
module.exports.create = (data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {}
            //if trunsaction exist
        if (t != null) options.transaction = t;
        ArtistModel.create(data, options)
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
        ArtistModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}

// Delete Artist Details
module.exports.deleteArtistDetails = (where, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
            //if trunsaction exist
        if (t != null) options.transaction = t;
        ArtistDetailsModel.destroy(options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}

// Count Artist Details
module.exports.countArtistDetails = (where, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
            //if trunsaction exist
        if (t != null) options.transaction = t;
        ArtistDetailsModel.count(options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}

// Create Artist Details
module.exports.createArtistDetails = (data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {}
            //if trunsaction exist
        if (t != null) options.transaction = t;
        ArtistDetailsModel.create(data, options)
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
module.exports.updateArtist = (where, data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
            //if trunsaction exist
        if (t != null) options.transaction = t;
        ArtistModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}

// Update
module.exports.updateArtistDetails = (where, data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
            //if trunsaction exist
        if (t != null) options.transaction = t;
        ArtistDetailsModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}

// Find All
module.exports.findAll = (whereData) => {
    return new Promise((resolve, reject) => {
        ArtistModel.findAll({
            where: whereData,
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Find All
module.exports.artistList = (whereData) => {
    return new Promise((resolve, reject) => {
        ArtistModel.findAll({
            where: whereData,
            attributes: ['id','full_name','profile_image']
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Find All
module.exports.artistListPaginate = (whereData, data) => {
    return new Promise((resolve, reject) => {
        ArtistModel.findAndCountAll({
            where: whereData,
            attributes: ['id','full_name','profile_image'],
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

// Find All
module.exports.artistListAdmin = (whereData, data) => {
    return new Promise((resolve, reject) => {
        ArtistModel.findAndCountAll({
            where: whereData,
            attributes: ['id','full_name','email','mobile_no','profile_image','is_active','current_reg_step','login_type','reg_steps_completed'],
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

// Follow Artist
module.exports.followArtist = (data) => {
    return new Promise((resolve, reject) => {
        FollowedArtistsModel.create(data)
            .then((result) => {
                result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    })
}

// Unfollow Artist
module.exports.unfollowArtist = (where) => {
    return new Promise((resolve, reject) => {
        FollowedArtistsModel.destroy({
            where: where
        }).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}

// Fetch Follow Details
module.exports.followDetails = (where) => {
    return new Promise((resolve, reject) => {
        FollowedArtistsModel.findOne({
                where: where
            })
            .then((result) => {
                result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    })
}

module.exports.followedArtistsList = (where) => {
    return new Promise((resolve, reject) => {
        FollowedArtistsModel.findAll({
                where: where
            })
            .then((result) => {
                result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    })
}


// Count Podcast Category
module.exports.countPodcastCategory = (whereData) => {
    return new Promise((resolve, reject) => {
        PodcastCategoryModel.count({
            where: whereData
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Add Podcast Category
module.exports.addPodcastCategory = (data) => {
    return new Promise((resolve, reject) => {
        PodcastCategoryModel.create(data).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// List Podcast Category
module.exports.listPodcastCategory = (whereData, data) => {
    return new Promise((resolve, reject) => {
        PodcastCategoryModel.findAndCountAll({
            where: whereData,
            limit: data.limit,
            offset: data.offset,
            group: ['id'],
            order: [
                ['id', 'DESC']
            ]
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Delete Podcast Category
module.exports.deletePodcastCategory = (where, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
            //if trunsaction exist
        if (t != null) options.transaction = t;
        PodcastCategoryModel.destroy(options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}




// Count Album Category
module.exports.countAlbumCategory = (whereData) => {
    return new Promise((resolve, reject) => {
        AlbumCategoryModel.count({
            where: whereData
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Add Album Category
module.exports.addAlbumCategory = (data) => {
    return new Promise((resolve, reject) => {
        AlbumCategoryModel.create(data).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// List Album Category
module.exports.listAlbumCategory = (whereData, data) => {
    return new Promise((resolve, reject) => {
        AlbumCategoryModel.findAndCountAll({
            where: whereData,
            limit: data.limit,
            offset: data.offset,
            group: ['id'],
            order: [
                ['id', 'DESC']
            ]
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Delete Album Category
module.exports.deleteAlbumCategory = (where, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
            //if trunsaction exist
        if (t != null) options.transaction = t;
        AlbumCategoryModel.destroy(options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}


// Count Song Category
module.exports.countSongCategory = (whereData) => {
    return new Promise((resolve, reject) => {
        SongCategoryModel.count({
            where: whereData
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Add Song Category
module.exports.addSongCategory = (data) => {
    return new Promise((resolve, reject) => {
        SongCategoryModel.create(data).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// List Song Category
module.exports.listSongCategory = (whereData, data) => {
    return new Promise((resolve, reject) => {
        SongCategoryModel.findAndCountAll({
            where: whereData,
            limit: data.limit,
            offset: data.offset,
            group: ['id'],
            order: [
                ['id', 'DESC']
            ]
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Delete Song Category
module.exports.deleteSongCategory = (where, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
            //if trunsaction exist
        if (t != null) options.transaction = t;
        SongCategoryModel.destroy(options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}
