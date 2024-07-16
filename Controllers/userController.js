import User from "../Models/userSchema.js";
import bcryptjs from "bcryptjs";
import transporter from "../Services/nodemailer.js";
import jwt from "jsonwebtoken";
import Product from "../Models/productSchema.js";
import mongoose from "mongoose";

export const register = async (req, res) => {
  const { username, email, password,role } = req.body;

  //   =======================================validation========================================
  if (
    username === "" ||
    email === "" ||
    password === "" ||
    !username ||
    !email ||
    !password
  ) {
    return res.status(400).json({ message: "All Fields are Mandatory" });
  }
  if (username.length < 3) {
    return res
      .status(400)
      .json({ message: "Username must have 3 or more characters" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must have 6 or more characters" });
  }
  let userAlready = await User.findOne({ email: email });
  if (userAlready) {
    return res.status(401).json({ message: "Email Already Exists" });
  }
  //  ===============================================================hashingPassword======================================
  const hashedPassword = await bcryptjs.hashSync(password, 10);

  // ===============================================================Random string genrator to compare for activating account=============
  const randomStringGenerator = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456798!@#$%^&*()_+";
    let randomid = "";
    for (var i = 0; i < length; i++) {
      let randomNo = Math.floor(Math.random() * 72);
      randomid += characters.charAt(randomNo);
    }
    return randomid;
  };
  const randomString = randomStringGenerator(7);

  //   =================================================================send a link to activate account================================
  const mailoptions = {
    from: "vatsan.designs@gmail.com",
    to: "info.creatorstock@gmail.com",
    subject: "Account Activation Link",
    html: `<a href="http://localhost:5173/activate_account/${randomString}/${email}">Activate Account</a>`,
  };
  transporter.sendMail(mailoptions);

  //=========================================================Save new user in deb=====================================
  try {
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      randomString,
      role
    });
    await newUser.save();
    res.status(200).json({ message: "User registerd Successfully" });
    // =======================================================error handling===========================================
  } catch (error) {
    res.status(500).json({ message: "Internal server error in registeration" });
  }
};

