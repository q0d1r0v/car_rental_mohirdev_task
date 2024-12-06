const { DataTypes } = require("sequelize");
const { db } = require("../database/db");

const transactions = db.define(
  "transactions",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "booking",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    amount_paid: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.STRING,
      defaultValue: "completed",
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
  transactions,
};
