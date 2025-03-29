import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

// Login User Function

const loginUser = async (req,res)=>{
const {email,password} = req.body;
try {
    const user = await userModel.findOne({email})

    if (!user) {
        return res.json({success:false,message:"User Doesn't exist"}) 
    }
    const isMatch = await bcrypt.compare(password,user.password)

    if (!isMatch) {
        return res.json({success:false,message:"Invalid Credentials"})
    }
const token = createToken(user._id);
res.json({success:true,token})

} catch (error) {
    console.log(error)
    res.json({success:false,message:"Error"})
}

}
const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

// register user Function

const registerUser = async (req,res) =>{
const {name,password,email} = req.body;

try {
    //  checking if user already exist or not
    const exists = await userModel.findOne({email});
    if (exists) {
        return res.json({success:false,message:"User already exist!"})
    } 
    if (!validator.isEmail(email)) {
        return res.json({success:false,message:"Please enter a valid Email."})
    }
    if (password.length<8) {
       return res.json({success:false,message:"Please enter a strong password"}) 
    }
    //Hashing user Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser = new userModel({
        name:name,
        email:email,
        password:hashedPassword
    })

 const user = await newUser.save()
const token = createToken(user._id)
res.json({success:true,token})

} catch (error) {
    console.log(error);
    res.json({success:false, message:"Error"})
}


}
const getAllUsers = async (req, res) => {

    try {
        const users = await userModel.find()
        res.json({success:true, users})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:"Server Error"})
    }
};
const deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Check if the user exists
        const user = await userModel.findById(id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Delete the user
        await userModel.findByIdAndDelete(id);
        
        res.json({ success: true, message: "User deleted successfully" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    
    try {
        // Check if the user exists
        const user = await userModel.findById(id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Validate email if provided
        if (email && !validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Hash new password if provided
        let hashedPassword;
        if (password) {
            if (password.length < 8) {
                return res.json({ success: false, message: "Password must be at least 8 characters" });
            }
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // Prepare update data
        const updateData = {
            name: name || user.name,
            email: email || user.email,
            ...(password && { password: hashedPassword }) // Only include if password exists
        };

        // Update the user
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true } // Return the updated document
        );
        
        res.json({ 
            success: true, 
            message: "User updated successfully",
            user: updatedUser 
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
export {loginUser, registerUser, getAllUsers, deleteUser, updateUser}