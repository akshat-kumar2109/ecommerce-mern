import { Router } from "express";

import { loginController } from "../controllers/auth/loginController.js";
import { registerController } from "../controllers/auth/registerController.js";

const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);

export default router;
