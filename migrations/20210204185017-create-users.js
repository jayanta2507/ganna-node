'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      full_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      mobile_no: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.STRING
      },
      country_id: {
        type: Sequelize.INTEGER
      },
      login_type: {
        type: Sequelize.ENUM,
        values: ['system', 'facebook', 'google'],
      },
      otp: {
        type: Sequelize.STRING
      },
      otp_expire_time: {
        type: Sequelize.DATE
      },
      profile_image: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        comment: '0 => Inactive, 1 => Active'
      },
      type: {
        type: Sequelize.STRING,
        defaultValue: 'user'
      },
      createdAt: {
        allowNull: false,
        defaultValue : Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue : Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};