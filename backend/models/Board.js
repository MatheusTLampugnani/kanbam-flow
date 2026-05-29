const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Board = sequelize.define('Board', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  customFieldsSchema: { type: DataTypes.JSON, defaultValue: [] },
  ownerId: { type: DataTypes.INTEGER },
  sharedWith: { type: DataTypes.JSON, defaultValue: [] }
});

module.exports = Board;