import express from "express";
import { addtask, Login, Logout, register, removetask, updatetask, verify } from "../controllers/Usercontroller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router()

router.post("/register", register)
router.post("/verify",isAuthenticated, verify)
router.post("/login",Login)
router.get("/logout",Logout)
router.post("/addtask",isAuthenticated , addtask)
router.route("/task/:taskId").get(isAuthenticated,updatetask).delete(isAuthenticated,removetask)

export default router