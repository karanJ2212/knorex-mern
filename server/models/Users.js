const mongoose = require("mongoose");
const validator = require("validator"); // For email validation
const bcrypt = require("bcrypt"); // For password hashing

// Define the User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: "Invalid email address",
    },
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum password length
    validate: {
      validator: (value) => {
        // Add your custom password strength validation logic here
        // For example, you can check for a mix of uppercase, lowercase, digits, and special characters
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
          value
        );
      },
      message:
        "Password must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    },
  },
});

// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10); // Hash the password with a salt factor of 10
  }
  next();
});

// Create the User model
module.exports = mongoose.model("user", userSchema);
