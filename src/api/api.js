const router = require("express").Router();

const { authMiddleware } = require("../middleware/auth.middleware");
const {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking,
} = require("../services/booking.service");
const {
  createCar,
  getCars,
  updateCar,
  deleteCar,
} = require("../services/car.service");
const {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
} = require("../services/role.service");
const {
  createTransaction,
  getTransactions,
} = require("../services/transaction.service");
const {
  createUser,
  updateUser,
  getUsers,
  deleteUser,
  loginUser,
} = require("../services/user.service");

router.use("/admin/", authMiddleware);

router.post("/admin/api/v1/create/role", createRole);
router.get("/admin/api/v1/get/roles", getRoles);
router.put("/admin/api/v1/update/role", updateRole);
router.delete("/admin/api/v1/delete/role", deleteRole);

router.post("/auth/login", loginUser);
router.post("/admin/api/v1/create/user", createUser);
router.get("/admin/v1/get/users", getUsers);
router.put("/admin/v1/update/user", updateUser);
router.delete("/admin/api/v1/delete/user", deleteUser);

router.post("/admin/api/v1/create/car", createCar);
router.get("/admin/api/v1/get/cars", getCars);
router.put("/admin/api/v1/update/car", updateCar);
router.delete("/admin/api/v1/delete/car", deleteCar);

router.post("/admin/api/v1/create/booking", createBooking);
router.get("/admin/api/v1/get/bookings", getBookings);
router.put("/admin/api/v1/update/booking", updateBooking);
router.delete("/admin/api/v1/delete/booking", deleteBooking);

router.post("/admin/api/v1/create/transaction", createTransaction);
router.get("/admin/api/v1/get/transactions", getTransactions);

module.exports = {
  router,
};
