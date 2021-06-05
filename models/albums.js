'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Albums extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Albums.init({
    name: DataTypes.STRING,
    cover_picture: DataTypes.STRING,
    artist_id: DataTypes.STRING,
    album_category_id: DataTypes.INTEGER,
    total_songs: DataTypes.INTEGER,
    is_active: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    type: {
      type: DataTypes.ENUM,
      values: ['song','podcast'],
    }
  }, {
    sequelize,
    modelName: 'albums',
  });
  return Albums;
};