'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_played_histories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user_played_histories.init({
    user_id: DataTypes.INTEGER,
    file_id: DataTypes.INTEGER,
    last_played_length: DataTypes.INTEGER,
    type: {
      type: DataTypes.ENUM,
      values: ['song', 'podcast']
    },
  }, {
    sequelize,
    modelName: 'user_played_histories',
    timestamps: true
  });
  return user_played_histories;
};