/**
 * @swagger
 * /admin/api/v1/create/booking:
 *   post:
 *     tags: ['Booking Service']
 *     summary: Create a new booking
 *     description: Creates a new booking in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: User ID making the booking.
 *                 example: 1
 *               car_id:
 *                 type: integer
 *                 description: Car ID being booked.
 *                 example: 2
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Start date of the booking.
 *                 example: "2024-12-01"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: End date of the booking.
 *                 example: "2024-12-05"
 *               total_cost:
 *                 type: number
 *                 format: float
 *                 description: Total cost for the booking.
 *                 example: 250.75
 *               status:
 *                 type: string
 *                 description: Status of the booking (e.g., pending, confirmed).
 *                 example: "pending"
 *     responses:
 *       201:
 *         description: Successfully created a new booking.
 *       400:
 *         description: Required fields are missing.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/get/bookings:
 *   get:
 *     tags: ['Booking Service']
 *     summary: Get all bookings
 *     description: Retrieves all bookings. Admins get all bookings; regular users get their own bookings.
 *     responses:
 *       200:
 *         description: List of bookings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Booking ID.
 *                         example: 1
 *                       user_id:
 *                         type: integer
 *                         description: User ID.
 *                         example: 1
 *                       car_id:
 *                         type: integer
 *                         description: Car ID.
 *                         example: 2
 *                       start_date:
 *                         type: string
 *                         format: date
 *                         description: Start date of the booking.
 *                         example: "2024-12-01"
 *                       end_date:
 *                         type: string
 *                         format: date
 *                         description: End date of the booking.
 *                         example: "2024-12-05"
 *                       total_cost:
 *                         type: number
 *                         format: float
 *                         description: Total cost for the booking.
 *                         example: 250.75
 *                       status:
 *                         type: string
 *                         description: Status of the booking.
 *                         example: "pending"
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/update/booking:
 *   put:
 *     tags: ['Booking Service']
 *     summary: Update a booking
 *     description: Updates an existing booking by ID.
 *     parameters:
 *       - in: query
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID to update.
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID.
 *       - in: query
 *         name: car_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Car ID.
 *       - in: query
 *         name: start_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date of the booking.
 *       - in: query
 *         name: end_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date of the booking.
 *       - in: query
 *         name: total_cost
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Total cost for the booking.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Status of the booking.
 *     responses:
 *       200:
 *         description: Successfully updated the booking.
 *       400:
 *         description: Required fields are missing.
 *       404:
 *         description: Booking not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/delete/booking:
 *   delete:
 *     tags: ['Booking Service']
 *     summary: Delete a booking
 *     description: Deletes a booking by ID.
 *     parameters:
 *       - in: query
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the booking.
 *       400:
 *         description: booking_id is required.
 *       404:
 *         description: Booking not found.
 *       500:
 *         description: Internal server error.
 */

const { checkAdmin } = require("../config/check-is-admin");
const { booking } = require("../models/booking.model");

const createBooking = async (req, res) => {
  try {
    const { user_id, car_id, start_date, end_date, total_cost, status } =
      req.body;
    if (user_id && car_id && start_date && end_date && total_cost) {
      const new_booking = await booking.create({
        user_id,
        car_id,
        start_date,
        end_date,
        total_cost,
        status,
      });
      // await cars.update(
      //   {
      //     availability_status: false,
      //   },
      //   { where: { id: car_id } }
      // );
      res.status(201).send({
        data: new_booking,
        message: "Yangi bandlov yaratildi!",
      });
    } else {
      res.status(400).send({
        message:
          "user_id, car_id, start_date, end_date va total_cost ni yuborish shart!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err ? err : "Internal server error!",
    });
  }
};

const getBookings = async (req, res) => {
  if (await checkAdmin(req.user.data.id)) {
    const bookings_data = await booking.findAll();
    res.send({
      data: bookings_data,
    });
  } else {
    const bookings_data = await booking.findAll({
      where: { user_id: req.user.data.id },
    });
    res.send({
      data: bookings_data,
    });
  }
};

const updateBooking = async (req, res) => {
  try {
    const {
      booking_id,
      user_id,
      car_id,
      start_date,
      end_date,
      total_cost,
      status,
    } = req.query;
    if (
      booking_id &&
      user_id &&
      car_id &&
      start_date &&
      end_date &&
      total_cost
    ) {
      const [updated_booking] = await booking.update(
        {
          booking_id,
          user_id,
          car_id,
          start_date,
          end_date,
          total_cost,
          status,
        },
        { where: { id: booking_id } }
      );

      if (updated_booking === 0) {
        return res.status(404).send({ message: "Bunday bandlov topilmadi!" });
      }
      res.status(200).send({
        message: "Bandlov muvaffaqiyatli yangilandi!",
      });
    } else {
      res.status(400).send({
        message:
          "booking_id, user_id, car_id, start_date, end_date va total_cost ni yuborish shart!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err ? err : "Internal server error!",
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { booking_id } = req.query;
    if (booking_id) {
      const deleted_booking = await booking.destroy({
        where: { id: booking_id },
      });

      if (deleted_booking > 0) {
        res.status(200).send({
          message: "Bandlov muvaffaqiyatli o'chirildi!",
        });
      } else {
        return res.status(404).send({ message: "Bunday bandlov topilmadi!" });
      }
    } else {
      res.status(400).send({
        message: "booking_id ni yuborish shart!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Internal server error!",
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking,
};
