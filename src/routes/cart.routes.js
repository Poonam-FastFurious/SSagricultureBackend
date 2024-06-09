import { Router } from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/Cart.controler.js";
import { verifyJWT } from "../middlewares/auth.middlwares.js";

const router = Router();
router.route("/add").post(adminVerifyJWT,addToCart);
router.route("/product").get(verifyJWT, getCart);
router.route("/removeproduct").delete(verifyJWT, removeFromCart);
export default router;
