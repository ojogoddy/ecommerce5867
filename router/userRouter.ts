import express from "express"
const router = express.Router()

import { registerUser,getSingleUser,LoginUser, logOut, getAllUser, verifyUser} from "../controller/userController"


router.route("/register/user").post(registerUser)
router.route("/login").post(LoginUser)
router.route("/log-out").post(logOut)
router.route("/getAll-user").get(getAllUser)
router.route("/single-user/:id").get(getSingleUser)
router.route("/account-verify/:id").get(verifyUser)





export default router;