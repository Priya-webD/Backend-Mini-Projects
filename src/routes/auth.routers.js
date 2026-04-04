import {Router} from "express";
import {registerUser} from "../controllers/auth.controller.js";

const router = Router();
// Register router
router.route("/register").post(registerUser);

export default router;