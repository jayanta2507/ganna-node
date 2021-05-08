'use strict';
const md5 = require('md5');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Admins', [{
      full_name: 'Kawawa Admin',
      email: 'admin@mailinator.com',
      password: md5('Admin#@2021'),
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Admins', null, {});
  }
};
