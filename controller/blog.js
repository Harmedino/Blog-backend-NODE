const { userSchemaValidate } = require("../middleware/yupvalidation");
const blog = require("../model/blog");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUser = async (req, res) => {
  try {
    const response = await blog.find();
    res.json(response);
  } catch (error) {
    console.error("Error fetching blog data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendPost = async (req, res) => {
  console.log(req.body);
  try {
    const { title, body, author } = req.body;
    const response = await blog.create({ title, body, author });
    res.json({ message: "addedd", response });
    console.log("created");
  } catch (err) {
    res.json(err.message);
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, body, author } = req.body;

  try {
    const result = await blog.findByIdAndUpdate(
      id,
      { title, body, author },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    res.json(err);
  }
};

const getSingleBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await blog.findById(id);
    res.json(result);
  } catch (err) {
    res.json(err);
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await blog.findByIdAndDelete(id);
    res.json(result);
  } catch (err) {
    res.json(err);
  }
};

const register = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Email is not already registered, continue with the registration process
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
      // Generate a JWT token
      const token = jwt.sign(
        { userId: response._id, email: response.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
      );

      // Send the token along with the registration response
      res.json({ message: "Registration Successful", token });

      console.log("created");
    } catch (err) {
      res.json(err.message);
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(404).json({ error: error.message });
    } else {
      res.send("an error occurred");
    }
  }
};

module.exports = {
  getUser,
  sendPost,
  updateBlog,
  getSingleBlog,
  deleteBlog,
  register,
};
