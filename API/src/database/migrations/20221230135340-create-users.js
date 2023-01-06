'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.createTable("users", {
      id: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      mail: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      role: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      person_id: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down (queryInterface, Sequelize) {
    return queryInterface.dropTable("users");
  }
};
