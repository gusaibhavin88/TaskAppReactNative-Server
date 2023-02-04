import express from "express";
import { addtask, forgotPassword, getMyProfile, Login, Logout, register, removetask, resetPassword, updatePassword, updateProfile, updatetask, verify } from "../controllers/Usercontroller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router()

router.post("/register", register)
router.post("/verify",isAuthenticated, verify)
router.post("/login",Login)
router.get("/logout",Logout)
router.post("/addtask",isAuthenticated , addtask)
router.route("/task/:taskId").get(isAuthenticated,updatetask).delete(isAuthenticated,removetask)
router.get("/me",isAuthenticated ,getMyProfile)
router.post("/updateprofile",isAuthenticated ,updateProfile)
router.post("/updatepassword",isAuthenticated ,updatePassword)
router.post("/forgotpassword",forgotPassword)
router.put("/resetpassword",resetPassword)


export default router