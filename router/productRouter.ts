import express from "express"
import {createProduct } from "../controller/productController"

const router = express.Router()

router.route("/create-product/:catId").post( createProduct)
export default router;