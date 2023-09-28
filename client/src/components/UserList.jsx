import { useEffect, useState } from "react";

import Modal from "react-modal";
import AddUser from "./AddUser";
import "./UserList.css";

import { saveAs } from "file-saver";

const UserList = () => {
  const baseUrl = "http://localhost:8000/all";
  const [users, setUsers] = useState([
    { id: 1, firstName: "John", lastName: "Doe", email: "john@example.com" },
    { id: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
  ]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleUserSelection = (userId) => {
    const isSelected = selectedUsers.includes(userId);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/deleteUser/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user.");
      }

      setUsers(users.filter((user) => user._id !== userId));

      setShowSuccessMessage(true);
    } catch (error) {
      console.error(error);
    }
  };

  const [isExporting, setIsExporting] = useState(false);
  const exportToCSV = () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to export.");
      return;
    }

    const csvData = [
      "_id,email,first_name,last_name",
      ...users
        .filter((user) => selectedUsers.includes(user._id))
        .map(
          (user) =>
            `${user._id},${user.email},${user.firstName},${user.lastName}`
        ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });

    console.log("CSV Data:", csvData);
    saveAs(blob, "user_data.csv");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = baseUrl;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }

        const jsonData = await response.json();
        setUsers(jsonData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="header">
        <button onClick={() => setIsAddUserModalOpen(true)}>Sign Up</button>
        <button
          onClick={exportToCSV}
          disabled={selectedUsers.length === 0 || isExporting}
        >
          EXPORT
        </button>
        {isExporting && <div className="loading-indicator">Exporting...</div>}
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <input
                  type="checkbox"
                  onChange={() => handleUserSelection(user._id)}
                  checked={selectedUsers.includes(user._id)}
                />
              </td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td className="actions">
                <button onClick={() => handleDeleteUser(user._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={showSuccessMessage}
        onRequestClose={() => setShowSuccessMessage(false)}
        contentLabel="User Deleted Successfully"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>User Deleted Successfully</h2>
        <button onClick={() => setShowSuccessMessage(false)}>OK</button>
      </Modal>

      <Modal
        isOpen={isAddUserModalOpen}
        onRequestClose={() => setIsAddUserModalOpen(false)}
        contentLabel="Add User"
        className="modal"
        overlayClassName="overlay"
      >
        <AddUser
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          onUserAdded={() => {
            setIsAddUserModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default UserList;
