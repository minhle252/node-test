const express = require("express");
const UserController = require("../../app/controllers/api/UserController");
const {
	createUserSchema,
	validateLogin,
	checkValidationResult,
} = require("../../app/middlewares/validators/userValidator.middleware");
const {
	authenticateRefreshToken,
	authenticateToken,
	authenticateTokenAdmin,
} = require("../../app/middlewares/auth");
const router = express.Router();

router.get("/profile", authenticateToken, UserController.getProfile);
router.put("/update", authenticateToken, UserController.updateUser);
router.post(
	"/register",
	createUserSchema,
	checkValidationResult,
	UserController.createUser
);
router
	.post(
	"/login",
	validateLogin,
	checkValidationResult,
	UserController.userLogin
);
router.get(
	"/get-all-user",
	authenticateToken,
	// authenticateTokenAdmin,
	UserController.getAllUsers
);
router.get(
	"/get-user-by-id/:id",
	authenticateToken,
	// authenticateRefreshToken,
	// authenticateTokenAdmin,
	UserController.deleteUserById
);
router.post(
	"/delete-user-by-id/:id",
	authenticateToken,
	UserController.deleteUserById
);


module.exports = router;
