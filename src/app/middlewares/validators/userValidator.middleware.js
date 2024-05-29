const { body, validationResult } = require("express-validator");
const Role = require("../../utils/userRoles.utils");
exports.createUserSchema = [
  body("username")
    .exists()
    .withMessage("username is required")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars long"),
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
  body("phone_number")
    .exists()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .isLength({ max: 10 })
    .withMessage("Password can contain max 10 characters"),
  body("confirm_password")
    .exists()
    .custom((value, { req }) => value === req.body.password)
    .withMessage(
      "confirm_password field must have the same value as the password field"
    ),
];

exports.updateUserSchema = [
  body("username")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars long"),
  body("first_name")
    .optional()
    .isAlpha()
    .withMessage("Must be only alphabetical chars")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars long"),
  body("last_name")
    .optional()
    .isAlpha()
    .withMessage("Must be only alphabetical chars")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars long"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
  body("role")
    .optional()
    .isIn([Role.Admin, Role.SuperUser])
    .withMessage("Invalid Role type"),
  body("password")
    .optional()
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .isLength({ max: 10 })
    .withMessage("Password can contain max 10 characters")
    .custom((value, { req }) => !!req.body.confirm_password)
    .withMessage("Please confirm your password"),
  body("confirm_password")
    .optional()
    .custom((value, { req }) => value === req.body.password)
    .withMessage(
      "confirm_password field must have the same value as the password field"
    ),
  body("age").optional().isNumeric().withMessage("Must be a number"),
  body()
    .custom((value) => {
      return !!Object.keys(value).length;
    })
    .withMessage("Please provide required field to update")
    .custom((value) => {
      const updates = Object.keys(value);
      const allowUpdates = [
        "username",
        "password",
        "confirm_password",
        "email",
        "role",
        "first_name",
        "last_name",
        "age",
      ];
      return updates.every((update) => allowUpdates.includes(update));
    })
    .withMessage("Invalid updates!"),
];

exports.validateLogin = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
  body("password")
    .exists()
    .withMessage("Password is required")
    .notEmpty()
    .withMessage("Password must be filled"),
];

exports.validateCategory = [
  body("name")
    .exists()
    .withMessage("name is required")
    .notEmpty()
    .withMessage("name must be filled"),
  body("slug")
    .exists()
    .withMessage("slug is required")
    .notEmpty()
    .withMessage("slug must be filled"),
];

exports.validateProduct = [
  body("id_category")
    .exists()
    .withMessage("id_category is required")
    .notEmpty()
    .withMessage("Must be a valid id_category"),
  body("name")
    .exists()
    .withMessage("Name is required")
    .notEmpty()
    .withMessage("Name must be filled"),
  body("quantity")
    .exists()
    .withMessage("Quantity is required")
    .notEmpty()
    .withMessage("Quantity must be filled"),
  body("price")
    .exists()
    .withMessage("Price is required")
    .notEmpty()
    .withMessage("Price must be filled"),
  body("des")
    .exists()
    .withMessage("Description is required")
    .notEmpty()
    .withMessage("Description must be filled"),
  body("slug")
    .exists()
    .withMessage("Slug is required")
    .notEmpty()
    .withMessage("Slug must be filled"),
  body("old_price")
    .exists()
    .withMessage("Old price is required")
    .notEmpty()
    .withMessage("Old price must be filled"),
];

exports.checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
