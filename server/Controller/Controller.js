const user = require("../models/Users");

const getAllUser = async (req, res) => {
  try {
    const data = await user.find({});

    if (!data) {
      throw new Error("An error occurred while fetching books.");
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching books." });
  }
};

const AddUser = async (req, res) => {
  const userdata = req.body;

  const newUser = new user(userdata);

  try {
    await newUser.save();
    res.status(201).json(newUser);
    console.log("success, user created in database ");
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const DeleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    // Find the user by ID and remove them from the database
    await user.findByIdAndRemove(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user." });
  }
};

module.exports = {
  getAllUser,
  AddUser,
  DeleteUser,
};
