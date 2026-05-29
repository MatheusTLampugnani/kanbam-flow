const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Card = sequelize.define('Card', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  priority: { type: DataTypes.STRING, defaultValue: 'Média' },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  
  assignee: { type: DataTypes.STRING },
  dueDate: { type: DataTypes.DATEONLY }, 
  checklist: { type: DataTypes.JSON, defaultValue: [] },
  tags: { type: DataTypes.JSON, defaultValue: [] }, 
  
  comments: { type: DataTypes.JSON, defaultValue: [] }, 
  
  customFieldsData: { type: DataTypes.JSON, defaultValue: {} }
});

module.exports = Card;