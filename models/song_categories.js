'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class song_categories extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    song_categories.init({
        name: DataTypes.STRING,
        cover_image: DataTypes.STRING,
        details: DataTypes.TEXT,
        is_active: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'song_categories',
    });
    return song_categories;
};