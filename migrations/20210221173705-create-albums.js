'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('albums', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      cover_picture: {
        type: Sequelize.STRING
      },
      artist_id: {
        type: Sequelize.STRING
      },
      total_songs: {
        type: Sequelize.INTEGER
      },
      is_active: {
        type: Sequelize.INTEGER,
        comment: '0 => Inactive, 1 => Active'
      },
      price: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM,
        values: ['song','podcast'],
        defaultValue: 'song'
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
    await queryInterface.dropTable('Albums');
  }
};