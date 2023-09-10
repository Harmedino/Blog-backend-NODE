const User = require("../model/user");
const bcrypt = require("bcrypt");
const { response } = require("express");
const { userSchemaValidate } = require("../middleware/yupvalidation");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/jwttokencheck");

const register = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(409).json({ message: "userName already exists" });
    }

    await userSchemaValidate.validate(req.body);
    console.log("validated");

    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const response = await User.create({
        firstname,
        lastname,
        username,
        email,
        password: hashedPassword,
      });

      // Send the token along with the registration response
      res.json({ message: "Registration Successful" });

      console.log("created");
    } catch (err) {
      res.json(err.message);
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(404).json({ mesage: error.message });
    } else {
      res.json({ message: "an error occurred" });
    }
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, username, phone, email } = req.body;

  try {
    verifyToken(req, res, async () => {
      // Check if the provided email is already in use by another user
      const existingUserWithEmail = await User.findOne({
        email,
        _id: { $ne: id }, // Exclude the current user from the check
      });

      if (existingUserWithEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Update the user's profile
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { firstname, lastname, username, phone, email },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Profile updated successfully" });
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    });

    const cookieOptions = {
      // Add your desired options here
      httpOnly: true, // Example: Make the cookie httpOnly
      secure: true,   // Example: Set the cookie as secure (requires HTTPS)
      sameSite: 'strict', // Example: Set the sameSite attribute
    };

    res.cookie("token", token, cookieOptions);

    console.log(token);
    res.json({ message: "Login successful", role: user.role, info: user });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};


const getAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password ");
    res.json({ message: user });
  } catch (error) {
    res.json({ message: error.mesage });
  }
};

module.exports = {
  register,
  login,
  getAuth,
  updateUser,
};
