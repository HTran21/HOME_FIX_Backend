'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Service.hasMany(models.Operation, {
        sourceKey: "id",
        foreignKey: "ID_Service",
      });

      Service.hasMany(models.Categori, {
        sourceKey: "id",
        foreignKey: "ID_Service",
      });

      Service.hasMany(models.Repairer, {
        sourceKey: "id",
        foreignKey: "ID_Service",
      });

    }
  }
  Service.init({
    nameService: DataTypes.STRING,
    contentHTML: DataTypes.TEXT('long'),
    contentMarkDown: DataTypes.TEXT('long'),
    logoService: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'Service',
  });
  return Service;
};