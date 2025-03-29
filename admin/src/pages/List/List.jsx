import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiSave, FiX } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching food items");
      }
    } catch (error) {
      toast.error("Failed to load food items");
      console.error("Error fetching food list:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFood = async (foodId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      await fetchList();
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Error deleting item");
      }
    } catch (error) {
      toast.error("Failed to delete food item");
      console.error("Error deleting food:", error);
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleUpdateFood = async (foodId) => {
    try {
      const response = await axios.put(`${url}/api/food/update`, {
        id: foodId,
        ...editFormData
      });
      
      if (response.data.success) {
        toast.success("Food item updated successfully");
        setEditingId(null);
        fetchList();
      } else {
        toast.error(response.data.message || "Error updating item");
      }
    } catch (error) {
      toast.error("Failed to update food item");
      console.error("Error updating food:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleAddFoodClick = () => {
    navigate('/add');
  };

  const filteredItems = list.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(list.map(item => item.category))];

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='food-list-container'>
      <div className="food-list-header">
        <h2>Food Items Management</h2>
        <p>Manage your restaurant's menu items</p>
      </div>

      <div className="food-list-controls">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search food items"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by category"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          
          <button onClick={handleAddFoodClick} className="add-food-btn">
            <FiPlus /> Add New Food
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading menu items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="no-items">
          <img src="/empty-state.svg" alt="No items found" />
          <p>No food items found matching your criteria</p>
          <button onClick={handleAddFoodClick} className="add-food-btn">
            <FiPlus /> Add Your First Food Item
          </button>
        </div>
      ) : (
        <div className="table-responsive-wrapper">
          <div className="food-list-table">
            <div className="table-header">
              <div className="header-cell image">Image</div>
              <div className="header-cell name">Name</div>
              <div className="header-cell description">Description</div>
              <div className="header-cell category">Category</div>
              <div className="header-cell price">Price</div>
              <div className="header-cell actions">Actions</div>
            </div>
            
            <div className="table-body">
              {filteredItems.map((item) => (
                <div key={item._id} className={`table-row ${editingId === item._id ? 'editing' : ''}`}>
                  <div className="table-cell image-cell">
                    <img 
                      src={`${url}/images/${item.image}`} 
                      alt={item.name} 
                      className="food-image"
                      onError={(e) => {
                        e.target.src = '/food-placeholder.png';
                      }}
                      loading="lazy"
                    />
                  </div>
                  
                  {editingId === item._id ? (
                    <>
                      <div className="table-cell name-cell">
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditFormChange}
                          className="edit-input"
                          placeholder="Item name"
                          aria-label="Food name"
                        />
                      </div>
                      <div className="table-cell description-cell">
                        <input
                          type="text"
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditFormChange}
                          className="edit-input"
                          placeholder="Description"
                          aria-label="Food description"
                        />
                      </div>
                      <div className="table-cell category-cell">
                        <input
                          type="text"
                          name="category"
                          value={editFormData.category}
                          onChange={handleEditFormChange}
                          className="edit-input"
                          placeholder="Category"
                          aria-label="Food category"
                        />
                      </div>
                      <div className="table-cell price-cell">
                        <input
                          type="number"
                          name="price"
                          value={editFormData.price}
                          onChange={handleEditFormChange}
                          className="edit-input"
                          placeholder="Price"
                          aria-label="Food price"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="table-cell actions-cell">
                        <button 
                          className="save-btn"
                          onClick={() => handleUpdateFood(item._id)}
                          aria-label="Save changes"
                        >
                          <FiSave /> <span className="btn-text">Save</span>
                        </button>
                        <button 
                          className="cancel-btn"
                          onClick={handleCancelEdit}
                          aria-label="Cancel editing"
                        >
                          <FiX /> <span className="btn-text">Cancel</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="table-cell name-cell">
                        <p>{item.name}</p>
                      </div>
                      <div className="table-cell description-cell">
                        <p className="description-text">{item.description}</p>
                      </div>
                      <div className="table-cell category-cell">
                        <span className="category-tag">{item.category}</span>
                      </div>
                      <div className="table-cell price-cell">
                        <span className="price-value">Rs {item.price.toFixed(2)}</span>
                      </div>
                      <div className="table-cell actions-cell">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditClick(item)}
                          aria-label={`Edit ${item.name}`}
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => removeFood(item._id)}
                          aria-label={`Delete ${item.name}`}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;