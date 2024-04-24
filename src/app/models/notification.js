'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      // Notification.belongsTo(models.User, {
      //   foreignKey: "ID_Room",
      //   targetKey: "id",
      // });
      // Message.belongsTo(models.Staff, {
      //   foreignKey: "userTwo",
      //   targetKey: "id",
      // });
    }
  }
  Notification.init({
    receiveID: DataTypes.INTEGER,
    contentNotification: DataTypes.STRING,
    typeNotification: DataTypes.STRING,
    read: DataTypes.STRING,
    accountType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};