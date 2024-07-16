import express from "express";
import { activation, cartlist, cartlistcount, fetchSeller, forgot_password, login, register, removefromcart, reset_password } from "../Controllers/userController.js";

const router = express.Router()

router.post('/register',register)
router.post('/login', login)
router.post('/activation', activation)
router.post('/forgot_password', forgot_password)
router.post('/reset_password', reset_password)

router.get('/fetch_seller', fetchSeller)
router.post('/cart_products',cartlist)
router.post('/cart_list_count', cartlistcount)
router.post('/remove_from_cart',removefromcart)

export default router