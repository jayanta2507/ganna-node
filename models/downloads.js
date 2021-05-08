'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class downloads extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  downloads.init({
    file_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    type: {
      type: DataTypes.ENUM,
      values: ['song','podcast']
    }
  }, {
    sequelize,
    modelName: 'downloads',
  });
  return downloads;
};