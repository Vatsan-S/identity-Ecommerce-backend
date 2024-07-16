import express from "express";
import { productDetails, salesData, savesalesData } from "../Controllers/salesController.js";

const router = express.Router()

router.post("/save_sales_data",savesalesData)
router.get('/sales_data',salesData)
router.get('/dashboard_products', productDetails)

export default router