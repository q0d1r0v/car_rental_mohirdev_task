const { DataTypes } = require("sequelize");
const { db } = require("../database/db");

const roles = db.define(
  "roles",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
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
  roles,
};
