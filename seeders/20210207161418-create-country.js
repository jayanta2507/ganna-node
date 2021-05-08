'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Countries', 
    [
      {
        name: 'Afghanistan',
        country_code: 'AFG',
        telephone_code: '93',
      },
      {
        name: 'India',
        country_code: 'IND',
        telephone_code: '91',
      },
      {
        name: 'New Zealand',
        country_code: 'NZL',
        telephone_code: '64',
      },
      {
        name: 'United States',
        country_code: 'USA',
        telephone_code: '1',
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Countries', null, {});
  }
};
