require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./connectDB");
const user = require("./models/Users");
const { getAllUser, AddUser, DeleteUser } = require("./Controller/Controller");
const routes = require("./Routes/Routes");

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (request, response) => {
  response.json("hello mate!");
});

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});

// app.get("/all", async (req, res) => {
//   try {
//     const data = await user.find({});

//     if (!data) {
//       throw new Error("An error occurred while fetching books.");
//     }

//     res.status(201).json(data);
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred while fetching books." });
//   }
// });

// app.get("/all", getAllUser);

//end

// Add user route
// app.post("/AddUser", async (req, res) => {
//   const userdata = req.body;

//   const newUser = new user(userdata);

//   try {
//     await newUser.save();
//     res.status(201).json(newUser);
//     console.log("success, user created in database ");
//   } catch (error) {
//     res.status(409).json({ message: error.message });
//   }
// });

// app.post("/AddUser", AddUser);

// Delete user route
// app.delete("/deleteUser/:id", async (req, res) => {
//   const userId = req.params.id;
//   try {
//     // Find the user by ID and remove them from the database
//     await user.findByIdAndRemove(userId);

//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "An error occurred while deleting the user." });
//   }
// });

// app.delete("/deleteUser/:id", DeleteUser);
