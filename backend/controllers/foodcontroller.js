import foodModel from "../models/foodmodels.js";
import fs from 'fs'


// add food item

const addFood = async (req,res) =>{

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })
    try{
        await food.save();
        res.json({success:true,message:"Food Added"})
    }
    catch(error){
            console.log(error)
            res.json({success:false,message:"Error"})
    }
}

//All food list

const listFood = async (req,res) =>{
try {
    const foods = await foodModel.find({});
    res.json({success:true, data:foods})
    
} catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
}
}
//Remove food item
const removeFood = async (req,res)=>{
try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`,()=>{})
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({success:true,message:"Food Removed"})
} catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
}
}

const updateFood = async (req, res) => {
    try {
        const { id } = req.body;
        let updateData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category
        };

        // If a new image is uploaded, update the image filename
        if (req.file) {
            // First get the old food item to delete its image
            const oldFood = await foodModel.findById(id);
            if (oldFood.image) {
                fs.unlink(`uploads/${oldFood.image}`, () => {});
            }
            
            updateData.image = req.file.filename;
        }

        const updatedFood = await foodModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true } // Return the updated document
        );

        if (!updatedFood) {
            return res.json({ success: false, message: "Food item not found" });
        }

        res.json({ success: true, message: "Food Updated", data: updatedFood });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating food" });
    }
}

export {addFood,listFood,removeFood, updateFood}