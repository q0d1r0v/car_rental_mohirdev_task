/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: ['Authentication']
 *     summary: Login a user
 *     description: Authenticates a user with username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *                 description: The username of the user.
 *                 example: "example_user"
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successfully authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   description: JWT access token for the authenticated user.
 *       400:
 *         description: Username or password missing or invalid.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/create/user:
 *   post:
 *     tags: ['User Management']
 *     summary: Create a new user
 *     description: Registers a new user with username, email, password, and role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *                 description: The username of the user.
 *                 example: "new_user"
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: "password123"
 *               role_id:
 *                 type: integer
 *                 description: The role ID of the user.
 *                 example: 1
 *     responses:
 *       201:
 *         description: Successfully created a new user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                   example: "Yangi foydalanuvchi yaratildi!"
 *       400:
 *         description: Bad request, missing required fields.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/v1/get/users:
 *   get:
 *     tags: ['User Management']
 *     summary: Get all users
 *     description: Retrieves a list of all registered users.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/v1/update/user:
 *   put:
 *     tags: ['User Management']
 *     summary: Update a user
 *     description: Updates an existing user's details.
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to update.
 *       - in: query
 *         name: user_name
 *         required: true
 *         schema:
 *           type: string
 *         description: The new username for the user.
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The new email for the user.
 *       - in: query
 *         name: old_password
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's current password.
 *       - in: query
 *         name: new_password
 *         required: true
 *         schema:
 *           type: string
 *         description: The new password for the user.
 *       - in: query
 *         name: role_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The new role ID for the user.
 *     responses:
 *       200:
 *         description: Successfully updated the user.
 *       400:
 *         description: Missing required fields.
 *       404:
 *         description: User not found or incorrect password.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/delete/user:
 *   delete:
 *     tags: ['User Management']
 *     summary: Delete a user
 *     description: Deletes a user by their ID.
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the user.
 *       400:
 *         description: Missing user_id.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

const bcrypt = require("bcrypt");
const { users } = require("../models/user.model");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const { user_name, password } = req.body;
    if (user_name && password) {
      const user = await users.findOne({ where: { username: user_name } });
      if (user) {
        const check = bcrypt.compareSync(password, user.password);
        if (check) {
          const access_token = jwt.sign(
            { data: user },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "48h" }
          );
          res.status(200).send({
            access_token,
          });
        } else {
          res.status(400).send({
            message:
              "Bunday foydalanuvchi topilmadi yoki parol notog'ri kiritildi!",
          });
        }
      } else {
        res.status(400).send({
          message:
            "Bunday foydalanuvchi topilmadi yoki parol notog'ri kiritildi!",
        });
      }
    } else {
      res.status(400).send({
        message: "user_name va password ni yuborish shart!",
      });
    }
  } catch (err) {
    res.status(500).send({
      error: err,
      message: "Internal server error!",
    });
  }
};
const createUser = async (req, res) => {
  if (await checkAdmin(req.user.data.id)) {
    try {
      const { user_name, email, password, role_id } = req.body;
      if (user_name && email && password && role_id) {
        const hashed_password = await bcrypt.hash(password, 10);
        const new_user = await users.create({
          username: user_name,
          email,
          password: hashed_password,
          role_id,
        });
        res.status(201).send({
          data: new_user,
          message: "Yangi foydalanuvchi yaratildi!",
        });
      } else {
        res.status(400).send({
          message: "user_name, email, password va role_id ni yuborish shart!",
        });
      }
    } catch (err) {
      console.log(err);
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
const getUsers = async (req, res) => {
  if (await checkAdmin(req.user.data.id)) {
    const user_data = await users.findAll();

    res.send({
      data: user_data,
    });
  } else {
    res.status(403).send({
      message: "Sizda ushbu amalni bajarish uchun ruxsat mavjud emas!",
    });
  }
};
const updateUser = async (req, res) => {
  if (await checkAdmin(req.user.data.id)) {
    try {
      const { user_id, user_name, email, old_password, new_password, role_id } =
        req.query;
      if (
        user_id &&
        user_name &&
        email &&
        old_password &&
        new_password &&
        role_id
      ) {
        const user = await users.findOne({ where: { id: ~~user_id } });
        if (user) {
          const check = bcrypt.compareSync(old_password, user.password);
          if (check) {
            const hashed_password = bcrypt.hashSync(new_password, 10);
            await users.update(
              {
                username: user_name,
                email,
                password: hashed_password,
                role_id,
              },
              { where: { id: user_id } }
            );
            res.status(200).send({
              message: "Foydalanuvchi muvaffaqiyatli yangilandi!",
            });
          } else {
            res.status(404).send({
              message: "Foydalanuvchining eski paroli notog'ri kiritildi!",
            });
          }
        } else {
          res.status(404).send({
            message: "Bunday foydalanuvchi topilmadi!",
          });
        }
      } else {
        res.status(400).send({
          message:
            "user_name, email, new_password, old_password va role_id ni yuborish shart!",
        });
      }
    } catch (err) {
      res.status(500).send({
        error: err,
        message: "Internal server error!",
      });
    }
  } else {
    res.status(403).send({
      message: "Sizda ushbu amalni bajarish uchun ruxsat mavjud emas!",
    });
  }
};

const deleteUser = async (req, res) => {
  if (await checkAdmin(req.user.data.id)) {
    try {
      const { user_id } = req.query;
      if (user_id) {
        const deleted_user = await users.destroy({
          where: { id: user_id },
        });

        if (deleted_user > 0) {
          res.status(200).send({
            message: "Foydalanuvchi muvaffaqiyatli o'chirildi!",
          });
        } else {
          return res
            .status(404)
            .send({ message: "Bunday foydalanuvchi topilmadi!" });
        }
      } else {
        res.status(400).send({
          message: "user_id  ni yuborish shart!",
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
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  loginUser,
};
