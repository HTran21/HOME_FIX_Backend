'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Operation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Operation.belongsTo(models.Service, {
        foreignKey: "ID_Service",
        targetKey: "id",
      });

      Operation.belongsTo(models.Categori, {
        foreignKey: "ID_Categori",
        targetKey: "id",
      });
    }
  }
  Operation.init({
    ID_Service: DataTypes.INTEGER,
    ID_Categori: DataTypes.INTEGER,
    nameOperation: DataTypes.STRING,
    price: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Operation',
  });
  return Operation;
};