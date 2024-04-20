'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {


      Comment.belongsTo(models.Service, {
        foreignKey: "ID_Service",
        targetKey: "id",
      });

      Comment.belongsTo(models.User, {
        foreignKey: "ID_User",
        targetKey: "id",
      });
    }
  }
  Comment.init({
    ID_User: DataTypes.INTEGER,
    ID_Service: DataTypes.INTEGER,
    content: DataTypes.STRING,
    rate: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};