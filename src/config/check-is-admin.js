const { users } = require("../models/associations/associations");
const { roles } = require("../models/associations/associations");

const checkAdmin = async (user_id) => {
  try {
    const user = await users.findOne({
      where: { id: user_id },
      include: {
        model: roles,
        as: "role",
        attributes: ["role_name"],
      },
    });

    if (user?.role?.role_name === "admin") {
      return true;
    }
    return false;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  checkAdmin,
};
