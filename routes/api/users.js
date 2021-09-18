const express = require("express");

const {
  register,
  login,
  logout,
  updateAvatar,
  verificationToken,
} = require("../../controllers/users");

const { joiUserSchema } = require("../../models/user");

const {
  validation,
  controllerWrapper,
  authenticate,
  upload,
} = require("../../middlewares");

const router = express.Router();

const userValidationMiddleware = validation(joiUserSchema);

router.post("/signup", userValidationMiddleware, controllerWrapper(register));
router.get("/verify/:verificationToken", controllerWrapper(verificationToken));

router.post("/login", userValidationMiddleware, controllerWrapper(login));
router.get(
  "/logout",
  controllerWrapper(authenticate),
  controllerWrapper(logout)
);
router.patch(
  "/avatars/:id",
  upload.single("avatar"),
  controllerWrapper(updateAvatar)
);

module.exports = router;
