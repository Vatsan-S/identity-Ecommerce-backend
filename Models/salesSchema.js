import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
    productID:{
        type:String,
        required:true
    },
    customerID:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    tagname:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const Sales = mongoose.model("Sales", salesSchema)
export default Sales