'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Brand.hasMany(models.Product, {
        sourceKey: "id",
        foreignKey: "ID_Brand",
      });
    }
  }
  Brand.init({
    nameBrand: DataTypes.STRING,
    imageBrand: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Brand',
  });
  return Brand;
};