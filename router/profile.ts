import express from "express"
const router = express.Router()
import upload from "../utils/multer"

import { editProfile,editImage} from "../controller/profileController"


router.route("/edit/pro/:proId").put(editProfile)
router.route("/edit/image/:proId").put(upload, editImage)


export default router;