import express from "express"
const router = express.Router()

import { registerUser,getSingleUser,LoginUser, logOut} from "../controller/userController"


router.route("/register/user").post(registerUser)
router.route("/login").post(LoginUser)
router.route("/log-out").post(logOut)
router.route("/single-user/:id").get(getSingleUser)





export default router;