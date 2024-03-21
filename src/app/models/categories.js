'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categori extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Categori.hasMany(models.Operation, {
        sourceKey: "id",
        foreignKey: "ID_Categori",
      });

      Categori.hasMany(models.Product, {
        sourceKey: "id",
        foreignKey: "ID_Categori",
      });
    }
  }
  Categori.init({
    nameCategories: DataTypes.STRING,
    imageCategories: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Categori',
  });
  return Categori;
};