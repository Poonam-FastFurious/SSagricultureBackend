import { Router } from "express";
import { addPrivacyPolicy, getPrivacyPolicy } from "../controllers/Privacypolicy.controler.js";


const router = Router();
router.route("/add").post(addPrivacyPolicy);
router.get('/privacy-policy', getPrivacyPolicy);

export default router;
