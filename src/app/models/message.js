'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Message.belongsTo(models.RoomMessage, {
        foreignKey: "ID_Room",
        targetKey: "id",
      });
      // Message.belongsTo(models.Staff, {
      //   foreignKey: "userTwo",
      //   targetKey: "id",
      // });
    }
  }
  Message.init({
    ID_Room: DataTypes.INTEGER,
    senderID: DataTypes.INTEGER,
    senderType: DataTypes.STRING,
    text: DataTypes.STRING,
    unRead: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};