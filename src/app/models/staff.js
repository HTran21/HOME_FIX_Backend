'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Staff.init({
    usernameStaff: DataTypes.STRING,
    passwordStaff: DataTypes.STRING,
    position: DataTypes.STRING,
    emailStaff: DataTypes.STRING,
    phoneStaff: DataTypes.STRING,
    addressStaff: DataTypes.STRING,
    avatarStaff: DataTypes.STRING,
    role: DataTypes.STRING,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Staff',
  });
  return Staff;
};