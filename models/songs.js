'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Songs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Songs.init({
    name: DataTypes.STRING,
    cover_picture: DataTypes.STRING,
    length: DataTypes.STRING,
    file_name: DataTypes.STRING,
    details: DataTypes.STRING,
    artist_id: DataTypes.INTEGER,
    album_id: DataTypes.INTEGER,
    song_category_id: DataTypes.INTEGER,
    is_paid: DataTypes.INTEGER,
    country_id: DataTypes.INTEGER,
    genre_id: DataTypes.INTEGER,
    is_active: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    playedCount: DataTypes.INTEGER,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'songs',
  });
  return Songs;
};