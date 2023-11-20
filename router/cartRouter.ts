import express from "express"
const router = express.Router()

import { addToCart, RemovefromCart} from "../controller/cartController"


router.route("/create-cart/:userId/:productid").post(addToCart)
router.route("/delete-item/:userId").post(RemovefromCart)





export default router;