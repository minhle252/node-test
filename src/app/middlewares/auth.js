const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const addTokenHeader = (req, res, next) => {
  const refreshToken = req.session.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ error: true, message: "Không có token !" })
  }
  req.headers.authorization = `Bearer ${refreshToken}`;
  next();
}

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1]; // Bearer token
      // const token = authHeader;
      const secretKey = process.env.SECRET_JWT;
      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          console.log(err)
          return res.sendStatus(403); // Forbidden
        }

        const userId = decoded.user_id;
        const user = await UserModel.findOne({ id: userId });
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
        req.token = token;
        next();
      });
    } else {
      res.sendStatus(401); // Unauthorized
    }
  } catch (error) {
    console.log(error);
  }
};

const authenticateTokenAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin === 1) {
    next();
  } else {
    res.sendStatus(403); // Forbidden
  }
};

const authenticateRefreshToken = (req, res, next) => {
  const refreshToken = req.session.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: true, message: "Refresh token not provided!" });
  }
  const secretKey = process.env.SECRET_JWT;

  jwt.verify(refreshToken, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: true, message: "Invalid refresh token!" });
    }
    const userId = decoded.user_id;
    const user = await UserModel.findOne({ id: userId });
    req.user = user;
    req.token = refreshToken;
    next();
  });
};

module.exports = {
  addTokenHeader,
  authenticateToken,
  authenticateTokenAdmin,
  authenticateRefreshToken,
};
