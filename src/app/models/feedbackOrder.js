'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FeedbackOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // FeedbackOrder.belongsTo(models.Order, {
      //   foreignKey: "ID_Order",
      //   targetKey: "id",
      // });
      // FeedbackOrder.belongsTo(models.Schedule, {
      //   foreignKey: "ID_Schedule",
      //   targetKey: "id",
      // });
      // FeedbackOrder.hasMany(models.TaskRepair, {
      //   sourceKey: "id",
      //   foreignKey: "ID_DetailOrder",
      // });
      FeedbackOrder.belongsTo(models.Order, {
        foreignKey: "ID_Order",
        targetKey: "id",
      });
    }

  }
  FeedbackOrder.init({
    ID_Order: DataTypes.INTEGER,
    accountType: DataTypes.STRING,
    feedbackType: DataTypes.STRING,
    contentFeedback: DataTypes.STRING,
    dateChange: DataTypes.DATE,
    feedbackStatus: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'FeedbackOrder',
  });
  return FeedbackOrder;
};