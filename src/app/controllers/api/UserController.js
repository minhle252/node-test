const UserModel = require("../../models/User");
const PermissionModel = require("../../models/Permission");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const constant = require("../../../config/constantStyle");
dotenv.config();

class UserController {
  getAllUsers = async (req, res, next) => {
    let params = req.query;
    if (!params.admin) {
      params.admin = 0;
    }
    let userList = await UserModel.find({ isAdmin: params.admin });
    if (!userList.length) {
      throw new HttpException(404, "Users not found");
    }
    userList = userList.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({ error: false, data: userList });
  };

  getProfile = async (req, res, next) => {
    if (!req.user) {
      return res.json({ error: true, message: '' })
    } else {
      return res.json({ data: req.user, error: false, message: '' })
    }
  }
  getUserById = async (req, res, next) => {
    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) {
      throw new HttpException(404, "User not found");
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  };

  deleteUserById = async (req, res, next) => {
    try {
      await UserModel.delete(req.params.id);
      return res.json({ message: 'Xóa Thành công!', error: true });
    } catch (error) {
      console.log(error)
      res.json({ message: 'Xóa không thành công! tài khoản đã phát sinh đơn hàng, vui lòng liên hệ: 0333210321 để được hỗ trợ', error: true });
    }

  };

  getUserByuserName = async (req, res, next) => {
    const user = await UserModel.findOne({ username: req.query.username });
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const { password, ...userWithoutPassword } = user;

    return res.json(userWithoutPassword);
  };

  createUser = async (req, res, next) => {
    const { username, email, phone_number, password } = req.body;

    function isValidUsername(username) {
      var pattern = /^[a-zA-Z0-9_]+$/;
      return pattern.test(username);
    }
    if (!isValidUsername(username)) {
      return res.json({ error: true, message: "Username không hợp lệ" });
    }

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.json({ error: true, message: "Username đã tồn tại" });
    }

    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.json({ error: true, message: "Email đã tồn tại" });
    }
    const saltRounds = 10;
    // Mã hóa mật khẩu
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    let data = {
      username,
      email,
      phone_number,
      password: hashedPassword,
    };
    let result = await UserModel.create(data);
    return res.json({ error: false, message: "Đăng ký thành công", result });
  };

  updateUser = async (req, res) => {
    const { id, full_name,  email, phone_number, password, isAdmin } = req.body;

    try {
      const existingUser = await UserModel.findOne({ id });
      if (!existingUser) {
        return res.status(404).json({ error: true, message: "User không tồn tại!" });
      }

      const newData = {full_name};
      const result = await UserModel.update(newData, id);
      return res.json({ error: false, message: "success", result });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: true, message: "An error occurred while updating" });
    }
  };

  createAccessToken = (userId) => {
    const secretKey = process.env.SECRET_JWT;
    const accessToken = jwt.sign({ user_id: userId.toString() }, secretKey, {
      expiresIn: "1d",
    });

    return accessToken;
  };

  createRefreshToken = (userId) => {
    const secretKey = process.env.SECRET_JWT;
    const refreshToken = jwt.sign({ user_id: userId.toString() }, secretKey, {
      expiresIn: "1d",
    });
    return refreshToken;
  };

  // Trong route userLogin
  userLogin = async (req, res, next) => {
    const { email, password, isAdmin } = req.body;
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.json({ message: "Tài khoản không tồn tại !", error: true });
      }

      // if (user.isAdmin === 1) {
      //   return res.json({ message: "Tài khoản không có quyền đăng nhập !", error: true });
      // }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.json({ message: "Email hoặc mật khẩu không chính xác !", error: true });
      }

      const accessToken = this.createRefreshToken(user.id);
      req.session.refreshToken = accessToken;

      return res.json({ message: "Đăng nhập thành công", error: false, accessToken });
    } catch (error) {
      // console.log(error)
      res.json({ message: error, error: true });
    }
  };

}

module.exports = new UserController();
