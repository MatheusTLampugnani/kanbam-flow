const sequelize = require('../config/database');
const Board = require('./Board');
const Column = require('./Column');
const Card = require('./Card');
const User = require('./User');

Board.hasMany(Column, { foreignKey: 'boardId', as: 'columns', onDelete: 'CASCADE' });
Column.belongsTo(Board, { foreignKey: 'boardId' });

Column.hasMany(Card, { foreignKey: 'columnId', as: 'cards', onDelete: 'CASCADE' });
Card.belongsTo(Column, { foreignKey: 'columnId' });

module.exports = { sequelize, Board, Column, Card, User };