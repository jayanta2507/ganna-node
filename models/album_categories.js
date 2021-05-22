'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class album_categories extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    album_categories.init({
        name: DataTypes.STRING,
        cover_image: DataTypes.STRING,
        details: DataTypes.TEXT,
        is_active: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'album_categories',
    });
    return album_categories;
};