import express from "express";
import { addtocart, createproduct, deleteproduct, editproduct, fetchproducts, productdetails } from "../Controllers/productController.js";


const router = express.Router()


router.post('/create_product', createproduct)
router.get('/fetch_products',fetchproducts)
router.post('/delete_product',deleteproduct)
router.post('/edit_product',editproduct)
router.post('/product_details', productdetails)
router.post('/add_to_cart',addtocart)

export default router