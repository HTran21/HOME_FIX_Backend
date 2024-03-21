'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ID_Brand: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ID_Categori: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      nameProduct: {
        allowNull: false,
        type: Sequelize.STRING
      },
      imageProduct: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contentMarkdown: {
        allowNull: false,
        type: Sequelize.TEXT('long')
      },
      contentHTML: {
        allowNull: false,
        type: Sequelize.TEXT('long')
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
    await queryInterface.dropTable('Products');
  }
};