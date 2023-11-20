import express from "express"
const router = express.Router()

import { createCat} from "../controller/categoryController"


router.route("/create-category/:userId").post( createCat)







export default router;