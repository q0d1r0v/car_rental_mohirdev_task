const { users } = require("../user.model");
const { roles } = require("../role.model");

users.belongsTo(roles, { foreignKey: "role_id", as: "role" });
roles.hasMany(users, { foreignKey: "role_id", as: "users" });

module.exports = {
  users,
  roles,
};
