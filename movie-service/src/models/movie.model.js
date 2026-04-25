const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  genre: {
    type: DataTypes.STRING,
  },
  duration: {
    type: DataTypes.INTEGER, // minutes
  },
  price: {
    type: DataTypes.FLOAT,
    defaultValue: 100000,
  },
  posterUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  showtime: {
    type: DataTypes.STRING,
  },
  totalSeats: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
});

module.exports = Movie;
