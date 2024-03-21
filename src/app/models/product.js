'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Brand, {
        foreignKey: "ID_Brand",
        targetKey: "id",
      });

      Product.belongsTo(models.Categori, {
        foreignKey: "ID_Categori",
        targetKey: "id",
      });
    }
  }
  Product.init({
    ID_Brand: DataTypes.INTEGER,
    ID_Categori: DataTypes.INTEGER,
    nameProduct: DataTypes.STRING,
    imageProduct: DataTypes.STRING,
    contentMarkdown: DataTypes.TEXT('long'),
    contentHTML: DataTypes.TEXT('long'),

  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};