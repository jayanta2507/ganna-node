'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Users.init({
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    mobile_no: DataTypes.STRING,
    password: DataTypes.STRING,
    dob: DataTypes.STRING,
    country_id: DataTypes.INTEGER,
    login_type: {
      type: DataTypes.ENUM,
      values: ['system', 'facebook', 'google']
    },
    otp: DataTypes.STRING,
    otp_expire_time: DataTypes.DATE,
    profile_image: DataTypes.STRING,
    is_active: DataTypes.INTEGER,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return Users;
};