'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Blog.init({
    nameService: DataTypes.STRING,
    contentHTML: DataTypes.TEXT('long'),
    contentMarkDown: DataTypes.TEXT('long'),
    logoService: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'Blog',
  });
  return Blog;
};