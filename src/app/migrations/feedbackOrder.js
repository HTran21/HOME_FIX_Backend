'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FeedbackOrders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ID_Order: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      accountType: {
        allowNull: false,
        type: Sequelize.STRING
      },
      feedbackType: {
        type: Sequelize.STRING
      },
      contentFeedback: {
        type: Sequelize.STRING
      },
      dateChange: {
        type: Sequelize.DATE
      },
      feedbackStatus: {
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
    await queryInterface.dropTable('FeedbackOrders');
  }
};