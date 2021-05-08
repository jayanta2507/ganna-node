'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('artists', {
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
        defaultValue: 0,
        comment: '0 => Default, 1 => Approved, 2 => Declined'
      },
      declined_reason: {
        type: Sequelize.STRING,
      },
      current_reg_step: {
        type: Sequelize.INTEGER,
        comment: "Current Step Of Registration"
      },
      reg_steps_completed: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: '0 => Incomplete, 1 => Complete'
      },
      type: {
        type: Sequelize.STRING,
        defaultValue: 'artist'
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
    await queryInterface.dropTable('Artists');
  }
};