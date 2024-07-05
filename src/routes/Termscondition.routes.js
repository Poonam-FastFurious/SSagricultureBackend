import { Router } from "express";

import { addtermscondition, getAllTermsConditions } from "../controllers/termscondition.controler.js";


const router = Router();
router.route("/add").post(addtermscondition);
router.route("/all").get(getAllTermsConditions);

export default router;
