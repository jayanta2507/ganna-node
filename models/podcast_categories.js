'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class podcast_categories extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    podcast_categories.init({
        name: DataTypes.STRING,
        is_active: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'podcast_categories',
    });
    return podcast_categories;
};