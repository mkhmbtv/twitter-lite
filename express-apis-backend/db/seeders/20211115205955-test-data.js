'use strict';

const bcrypt = require('bcryptjs');
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.bulkInsert(
      'Users', [
        {
          username: faker.internet.userName(),
          email: faker.internet.email(),
          hashedPassword: bcrypt.hashSync(faker.internet.password()),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: faker.internet.userName(),
          email: faker.internet.email(),
          hashedPassword: bcrypt.hashSync(faker.internet.password()),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    return queryInterface.bulkInsert(
      'Tweets', [
        {
          message: faker.company.catchPhrase(),
          userId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          message: faker.company.catchPhrase(),
          userId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          message: faker.company.catchPhrase(),
          userId: users[1].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tweets', null, {});
  }
};
