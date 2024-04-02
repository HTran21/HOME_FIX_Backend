'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Schedule.hasMany(models.TimeSlot, {
      //   sourceKey: "id",
      //   foreignKey: "ID_Schedule",
      // });
      // Schedule.belongsTo(models.Repairer, {
      //   foreignKey: "ID_Repairer",
      //   targetKey: "id",
      // });
    }
  }
  Schedule.init({
    ID_Repairer: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};