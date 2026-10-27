import { Router } from "express";
import { body } from "express-validator";
import { register, login } from "../controllers/authController.js";

const router = Router();

router.post(
    "/register",
    body("username").trim().isLength({ min: 3, max: 30 }).withMessage("Username must be 3-30 characters"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    register
);

router.post("/login", login);

export default router;