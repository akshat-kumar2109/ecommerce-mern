import { Router } from "express";

import { loginController, forgotPasswordController, resetPasswordHandler } from "../controllers/auth/loginController.js";
import { registerController } from "../controllers/auth/registerController.js";

const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/forgot-password", forgotPasswordController)
router.post("/forgot-password/:token", resetPasswordHandler)

export default router;
