/**
 * @swagger
 * /admin/api/v1/get/roles:
 *   get:
 *     tags: ['Roles Service']
 *     summary: Get all roles
 *     description: Retrieves a list of all roles.
 *     responses:
 *       200:
 *         description: A list of roles.
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
 *                         description: The unique identifier of the role.
 *                         example: 1
 *                       role_name:
 *                         type: string
 *                         description: The name of the role.
 *                         example: "Admin"
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/create/role:
 *   post:
 *     tags: ['Roles Service']
 *     summary: Create a new role
 *     description: Creates a new role with the provided name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_name:
 *                 type: string
 *                 description: The name of the role
 *                 example: "Manager"
 *     responses:
 *       201:
 *         description: Successfully created a new role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     role_name:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: "Yangi role yaratildi!"
 *       400:
 *         description: Bad request, role_name is required.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/update/role:
 *   put:
 *     tags: ['Roles Service']
 *     summary: Update a role
 *     description: Updates an existing role's name by its ID.
 *     parameters:
 *       - in: query
 *         name: role_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the role to update.
 *       - in: query
 *         name: role_name
 *         required: true
 *         schema:
 *           type: string
 *         description: The new name of the role.
 *     responses:
 *       200:
 *         description: Successfully updated the role.
 *       400:
 *         description: role_id and role_name are required.
 *       404:
 *         description: Role not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/delete/role:
 *   delete:
 *     tags: ['Roles Service']
 *     summary: Delete a role
 *     description: Deletes a role by its ID.
 *     parameters:
 *       - in: query
 *         name: role_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the role to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the role.
 *       404:
 *         description: Role not found.
 *       400:
 *         description: role_id is required.
 *       500:
 *         description: Internal server error.
 */

const { checkAdmin } = require("../config/check-is-admin");
const { roles } = require("../models/role.model");

const createRole = async (req, res) => {
  if (await checkAdmin(req.user.data.id)) {
    try {
      const { role_name } = req.body;
      if (role_name) {
        const new_role = await roles.create({
          role_name,
        });
        res.status(201).send({
          data: new_role,
          message: "Yangi role yaratildi!",
        });
      } else {
        res.status(400).send({
          message: "role_name ni yuborish shart!",
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
const getRoles = async (req, res) => {
  if (await checkAdmin(req.user.data.id)) {
    const roles_data = await roles.findAll();

    res.send({
      data: roles_data,
    });
  } else {
    res.status(403).send({
      message: "Sizda ushbu amalni bajarish uchun ruxsat mavjud emas!",
    });
  }
};
const updateRole = async (req, res) => {
  if (await checkAdmin(req.user.data.id)) {
    try {
      const { role_id, role_name } = req.query;
      if (role_id && role_name) {
        const [updated_role] = await roles.update(
          {
            role_name,
          },
          { where: { id: role_id } }
        );

        if (updated_role === 0) {
          return res.status(404).send({ message: "Bunday role topilmadi!" });
        }
        res.status(200).send({
          message: "Role muvaffaqiyatli yangilandi!",
        });
      } else {
        res.status(400).send({
          message: "role_id va role_name ni yuborish shart!",
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

const deleteRole = async (req, res) => {
  if (await checkAdmin(req.user.data.id)) {
    try {
      const { role_id } = req.query;
      if (role_id) {
        const deleted_role = await roles.destroy({
          where: { id: role_id },
        });

        if (deleted_role > 0) {
          res.status(200).send({
            message: "Role muvaffaqiyatli o'chirildi!",
          });
        } else {
          return res.status(404).send({ message: "Bunday role topilmadi!" });
        }
      } else {
        res.status(400).send({
          message: "role_id  ni yuborish shart!",
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
  createRole,
  getRoles,
  updateRole,
  deleteRole,
};
