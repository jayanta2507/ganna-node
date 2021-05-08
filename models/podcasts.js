'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class podcasts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  podcasts.init({
    name: DataTypes.STRING,
    cover_picture: DataTypes.STRING,
    length: DataTypes.STRING,
    file_name: DataTypes.STRING,
    details: DataTypes.STRING,
    artist_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    is_paid: DataTypes.INTEGER,
    country_id: DataTypes.INTEGER,
    is_active: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'podcasts',
  });
  return podcasts;
};