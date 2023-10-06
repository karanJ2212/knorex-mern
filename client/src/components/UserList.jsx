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

  //export states
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showExportMessage, setShowExportMessage] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  //delete states
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [deleteUserConfirmation, setDeleteUserConfirmation] = useState(false);
  const [userToDelete, setUserToDetete] = useState(null);

  const handleUserSelection = (userId) => {
    const isSelected = selectedUsers.includes(userId);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleDeleteUser = async (userId) => {
    setUserToDetete(userId);
    setDeleteUserConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/deleteUser/${userToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user.");
      }

      setUsers(users.filter((user) => user._id !== userToDelete));

      setDeleteUserConfirmation(false);

      setShowSuccessMessage(true);
    } catch (error) {
      console.error(error);
    }
  };

  const exportToCSV = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to export.");
      return;
    }

    try {
      setIsExporting(true);

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

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsExporting(false);
      setShowExportMessage(true);
    } catch (error) {
      console.error(error);
      setIsExporting(false);
    }
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

  const [searchInput, setSearchInput] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const handleSearchInputChange = (e) => {
    console.log(e.target.value);
    setSearchInput(e.target.value);
  };
  const searchDatabase = async () => {
    try {
      // If the search input is empty, reset the search results
      if (searchInput.trim() === "") {
        setSearchResults([]);
        return;
      }

      const response = await fetch("http://localhost:8000/getSelectedUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchUser: searchInput }),
      });

      if (response.ok) {
        const jsonData = await response.json();
        setSearchResults(jsonData);
      } else {
        console.error("Error in searching");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error in searching", error);
      setSearchResults([]);
    }
  };

  // Render the user list based on search results if there are any, otherwise render all users
  const userListToRender = searchInput.trim() === "" ? users : searchResults;

  return (
    <div>
      <div className="header">
        {isExporting && <div className="loading-indicator">Exporting...</div>}
        <button onClick={() => setIsAddUserModalOpen(true)}>Sign Up</button>
        <button
          onClick={exportToCSV}
          disabled={selectedUsers.length === 0 || isExporting}
        >
          EXPORT
        </button>

        <Modal
          isOpen={showExportMessage}
          onRequestClose={() => setShowExportMessage(false)}
          contentLabel="User Exported Successfully"
          className="modal"
          overlayClassName="overlay"
        >
          <h2>Data Exported Successfully</h2>
          <button onClick={() => setShowExportMessage(false)}>OK</button>
        </Modal>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users..."
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <button onClick={searchDatabase}>Search</button>
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
          {userListToRender.map((user) => (
            <tr key={`${user.id}-${Math.random()}`}>
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
        isOpen={deleteUserConfirmation}
        onRequestClose={() => setDeleteUserConfirmation(false)}
        contentLabel="Delete Confirmation"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Are you sure you want to delete user?</h2>
        <button onClick={confirmDelete}>yes</button>
        <button onClick={() => setDeleteUserConfirmation(false)}>no</button>
      </Modal>

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
