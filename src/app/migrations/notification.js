'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      receiveID: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      contentNotification: {
        allowNull: false,
        type: Sequelize.STRING
      },
      typeNotification: {
        allowNull: false,
        type: Sequelize.STRING
      },
      read: {
        allowNull: false,
        type: Sequelize.STRING
      },
      accountType: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Notifications');
  }
};