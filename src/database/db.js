const { Sequelize } = require("sequelize");

const db = new Sequelize(
  "car_rental_db",
  "postgres",
  "fiF1jbUyDMBbOMTzWrhtSwmF26VwM",
  {
    host: "localhost",
    dialect: "postgres",
  }
);

(async () => {
  try {
    await db.authenticate();
    console.log("Connection to PostgreSQL has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = {
  db,
};
