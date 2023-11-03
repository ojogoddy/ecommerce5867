import express from "express"
const router = express.Router()

import { addToCart} from "../controller/cartController"


router.route("/create-cart/:userId/:productid").post(addToCart)






export default router;