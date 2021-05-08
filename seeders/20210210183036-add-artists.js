const md5 = require('md5');
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Artists', 
      [
        {
          full_name: 'Arijit Singh',
          email: 'arihitsingh@mailinator.com',
          password: md5('Arijit#@2021'),
          mobile_no: '8274893868',
          dob: '1996-06-01',
          country_id: 2,
          login_type: 'system',
          profile_image: '/uploads/artist_images/arijit.jpg',
          is_active: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          full_name: 'Coldplay',
          email: 'coldplay@mailinator.com',
          password: md5('Coldplay#@2021'),
          mobile_no: '8274893869',
          dob: '1996-06-01',
          country_id: 3,
          login_type: 'system',
          profile_image: '/uploads/artist_images/coldplay.jpg',
          is_active: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          full_name: 'The Local Train',
          email: 'thelocaltrain@mailinator.com',
          password: md5('Tlr#@2021'),
          mobile_no: '8274893864',
          dob: '1996-06-01',
          country_id: 4,
          login_type: 'system',
          profile_image: '/uploads/artist_images/tlr.jpg',
          is_active: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Artists', null, {});
  }
};
