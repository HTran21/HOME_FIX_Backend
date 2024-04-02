'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Repairer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Repairer.belongsTo(models.Specialization, {
        foreignKey: "ID_Speliciazation",
        targetKey: "id",
      });

      Repairer.hasMany(models.Schedule, {
        sourceKey: "id",
        foreignKey: "ID_Repairer",
      });
    }
  }
  Repairer.init({
    ID_Speliciazation: DataTypes.INTEGER,
    usernameRepairer: DataTypes.STRING,
    passwordRepairer: DataTypes.STRING,
    position: DataTypes.STRING,
    emailRepairer: DataTypes.STRING,
    phoneRepairer: DataTypes.STRING,
    addressRepairer: DataTypes.STRING,
    avatarRepairer: DataTypes.STRING,
    role: DataTypes.STRING,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Repairer',
  });
  return Repairer;
};