export const activation = async (req, res) => {
  const { id, email } = req.body;
  // ==========================================validation================================
  if (!id || !email || email === "" || id === "") {
    return res.status(404).json({ message: "Broken Link" });
  }

  //==========================================activation process=========================

  const userFromLink = await User.findOne({ email: email });
  if (!userFromLink) {
    return res.status(404).json({ messgae: "Invalid Link" });
  }
  try {
    if (id === userFromLink.randomString) {
      await User.findOneAndUpdate(
        { email },
        { activation: true, randomString: "" }
      );
    } else {
      res.status(401).json({ message: "Link Mismatch" });
    }
    res.status(200).json({ message: "Activation Done" });
  } catch (error) {
    res.status(500).json("Internal Server Error in Activation");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // ======================================validation==========================================
  const selectedUser = await User.findOne({ email });
  if (!selectedUser) {
    return res.status(404).json({ message: "User not found" });
  }
  if (selectedUser.activation === false) {
    return res.status(401).json({
      message:
        "Account Not activated, Please check your mail for activation link",
    });
  }

  try {
    const comparedPassword = await bcryptjs.compareSync(
      password,
      selectedUser.password
    );
    if (!comparedPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // ====================================token generation=====================================
    const token = jwt.sign(
      { id: selectedUser._id, role: selectedUser.role },
      process.env.JWT_SECRETKEY
    );
    res.status(200).json({ message: "Login Successfull", token, selectedUser });
  } catch (error) {}
  console.log(selectedUser);
};

export const forgot_password = async (req, res) => {
  const { email } = req.body;

  // ==================================validation=====================================
  const userDetails = await User.findOne({ email: email });
  if (!userDetails) {
    return res.status(404).json({ message: "User not Found" });
  }

  // ====================================Random string generation for link validation=============
  const randomStringGenerator = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456798";
    let randomid = "";

    for (var i = 0; i < length; i++) {
      let randomNo = Math.floor(Math.random() * 72);
      randomid += characters.charAt(randomNo);
    }
    return randomid;
  };
  const randomString = randomStringGenerator(7);
  try {
    await User.findOneAndUpdate({ email }, { randomString: randomString });

    // ================================mailing the link========================================
    const mailOptions = {
      from: "vatsan.designs@gmail.com",
      to: email,
      subject: "Link to Reset Password",
      html: `<a href="http://localhost:5173/reset_password/${email}/${randomString}"> Click Here to reset your Password</a>`,
    };
    transporter.sendMail(mailOptions)
    res.status(200).json({message:"Email Sent", data:true})
  } catch (error) {
    res.status(500).json({message:"Internal server error in Forgot Password"})
  }
};


export const reset_password = async(req,res)=>{
    const {id,email,newPassword}= req.body
    // ==================================================validation==================================
    if(newPassword===''||!newPassword){
        return res.status(401).json({message:"All Fields are mandatory"})
    }
    if(id===''||email===''||!id||!email){
        return res.status(401).json({message:"Broken link"})
    }
    if(newPassword.length <6){
      return res.status(401).json({message:"Password must have 6 or more characters"})
  }
    const userDetails = await User.findOne({email:email})
    if(!userDetails || userDetails.randomString !== id){
        return res.status(404).json({message:"Invalid Link"})
    }
    

    // ==================================================hashingPassword===============================
    try {
        const hashedPassword = await bcryptjs.hashSync(newPassword,10)
    
    // =================================================find & update password===========================
    await User.findOneAndUpdate({email},{password:hashedPassword, randomString:''})
    res.status(200).json({message:"Password Updated Successfully", data:true})

    } catch (error) {
       res.status(500).json({message:"Internal Server Error in password reseting"}) 
    }
}


export const fetchSeller = async(req,res)=>{
  try {
    const sellers = await User.find({role:"Seller"})
  res.status(200).json({result:sellers})
  } catch (error) {
    res.status(500).json({message:"Internal Server Error in fetching Sellers"})
  }
  
  
}

export const cartlist = async(req,res)=>{//work obn  this
  const{userID} = req.body
  try {
    const user = await User.findOne({_id:userID})// replace with lookup
    const cartList = user.cartlist
    let cartListId = []
    cartList.forEach((ele)=>{cartListId.push(ele.id)})
    
    const all = await Product.find({_id:{$in:cartListId}})

    const productMap = new Map()
    all.forEach((ele)=>{
      productMap.set(ele._id.toString(),ele)
    })

    const sorted = cartListId.map((ele)=>{
      return productMap.get(ele.toString())
    })

   
    
    
    res.status(200).json({result:sorted, countData:user.cartlist, cartlist:cartListId})
  } catch (error) {
    res.status(500).json({message:"Internal server error in fetching cart list"})
  }
}




export const cartlistcount = async(req,res)=>{
  const{value,index,currentUser}= req.body
  // console.log(value,index,currentUser)
  
  try {
    const user = await User.findOne({_id:currentUser})
    const productID = user.cartlist[index].id
    const updatingUser = await User.updateOne({_id:currentUser},{$set:{"cartlist.$[element].count": value}},{arrayFilters: [{ "element.id": productID }]})
    const updatedUser = await User.findOne({_id:currentUser})
    res.status(200).json({message:"Count Updated", countData:updatedUser.cartlist})
    // console.log(updatedUser)
  } catch (error) {
    res.status(500).json({message:"Internal server error in updating count"})
  }
}

export const removefromcart = async(req,res)=>{ 
  const {userID, productID} = req.body
  
  try {
    const user = await User.updateOne(
      { _id: userID },
      { $pull: { cartlist: { id: productID } } }
    );
    res.status(200).json({message:"User cartlist updated"})
  } catch (error) {
    res.status(500).json({message:"Internal server error in removing product from cart"})
  }
}