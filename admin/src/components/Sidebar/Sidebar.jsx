import React from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';
import { FiPlus, FiList, FiTruck, FiSettings, FiLogOut, FiUser  } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-header">
        <img src={assets.logo} alt="Restaurant Logo" className="sidebar-logo" />
        <h3 className="sidebar-title">Admin Panel</h3>
      </div>
      
      <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option" activeClassName="active">
          <FiPlus className="option-icon" />
          <span className="option-text">Add Items</span>
        </NavLink>
        <NavLink to='/list' className="sidebar-option" activeClassName="active">
          <FiList className="option-icon" />
          <span className="option-text">List Items</span>
        </NavLink>
        <NavLink to='/order' className="sidebar-option" activeClassName="active">
          <FiTruck className="option-icon" />
          <span className="option-text">Orders</span>
        </NavLink>
        <NavLink to='/users' className="sidebar-option" activeClassName="active">
          <FiUser  className="option-icon" />
          <span className="option-text">Users</span>
        </NavLink>
      </div>

      <div className="sidebar-footer">

        <div className="sidebar-option logout-option">
          <FiLogOut className="option-icon" />
          <span className="option-text">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;