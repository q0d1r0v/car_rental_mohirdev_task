const cron = require("node-cron");
const { Op } = require("sequelize");
const { cars } = require("../models/car.model");
const { booking } = require("../models/booking.model");
const moment = require("moment");

cron.schedule("* * * * *", async () => {
  try {
    const current_date = moment().toISOString();
    const expired_bookings = await booking.findAll({
      where: { end_date: { [Op.lt]: current_date } },
      attributes: ["car_id"],
    });
    for (let booking_item of expired_bookings) {
      const car_id = booking_item.car_id;
      await cars.update(
        { availability_status: true },
        { where: { id: car_id } }
      );
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = cron;
