const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function authentication(req, res, next) {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1]; // Format: Bearer <token>
    if (!accessToken) throw { name: "Unauthorized" };

    console.log(accessToken, "==> INI APA SIH?");

    // JWT SECRET HARUS SAMA JWT.SIGN
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET); // ganti 'JWT_SECRET' dengan env nanti
    const user = await User.findByPk(decoded.id);

    if (!user) throw { name: "Unauthorized" };

    // INI RE-ASSIGN REQ.USER
    req.user = { id: user.id, email: user.email, role: user.role };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or missing token" });
  }
}

module.exports = authentication;
