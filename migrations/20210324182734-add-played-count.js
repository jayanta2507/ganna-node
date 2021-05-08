'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('songs', 'playedCount', {
      type: Sequelize.INTEGER,
      after: "price"
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('songs', 'playedCount');
  }
};
