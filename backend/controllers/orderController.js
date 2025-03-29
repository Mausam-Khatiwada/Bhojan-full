import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

import { v4 as uuidv4 } from 'uuid';

const placeOrder = async (req, res) => {
  try {

    const { userId, items, amount, address, transaction_uuid } = req.body;


    if (!userId || !items || !amount || !address || !transaction_uuid) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields in the request.",
      });
    }


    const existingOrder = await orderModel.findOne({ transaction_uuid });
    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: "Duplicate transaction UUID, please try again.",
      });
    }


    const orderId = uuidv4();
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      transaction_uuid,
      orderId, 
    });


    const savedOrder = await newOrder.save();


    await userModel.findByIdAndUpdate(userId, { cartData: {} });


    console.log("Order successfully saved:", savedOrder);


    return res.status(200).json({
      success: true,
      orderId: savedOrder.orderId, 
      message: "Order placed successfully!",
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({
      success: false,
      message: `Error placing the order: ${error.message}`,
    });
  }
};



const userOrders = async (req, res)=>{
  try{
    const orders = await orderModel.find({userId:req.body.userId})
    res.json({success:true, data:orders})
  }
  catch(error){
    console.log(error)
    res.json({success:false, message:"Error"})
  }
}

// listing orders fro admin panel

const listOrders = async(req,res)=>{
  try {
    const orders = await orderModel.find({})
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:"Error"})
  }
}

// API For Updating Order Status

const updateStatus = async(req,res)=>{
  try {
    await orderModel.findOneAndUpdate({orderId:req.body.orderId},{status:req.body.status})
    res.json({success:true, message:"Status Updated"})
  } catch (error) {
    console.log(error);
    res.json({success:false, message:"Error"})
    
  }
}

export { placeOrder, userOrders, listOrders, updateStatus };