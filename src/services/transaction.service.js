const { transactions } = require("../models/transaction.model");
const { cars } = require("../models/car.model");
const { booking } = require("../models/booking.model");
const { sequelize } = require("../../models/index");
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

module.exports = {
  createTransaction,
};
