'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      RoomMessage.belongsTo(models.User, {
        foreignKey: "userOne",
        targetKey: "id",
      });
      RoomMessage.belongsTo(models.Staff, {
        foreignKey: "userTwo",
        targetKey: "id",
      });
      RoomMessage.hasMany(models.Message, {
        sourceKey: "id",
        foreignKey: "ID_Room",
      });
    }
  }
  RoomMessage.init({
    userOne: DataTypes.INTEGER,
    userTwo: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'RoomMessage',
  });
  return RoomMessage;
};