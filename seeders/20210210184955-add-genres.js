'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Genres', 
    [
      {
        name: 'Rock',
      },
      {
        name: 'Jazz',
      },
      {
        name: 'Hip hop',
      },
      {
        name: 'Disco',
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Genres', null, {});
  }
};
