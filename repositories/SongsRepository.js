const sequelize = require('../config/dbConfig').sequelize;
var DataTypes = require('sequelize/lib/data-types');
const SongsModel = require('../models/songs')(sequelize, DataTypes);
const ArtistModel = require('../models/artists')(sequelize, DataTypes);
const GenresModel = require('../models/genres')(sequelize, DataTypes);
const AlbumsModel = require('../models/albums')(sequelize, DataTypes);
const FavouritesModel = require('../models/favourites')(sequelize, DataTypes);
const CountryModel = require('../models/countries')(sequelize, DataTypes);


SongsModel.belongsTo(ArtistModel, { foreignKey: 'artist_id', as: 'artist_details' });
SongsModel.belongsTo(GenresModel, { foreignKey: 'genre_id', as: 'genre_details' });
SongsModel.belongsTo(AlbumsModel, { foreignKey: 'album_id', as: 'album_details' });
SongsModel.hasMany(FavouritesModel, { foreignKey: 'file_id', as: 'is_favourite' });
SongsModel.belongsTo(CountryModel, { foreignKey: 'country_id', as: 'country_details' });

// Find All
module.exports.findAll = (whereData) => {
    return new Promise((resolve, reject) => {
        SongsModel.findAll({
            where: whereData,
            attributes: [
                'id',
                'name',
                'cover_picture',
                'length',
                'file_name',
                'type',
                'artist_id',
                'genre_id',
                'album_id',
                'country_id',
                'is_paid',
                'createdAt',
                'updatedAt'
            ],
        }).then(result => {
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
        SongsModel.findOne({
            where: whereData,
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
        SongsModel.count({
            where: whereData,
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
        SongsModel.findAndCountAll({
            where: where,
            order: [
                ['createdAt', 'desc']
            ],
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
                    required:false
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

// Free Songs Without Pagination
module.exports.freeSongs = (where, data) => {
    return new Promise((resolve, reject) => {
        SongsModel.findAll({
            where: where,
            order: [
                ['createdAt', 'desc']
            ],
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
                    required:false
                }
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

// Free Songs Without Pagination
module.exports.freeSongsPaginate = (where, data) => {
    return new Promise((resolve, reject) => {
        SongsModel.findAndCountAll({
            where: where,
            order: [
                ['createdAt', 'desc']
            ],
            include: [{
                    model: ArtistModel,
                    as: 'artist_details',
                    attributes: ['id', 'full_name', 'profile_image', 'type'],
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
                    required:false
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

// Recommended Songs Without Pagination
module.exports.recommendedSongs = (where, data) => {
    return new Promise((resolve, reject) => {
        SongsModel.findAll({
            where: where,
            order: [
                ['createdAt', 'desc']
            ],
            attributes: [
                'id',
                'name',
                'cover_picture',
                'length',
                'file_name',
                'type',
                'artist_id',
                'genre_id',
                'album_id',
                'country_id',
                'is_paid',
                'createdAt',
                'updatedAt'
            ],
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
                    required:false
                }
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

// Recommended Songs With Pagination
module.exports.recommendedSongsPaginate = (where, data) => {
    return new Promise((resolve, reject) => {
        SongsModel.findAndCountAll({
            where: where,
            order: [
                ['createdAt', 'desc']
            ],
            attributes: [
                'id',
                'name',
                'cover_picture',
                'length',
                'file_name',
                'type',
                'artist_id',
                'genre_id',
                'album_id',
                'is_paid',
                'country_id',
                'createdAt',
                'updatedAt'
            ],
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
                    required:false
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

// Weekly Top 10 Songs Without Pagination
module.exports.weeklyTopTen = (where, data) => {
    return new Promise((resolve, reject) => {
        SongsModel.findAll({
            where: where,
            attributes: [
                'id',
                'name',
                'cover_picture',
                'length',
                'file_name',
                'type', 
                'artist_id',
                'genre_id',
                'album_id',
                'is_paid',
                'country_id',
                'createdAt',
                'updatedAt',
                [sequelize.literal(`(SELECT count(*) FROM favourites WHERE favourites.file_id = songs.id)`), 'totalFavourites']
            ],
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
                    required:false
                }
            ],
            having: sequelize.literal('`totalFavourites` > 0'),
            order: [
                [sequelize.literal(`totalFavourites`), 'desc']
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

// Weekly Top 10 Songs With Pagination
module.exports.weeklyTopTenPaginate = (where, data) => {
    return new Promise((resolve, reject) => {
        SongsModel.findAll({
            where: where,
            subQuery: false,
            attributes: [
                'id',
                'name',
                'cover_picture',
                'length',
                'file_name',
                'type',
                'artist_id',
                'genre_id',
                'album_id',
                'country_id',
                'is_paid',
                'createdAt',
                'updatedAt',
                [sequelize.literal(`(SELECT count(*) FROM favourites WHERE favourites.file_id = songs.id)`), 'totalFavourites'],
                [sequelize.literal(`(SELECT count(*) FROM downloads WHERE downloads.file_id = songs.id)`), 'totalDownloads'],
                [sequelize.literal(`(SELECT count(*) FROM downloads WHERE downloads.file_id = songs.id) + (SELECT count(*) FROM favourites WHERE favourites.file_id = songs.id)`), 'totalSum'],
            ],
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
                    required:false
                }
            ],
            having: sequelize.literal('`totalSum` > 0'),
            order: [
                [sequelize.literal(`totalSum`), 'desc']
            ],
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

// Add To Liked Songs
module.exports.markFavouriteInsert = (data) => {
    return new Promise((resolve, reject) => {
        FavouritesModel.create(data)
            .then((result) => {
                result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    })
}

// Remove From Liked Songs
module.exports.favDestroy = (where) => {
    return new Promise((resolve, reject) => {
        FavouritesModel.destroy({
            where: where
        }).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}

// Fetch Favourite Details
module.exports.favouriteFindDetails = (where) => {
    return new Promise((resolve, reject) => {
        FavouritesModel.findOne({
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

// Update
module.exports.update = (where, data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
            where: where
        }
            //if trunsaction exist
        if (t != null) options.transaction = t;
        SongsModel.update(data, options).then((result) => {
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
        SongsModel.destroy(options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}

module.exports.songDelete = (where, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
            where: where
        }
            //if trunsaction exist
        if (t != null) options.transaction = t;
        SongsModel.destroy(options).then((result) => {
            resolve(result)
        }).catch((err) => {
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
        SongsModel.create(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}

module.exports.songDetails = (where) => {
    return new Promise((resolve, reject) => {
        SongsModel.findOne({
            where: where,
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
                    model: CountryModel,
                    as: 'country_details',
                }
            ],
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

module.exports.songsList = (where, data) => {
    return new Promise((resolve, reject) => {
        SongsModel.findAndCountAll({
            where: where,
            order: [
                ['createdAt', 'desc']
            ],
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
                    model: CountryModel,
                    as: 'country_details',
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