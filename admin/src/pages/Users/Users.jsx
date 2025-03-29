import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiUser, FiMail, FiActivity, FiX, FiSave } from "react-icons/fi";
import "./Users.css";
import { toast } from 'react-toastify';

const UsersList = ({ url }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: ""
  });
  const usersPerPage = 8;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url}/api/user/users`);
      setUsers(response.data.users);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Error fetching users:", err);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${url}/api/user/users/${userId}`);
        setUsers(users.filter((user) => user._id !== userId));
        toast.success("User deleted successfully!");
        setError("");
      } catch (err) {
        toast.error("Failed to delete user");
        setError("Failed to delete user");
        console.error("Error deleting user:", err);
      }
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role || ""
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${url}/api/user/users/${editingUser}`,
        editFormData
      );
      
      setUsers(users.map(user => 
        user._id === editingUser ? response.data.user : user
      ));
      
      toast.success("User updated successfully!");
      setEditingUser(null);
    } catch (err) {
      toast.error("Failed to update user");
      console.error("Error updating user:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
        <button onClick={fetchUsers} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>User Management</h1>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="users-table-container">
        {currentUsers.length > 0 ? (
          <div className="users-grid">
            {currentUsers.map((user) => (
              <div key={user._id} className="user-card">
                {editingUser === user._id ? (
                  <form onSubmit={handleUpdateUser} className="edit-user-form">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                     
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="save-button">
                        <FiSave /> Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="cancel-button"
                      >
                        <FiX /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="user-card-header">
                      <div className="user-avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} />
                        ) : (
                          <FiUser className="avatar-icon" />
                        )}
                      </div>
                      <h3 className="user-name">{user.name}</h3>
                      <div className="user-actions">
                        <button
                          className="edit-button"
                          onClick={() => handleEditClick(user)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(user._id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <div className="user-details">
                      <div className="detail-item">
                        <FiMail className="detail-icon" />
                        <span>{user.email}</span>
                      </div>
                     
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-users">
            <p>No users found</p>
          </div>
        )}
      </div>

      {filteredUsers.length > usersPerPage && (
        <div className="pagination-container">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersList;