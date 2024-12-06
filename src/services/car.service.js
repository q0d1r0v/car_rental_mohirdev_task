/**
 * @swagger
 * /admin/api/v1/create/car:
 *   post:
 *     tags: ['Car Service']
 *     summary: Create a new car
 *     description: Adds a new car to the system with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               make:
 *                 type: string
 *                 description: The make of the car (e.g., Toyota, Honda).
 *                 example: "Toyota"
 *               model:
 *                 type: string
 *                 description: The model of the car.
 *                 example: "Corolla"
 *               year:
 *                 type: integer
 *                 description: The manufacturing year of the car.
 *                 example: 2023
 *               price_per_day:
 *                 type: number
 *                 format: float
 *                 description: Rental price per day.
 *                 example: 50.5
 *     responses:
 *       201:
 *         description: Successfully created a new car.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                   example: "Yangi mashina yaratildi!"
 *       400:
 *         description: Bad request, required fields are missing.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/get/cars:
 *   get:
 *     tags: ['Car Service']
 *     summary: Get all cars
 *     description: Retrieves a list of all cars available in the system.
 *     responses:
 *       200:
 *         description: A list of cars.
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
 *                         description: The unique identifier of the car.
 *                         example: 1
 *                       make:
 *                         type: string
 *                         description: The make of the car.
 *                         example: "Toyota"
 *                       model:
 *                         type: string
 *                         description: The model of the car.
 *                         example: "Corolla"
 *                       year:
 *                         type: integer
 *                         description: The manufacturing year of the car.
 *                         example: 2023
 *                       price_per_day:
 *                         type: number
 *                         format: float
 *                         description: Rental price per day.
 *                         example: 50.5
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/update/car:
 *   put:
 *     tags: ['Car Service']
 *     summary: Update a car
 *     description: Updates the details of an existing car using its ID.
 *     parameters:
 *       - in: query
 *         name: car_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the car to update.
 *       - in: query
 *         name: make
 *         required: true
 *         schema:
 *           type: string
 *         description: The make of the car.
 *       - in: query
 *         name: model
 *         required: true
 *         schema:
 *           type: string
 *         description: The model of the car.
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: The manufacturing year of the car.
 *       - in: query
 *         name: price_per_day
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Rental price per day.
 *     responses:
 *       200:
 *         description: Successfully updated the car.
 *       400:
 *         description: Required fields are missing.
 *       404:
 *         description: Car not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/delete/car:
 *   delete:
 *     tags: ['Car Service']
 *     summary: Delete a car
 *     description: Deletes a car from the system by its ID.
 *     parameters:
 *       - in: query
 *         name: car_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the car to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the car.
 *       400:
 *         description: car_id is required.
 *       404:
 *         description: Car not found.
 *       500:
 *         description: Internal server error.
 */

const { checkAdmin } = require("../config/check-is-admin");
const { cars } = require("../models/car.model");

const createCar = async (req, res) => {
  try {
    if (await checkAdmin(req.user.data.id)) {
      const { make, model, year, price_per_day } = req.body;
      if (make && model && year && price_per_day) {
        const new_car = await cars.create({
          make,
          model,
          year,
          price_per_day,
        });
        res.status(201).send({
          data: new_car,
          message: "Yangi mashina yaratildi!",
        });
      } else {
        res.status(400).send({
          message: "make, model, year va price_per_day ni yuborish shart!",
        });
      }
    } else {
      res.status(403).send({
        message: "Sizda ushbu amalni bajarish uchun ruxsat mavjud emas!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Internal server error!",
    });
  }
};

const getCars = async (req, res) => {
  const car_data = await cars.findAll();

  res.send({
    data: car_data,
  });
};

const updateCar = async (req, res) => {
  if (await checkAdmin(req.user.data.id)) {
    try {
      const { car_id, make, model, year, price_per_day } = req.query;
      if (car_id && make && model && year && price_per_day) {
        const [updated_user] = await cars.update(
          {
            make,
            model,
            year,
            price_per_day,
          },
          { where: { id: car_id } }
        );

        if (updated_user === 0) {
          return res.status(404).send({ message: "Bunday user topilmadi!" });
        }
        res.status(200).send({
          message: "User muvaffaqiyatli yangilandi!",
        });
      } else {
        res.status(400).send({
          message:
            "car_id, make, model, year va price_per_day ni yuborish shart!",
        });
      }
    } catch (err) {
      res.status(500).send({
        message: "Internal server error!",
      });
    }
  } else {
    res.status(403).send({
      message: "Sizda ushbu amalni bajarish uchun ruxsat mavjud emas!",
    });
  }
};

const deleteCar = async (req, res) => {
  if (await checkAdmin(req.user.data.id)) {
    try {
      const { car_id } = req.query;
      if (car_id) {
        const deleted_car = await cars.destroy({
          where: { id: car_id },
        });

        if (deleted_car > 0) {
          res.status(200).send({
            message: "Mashina muvaffaqiyatli o'chirildi!",
          });
        } else {
          return res.status(404).send({ message: "Bunday mashina topilmadi!" });
        }
      } else {
        res.status(400).send({
          message: "car_id  ni yuborish shart!",
        });
      }
    } catch (err) {
      res.status(500).send({
        message: "Internal server error!",
      });
    }
  } else {
    res.status(403).send({
      message: "Sizda ushbu amalni bajarish uchun ruxsat mavjud emas!",
    });
  }
};

module.exports = {
  createCar,
  getCars,
  updateCar,
  deleteCar,
};
