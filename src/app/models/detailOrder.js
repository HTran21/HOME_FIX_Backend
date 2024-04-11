'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DetailOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DetailOrder.belongsTo(models.Order, {
        foreignKey: "ID_Order",
        targetKey: "id",
      });
      DetailOrder.belongsTo(models.Schedule, {
        foreignKey: "ID_Schedule",
        targetKey: "id",
      });
      DetailOrder.hasMany(models.TaskRepair, {
        sourceKey: "id",
        foreignKey: "ID_DetailOrder",
      });
    }

  }
  DetailOrder.init({
    ID_Order: DataTypes.INTEGER,
    ID_Schedule: DataTypes.INTEGER,
    timeRepair: DataTypes.STRING,
    totalAmount: DataTypes.INTEGER,
    paymentMethod: DataTypes.STRING,
    paymentStatus: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'DetailOrder',
  });
  return DetailOrder;
};