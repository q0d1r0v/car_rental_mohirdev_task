const { DataTypes } = require("sequelize");
const { db } = require("../database/db");

const cars = db.define(
  "cars",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price_per_day: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    availability_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    created_at: "created_at",
    updated_at: "updated_at",
  }
);

(async () => {
  try {
    await db.sync({ alter: true });
    console.log("Database synchronized!");
  } catch (error) {
    console.error("Error synchronizing the database:", error);
  }
})();

module.exports = {
  cars,
};
