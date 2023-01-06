'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("topics", {
      id: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      created_by: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      removed: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      removed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      removed_by: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("topics");
  }
};
