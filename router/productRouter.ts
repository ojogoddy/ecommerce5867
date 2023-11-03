import express from "express"
const router = express.Router()
import {verifyToken} from "../utils/verify"

import {creatProduct } from "../controller/productController"


router.route("/create-product/:catId").post(verifyToken, creatProduct)
export default router;