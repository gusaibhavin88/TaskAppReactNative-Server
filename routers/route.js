import express from "express";
import { Login, Logout, register, verify } from "../controllers/Usercontroller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router()

router.post("/register", register)
router.post("/verify",isAuthenticated, verify)
router.post("/login",Login)
router.get("/logout",Logout)

export default router