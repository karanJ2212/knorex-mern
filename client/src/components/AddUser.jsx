import { useState } from "react";
import Modal from "react-modal";
import "./AddUser.css";

// eslint-disable-next-line react/prop-types
const AddUser = ({ isOpen, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/AddUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          email: "",
          firstName: "",
          lastName: "",
          password: "",
        });

        // Notify the parent component that a user has been added and close the modal
        onUserAdded();
        onClose();
        window.location.reload();
      } else {
        const errorData = await response.json(); // Parse error response from the server
        setError(errorData.message); // Set the error message in state
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add User"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}{" "}
          {/* Display error message */}
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AddUser;
