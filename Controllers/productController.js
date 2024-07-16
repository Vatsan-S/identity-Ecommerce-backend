import Product from "../Models/productSchema.js";
import User from "../Models/userSchema.js";

export const createproduct = async(req,res)=>{
    const{image1,image2,image3,image4,image5,title,price,about,category,seller,stock,tagname}=req.body
    try {
        const newProduct = new Product({image1,image2,image3,image4,image5,title,price,about,category,seller,stock,tagname})
        await newProduct.save()
        res.status(200).json({message:"User created Successfully"})
    } catch (error) {
        res.status(500).json({message:"Internal server error in creating Product"})
    }
}

export const fetchproducts = async(req,res)=>{
    try {
        const products = await Product.find()
        res.status(200).json({result:products})
    } catch (error) {
        res.status(500).json({message:"Internal Server error in fetching products"})
    }
}

export const deleteproduct = async(req,res)=>{
    const {productID}= req.body
    try {
        await Product.deleteOne({_id:productID})
        res.status(200).json({message:"Product deleted Successfully"})
    } catch (error) {
        res.status(500).json({message:"Internal server error in deleting product"})
    }
    console.log(req.body)
}

export const editproduct = async(req,res)=>{
    const {image1,image2,image3,image4,image5,title,price,availability,about,category,seller,stock,id} = req.body
  try {
    const selectedProduct =  await Product.findOneAndUpdate({_id:id},{image1,image2,image3,image4,image5,title,price,availability,about,category,seller,stock})
  console.log(selectedProduct)
  res.status(200).json({message: "User updated Successfully"})
  } catch (error) {
    res.status(500).json({message:"Internal server error in editing product"})
  }
}

export const productdetails = async(req,res)=>{
    const {id,userID} = req.body
    // console.log(id)
    try {
        const productDetails = await Product.findOne({_id:id})
        const userDetail = await User.findOne({_id:userID})
        res.status(200).json({result:productDetails, userDetail:userDetail})
    } catch (error) {
        res.status(500).json({message:"Internal server error in fetching product details"})
    }
}


export const addtocart = async (req, res) => {
    const { productID, userID, count } = req.body;
  
    try {
      const result = await User.updateOne(
        { _id: userID },
        {
          $push: {
            cartlist: {
              id: productID,
              count: count
            }
          }
        }
      );
  
      if (result.nModified === 0) {
        return res.status(404).json({ message: "User not found or no change in cart list" });
      }
  
      res.status(200).json({ message: "Added to cart successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error in adding to cart" });
    }
  };
  