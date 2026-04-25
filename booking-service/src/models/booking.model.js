const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  movieTitle: {
    type: DataTypes.STRING,
  },
  seatNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'PENDING', // PENDING, CONFIRMED, FAILED
  },
});

module.exports = Booking;
