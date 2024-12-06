/**
 * @swagger
 * /admin/api/v1/create/transaction:
 *   post:
 *     tags: ['Transaction Service']
 *     summary: Create a new transaction
 *     description: Creates a new transaction after confirming a booking and updating the car's availability status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               booking_id:
 *                 type: integer
 *                 description: The ID of the booking for the transaction.
 *                 example: 1
 *               amount_paid:
 *                 type: number
 *                 format: float
 *                 description: The amount paid for the booking.
 *                 example: 250.75
 *     responses:
 *       201:
 *         description: Successfully created a new transaction.
 *       400:
 *         description: Required fields are missing.
 *       404:
 *         description: Booking not found or car update failed.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/get/transactions:
 *   get:
 *     tags: ['Transaction Service']
 *     summary: Get all transactions
 *     description: Retrieves all transactions. Admin users get all transactions; regular users get their own transactions.
 *     responses:
 *       200:
 *         description: List of transactions.
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
 *                       booking_id:
 *                         type: integer
 *                         description: The ID of the booking associated with the transaction.
 *                         example: 1
 *                       amount_paid:
 *                         type: number
 *                         format: float
 *                         description: The amount paid for the booking.
 *                         example: 250.75
 *                       payment_date:
 *                         type: string
 *                         format: date-time
 *                         description: The date when the payment was made.
 *                         example: "2024-12-01T15:00:00Z"
 *                       payment_status:
 *                         type: string
 *                         description: The status of the payment (e.g., completed, pending).
 *                         example: "completed"
 *       403:
 *         description: User is not authorized to access the transactions.
 *       500:
 *         description: Internal server error.
 */

const { transactions } = require("../models/transaction.model");
const { cars } = require("../models/car.model");
const { booking } = require("../models/booking.model");
const { sequelize } = require("../../models/index");
const { checkAdmin } = require("../config/check-is-admin");

const createTransaction = async (req, res) => {
  try {
    const { booking_id, amount_paid } = req.body;
    if (booking_id && amount_paid) {
      const transaction = await sequelize.transaction();
      try {
        const booking_record = await booking.findByPk(booking_id, {
          transaction,
        });

        if (!booking_record) {
          await transaction.rollback();
          return res.status(404).send({
            message: "Bandlov topilmadi!",
          });
        }

        const booking_data = await booking.findOne({
          where: { id: booking_id },
          transaction,
        });

        if (!booking_data) {
          return res.status(404).send({ message: "Bandlov topilmadi!" });
        }
        await booking_data.update({ status: "confirmed" }, { transaction });

        const car = await cars.update(
          { availability_status: false },
          {
            where: { id: booking_data.car_id },
            transaction,
          }
        );

        if (!car.length) {
          return res.status(404).send({
            message: "Mashina topilmadi yoki o'zgartirish amalga oshirilmadi!",
          });
        }

        const new_transaction = await transactions.create(
          {
            booking_id,
            amount_paid,
            payment_date: new Date(),
            payment_status: "completed",
          },
          { transaction }
        );
        await transaction.commit();

        res.status(201).send({
          message: "Tranzaksiya muvaffaqiyatli yaratildi",
          transaction: new_transaction,
        });
      } catch (err) {
        await transaction.rollback();
        res.status(500).send({
          message: err.message || "Xatolik yuz berdi!",
        });
      }
    } else {
      res.status(400).send({
        message: "booking_id va amount_paid ni yuborish shart!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err ? err : "Internal server error!",
    });
  }
};
const getTransactions = async (req, res) => {
  if (await checkAdmin(req.user.data.id)) {
    const transaction_data = await transactions.findAll();
    res.send({
      data: transaction_data,
    });
  } else {
    res.status(403).send({
      message: "Sizda ushbu amalni bajarish uchun ruxsat mavjud emas!",
    });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
};
