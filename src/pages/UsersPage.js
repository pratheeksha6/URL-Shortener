import { useState, useEffect } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setFetchLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      if (error.message === "Failed to fetch") {
        setError("Cannot connect to server.Please try again later");
      } else {
        setError("Failed to fetch users");
      }
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (
      !formData.firstName.trim() &&
      !formData.lastName.trim() &&
      !formData.email.trim() &&
      !formData.phoneNumber.trim()
    ) {
      return "All fields are required";
    }
    if (!formData.firstName.trim()) {
      return "First name is required";
    }
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(formData.firstName)) {
      return "First name can only contain letters";
    }

    if (!formData.lastName.trim()) {
      return "Last name is required";
    }
    if (!nameRegex.test(formData.lastName)) {
      return "Last name can only contain letters";
    }
    if (!formData.email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email";
    }
    if (!formData.phoneNumber.trim()) {
      return "Phone number is required";
    }
    const phoneRegex = /^[+\d\s\-()]+$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      return "Phone number can only contain numbers, +, -, spaces";
    }
    if (formData.phoneNumber.length > 20) {
      return "Phone number is too long";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      setFormData({ firstName: "", lastName: "", email: "", phoneNumber: "" });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      setError(
        error.message ||
          (editingUser ? "Failed to update user" : "Failed to create user"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );
    if (!confirmed) return;
    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (error) {
      setError("Failed to delete user");
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setFormData({ firstName: "", lastName: "", email: "", phoneNumber: "" });
    setError("");
  };

  return (
    <div className="card">
      <h1 className="title">{editingUser ? "Edit User" : "Users"}</h1>

      <div className="user-form">
        <div className="form-row">
          <input
            className="url-input"
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            className="url-input"
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <input
            className="url-input"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            className="url-input"
            type="text"
            name="phoneNumber"
            placeholder="Phone number"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        {error && <p className="error-msg">{error}</p>}

        <div className="form-actions">
          <button
            className="shorten-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {editingUser ? "Update User" : "Create User"}
          </button>
          {editingUser && (
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {fetchLoading ? (
        <div
          style={{ textAlign: "center", marginTop: "40px", color: "#a78bfa" }}
        >
          <p style={{ fontSize: "14px" }}>⏳ Loading users...</p>
        </div>
      ) : users.length > 0 ? (
        <div className="users-list">
          <h2
            className="history-title"
            style={{ marginBottom: "16px", marginTop: "32px" }}
          >
            All Users
          </h2>
          {users.map((user) => (
            <div className="user-item" key={user.id}>
              <div className="user-avatar">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div className="user-info">
                <p className="user-name">
                  {user.firstName} {user.lastName}
                </p>
                <p className="user-details">
                  {user.email} · {user.phoneNumber}
                </p>
              </div>
              <div className="user-actions">
                <button className="edit-btn" onClick={() => handleEdit(user)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{ textAlign: "center", marginTop: "40px", color: "#a78bfa" }}
        >
          <p style={{ fontSize: "16px" }}>No users yet</p>
          <p style={{ fontSize: "13px", marginTop: "8px" }}>
            Create your first user above!
          </p>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
