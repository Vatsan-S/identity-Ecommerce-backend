import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String
        
    },
    password:{
        type:String,
        required:true
    },
    randomString:{
        type:String
    },
    activation:{
        type:Boolean,
        default:false
    },
    cartlist: [{
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product' 
        },
        count: {
          type: Number,
          required: true
        }
      }]
})


const User = mongoose.model("User", userSchema)
export default User