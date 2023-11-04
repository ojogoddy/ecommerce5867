import express from "express"
const router = express.Router()

import { addToCart, removeFromCart} from "../controller/cartController"


router.route("/create-cart/:userId/:productid").post(addToCart)
router.route("/delete-item/:userId").post(removeFromCart)





export default router;