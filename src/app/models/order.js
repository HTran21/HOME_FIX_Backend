'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: "ID_User",
        targetKey: "id",
      });

      Order.belongsTo(models.Categori, {
        foreignKey: "ID_Categori",
        targetKey: "id",
      });
      Order.belongsTo(models.Product, {
        foreignKey: "ID_Product",
        targetKey: "id",
      });
      Order.hasOne(models.DetailOrder, {
        sourceKey: "id",
        foreignKey: "ID_Order",
      });
    }
  }
  Order.init({
    ID_User: DataTypes.INTEGER,
    ID_Categori: DataTypes.INTEGER,
    ID_Product: DataTypes.INTEGER,
    fullName: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    desProblem: DataTypes.STRING,
    desireDate: DataTypes.DATE,
    status: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};