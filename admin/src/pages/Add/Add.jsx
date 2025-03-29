import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from "axios";
import { toast } from 'react-toastify';
import { FiUpload, FiType, FiAlignLeft, FiTag } from 'react-icons/fi';

const Add = ({ url }) => {
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Vegetarian'
  });

  const categories = [
    'Vegetarian',
    'Non-Vegetarian',
    'Snacks',
    'Desserts',
    'Soup',
    'Side',
    'Main Course',
    'Noodles'
  ];

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    // Validate form
    if (!data.name.trim()) {
      toast.error('Please enter a product name');
      return;
    }
    if (!data.description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    if (!data.price || Number(data.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    if (!image) {
      toast.error('Please upload an image');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("image", image);

      const response = await axios.post(`${url}/api/food/add`, formData);
      
      if (response.data.success) {
        setData({
          name: '',
          description: '',
          price: '',
          category: 'Vegetarian'
        });
        setImage(null);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add food item");
      console.error("Error adding food:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='add-food-container'>
      <div className="add-food-header">
        <h2>Add New Food Item</h2>
        <p>Fill in the details to add a new item to your menu</p>
      </div>

      <form className='add-food-form' onSubmit={onSubmitHandler}>
        {/* Image Upload */}
        <div className="form-group image-upload-group">
          <label className="form-label">
            <FiUpload className="input-icon" /> Food Image
          </label>
          <div className="image-upload-container">
            <label htmlFor="image" className="image-upload-label">
              {image ? (
                <div className="image-preview-container">
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt="Preview" 
                    className="image-preview"
                  />
                  <span className="change-image-text">Change Image</span>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <img src={assets.upload_area} alt="Upload area" />
                  <span>Click to upload</span>
                </div>
              )}
            </label>
            <input 
              onChange={(e) => setImage(e.target.files[0])} 
              type="file" 
              id="image" 
              accept="image/*"
              hidden 
              required 
            />
          </div>
        </div>

        {/* Product Name */}
        <div className="form-group">
          <label className="form-label">
            <FiType className="input-icon" /> Product Name
          </label>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="e.g. Chicken MOMO"
            className="form-input"
          />
        </div>

        {/* Product Description */}
        <div className="form-group">
          <label className="form-label">
            <FiAlignLeft className="input-icon" /> Description
          </label>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="5"
            placeholder="Describe the food item..."
            className="form-textarea"
            required
          />
        </div>

        {/* Category and Price */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <FiTag className="input-icon" /> Category
            </label>
            <select
              onChange={onChangeHandler}
              value={data.category}
              name="category"
              className="form-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <div className="input-icon" /> Price (Rs)
            </label>
            <div className="price-input-container">
              <span className="currency-symbol">Rs</span>
              <input
                onChange={onChangeHandler}
                value={data.price}
                type="number"
                name="price"
                min="0"
                step="0.01"
                placeholder="200"
                className="form-input price-input"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Food Item'}
        </button>
      </form>
    </div>
  );
};

export default Add;