const { DataTypes } = require("sequelize");
const { db } = require("../database/db");

const booking = db.define(
  "booking",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    car_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cars",
        key: "id",
      },
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    total_cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
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
  booking,
};
