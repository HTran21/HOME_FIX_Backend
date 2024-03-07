'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Staffs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usernameStaff: {
        type: Sequelize.STRING
      },
      passwordStaff: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.STRING
      },
      emailStaff: {
        type: Sequelize.STRING
      },
      phoneStaff: {
        type: Sequelize.STRING
      },
      addressStaff: {
        type: Sequelize.STRING
      },
      avatarStaff: {
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
    await queryInterface.dropTable('Staffs');
  }
};