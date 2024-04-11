'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskRepair extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      TaskRepair.belongsTo(models.DetailOrder, {
        foreignKey: "ID_DetailOrder",
        targetKey: "id",
      });
      TaskRepair.belongsTo(models.Operation, {
        foreignKey: "ID_Operation",
        targetKey: "id",
      });
    }
  }
  TaskRepair.init({
    ID_DetailOrder: DataTypes.INTEGER,
    ID_Operation: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'TaskRepair',
  });
  return TaskRepair;
};