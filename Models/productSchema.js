import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
        title:{
            type:String,
            required:true,
            unique:true
        },
        image1:{
            type:String,
            required:true
        },
        image2:{
            type:String,
            required:true
        },
        image3:{
            type:String,
            required:true
        },
        image4:{
            type:String,
            
        },
        image5:{
            type:String,
            
        },
        price:{
            type:Number,
            required:true
        },
        tagname:{
            type:String,
            required: true
        },
        category:{
            type:String,
            required:true
        },
        about:{
            type:String,
            required:true
        },
        seller:{
            type:String,
            required:true
        },
        stock:{
            type:Number,
            required:true
        }
})

const Product = mongoose.model("Product",productSchema)
export default Product