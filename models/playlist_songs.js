'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class playlist_songs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  playlist_songs.init({
    playlist_id: DataTypes.INTEGER,
    file_id: DataTypes.INTEGER,
    type: {
      type: DataTypes.ENUM,
      values: ['song','podcast']
    }
  }, {
    sequelize,
    modelName: 'playlist_songs',
  });
  return playlist_songs;
};