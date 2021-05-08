'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class followed_artists extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  followed_artists.init({
    user_id: DataTypes.INTEGER,
    artist_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'followed_artists',
  });
  return followed_artists;
};