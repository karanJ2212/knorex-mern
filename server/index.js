require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./connectDB");
const user = require("./models/Users");

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use("/uploads", express.static("uploads"));

//routes

//get all user
app.get("/", (request, response) => {
  response.json("hello mate!");
});

app.get("/all", async (req, res) => {
  try {
    // const category = req.query.category;
    // //const stars = req.query.stars;

    // const filter = {};
    // if (category) {
    //   filter.category = category;
    // }

    const data = await user.find({});

    if (!data) {
      throw new Error("An error occurred while fetching books.");
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching books." });
  }
});

//end

// Add user route
app.post("/AddUser", async (req, res) => {
  // Extract user data from the request body
  const userdata = req.body;

  // Create a new user document using the User model
  const newUser = new user(userdata);
  // console.log(newUser);
  // console.log(userdata);
  try {
    await newUser.save();
    res.status(201).json(newUser);
    console.log("success, user created in database ");
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

// Delete user route
app.delete("/deleteUser/:id", async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
