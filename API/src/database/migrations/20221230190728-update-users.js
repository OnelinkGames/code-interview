'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "created_by", { type: Sequelize.STRING(50), allowNull: true }),
      queryInterface.addColumn("users", "removed", { type: Sequelize.BOOLEAN, allowNull: true }),
      queryInterface.addColumn("users", "removed_at", { type: Sequelize.DATE, allowNull: true }),
      queryInterface.addColumn("users", "removed_by", { type: Sequelize.STRING, allowNull: true })
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn("users", "created_by"),
      queryInterface.removeColumn("users", "removed"),
      queryInterface.removeColumn("users", "removed_at"),
      queryInterface.removeColumn("users", "removed_by")
    ]);
  }
};
