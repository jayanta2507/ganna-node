'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('artist_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      artist_id: {
        type: Sequelize.INTEGER
      },
      street: {
        type: Sequelize.STRING
      },
      building_no: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      zip: {
        type: Sequelize.STRING
      },
      account_holder_name: {
        type: Sequelize.STRING
      },
      account_number: {
        type: Sequelize.STRING
      },
      routing_no: {
        type: Sequelize.STRING
      },
      branch_address: {
        type: Sequelize.STRING
      },
      branch_name: {
        type: Sequelize.STRING
      },
      bank_country: {
        type: Sequelize.INTEGER
      },
      bank_state: {
        type: Sequelize.STRING
      },
      bank_city: {
        type: Sequelize.STRING
      },
      bank_zip: {
        type: Sequelize.STRING
      },
      currency: {
        type: Sequelize.STRING
      },
      swift_code: {
        type: Sequelize.STRING
      },
      govt_id_front: {
        type: Sequelize.STRING
      },
      govt_id_back: {
        type: Sequelize.STRING
      },
      sample_song_name: {
        type: Sequelize.STRING
      },
      sample_song_path: {
        type: Sequelize.STRING
      },
      sample_song_type: {
        type: Sequelize.INTEGER
      },
      sample_song_album: {
        type: Sequelize.INTEGER
      },
      sample_song_description: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('artist_details');
  }
};