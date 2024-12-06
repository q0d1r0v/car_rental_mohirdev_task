const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "Token yuborish majburiy!" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).send({ message: "Noto'g'ri token kiritildi!" });
    }
  } catch (err) {
    res.status(500).send({
      error: err,
      message: "Internal server error!",
    });
  }
};

module.exports = {
  authMiddleware,
};
