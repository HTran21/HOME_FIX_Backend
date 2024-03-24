'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Specialization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Operation.belongsTo(models.Service, {
      //   foreignKey: "ID_Service",
      //   targetKey: "id",
      // });

      // Operation.belongsTo(models.Categori, {
      //   foreignKey: "ID_Categori",
      //   targetKey: "id",
      // });
    }
  }
  Specialization.init({
    nameSpecialization: DataTypes.STRING,
    logoSpecialization: DataTypes.STRING,
    desSpecialization: DataTypes.TEXT('long'),

  }, {
    sequelize,
    modelName: 'Specialization',
  });
  return Specialization;
};