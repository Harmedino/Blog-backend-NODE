const verifyToken = require("../middleware/jwttokencheck");
const { userSchemaValidate } = require("../middleware/yupvalidation");
const Blog = require("../model/blog");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const getUser = async (req, res) => {
  try {
    const response = await Blog.find();
    res.json(response);
  } catch (error) {
    console.error("Error fetching blog data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// storage

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: Storage,
}).single("image");

const sendPost = (req, res) => {
  // Use the verifyToken middleware before uploading
  verifyToken(req, res, () => {
    upload(req, res, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ message: "Error uploading image" });
      }

      const newImage = new Blog({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author,
        category: req.body.category,
        date: req.body.date,
        image: {
          data: req.file.filename,
        },
      });
      newImage
        .save()
        .then((response) => {
          res.json({ message: "Blog created successfully", response });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ message: "Unable to create Blog" });
        });
    });
  });
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, body, author } = req.body;

  try {
    // Verify token before updating the blog
    verifyToken(req, res, async () => {
      try {
        const result = await Blog.findByIdAndUpdate(
          id,
          { title, body, author },
          { new: true }
        );
        res.json({ message: "Blog updated successfully", result });
      } catch (err) {
        res.json({ message: "Error updating blog" });
      }
    });
  } catch (err) {
    res.json(err);
  }
};

const getSingleBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Blog.findById(id);
    res.json(result);
  } catch (err) {
    res.json(err);
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    verifyToken(req, res, async () => {
      const result = await Blog.findByIdAndDelete(id);
      res.json(result);
    });
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
      return res.status(409).json({ message: "Email already exists" });
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

const getAuth = async (req, res) => {
  console.log(req.user);
  try {
    const user = await User.findById(req.user).select("-password -_id");
    res.json({ message: user });
    console.log(req.user);
  } catch (error) {
    res.json({ message: error.mesage });
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
    res.cookie("token", token);

    res.json({ message: "Login successful", role: user.role, info: user });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  getUser,
  sendPost,
  updateBlog,
  getSingleBlog,
  deleteBlog,
  register,
  getAuth,
  login,
};
