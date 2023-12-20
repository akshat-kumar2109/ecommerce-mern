import { Router } from "express";

import { addProduct } from "../controllers/productController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

router.post("/admin/product/new", isLoggedIn, isAdmin, addProduct);

export default router;
