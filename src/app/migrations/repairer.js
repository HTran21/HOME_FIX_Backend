'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Repairers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ID_Speliciazation: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      usernameRepairer: {
        type: Sequelize.STRING
      },
      passwordRepairer: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.STRING
      },
      emailRepairer: {
        type: Sequelize.STRING
      },
      phoneRepairer: {
        type: Sequelize.STRING
      },
      addressRepairer: {
        type: Sequelize.STRING
      },
      avatarRepairer: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING
      },
      status: {
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
    await queryInterface.dropTable('Repairers');
  }
};