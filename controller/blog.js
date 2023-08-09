const { userSchemaValidate } = require("../middleware/yupvalidation");
const Blog = require("../model/blog");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const getUser = async (req, res) => {
  try {
    const response = await blog.find();
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
  const { title, body, author, category, date } = req.body;
  console.log(req.body);

  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "Error uploading image" });
    }

    const newImage = new Blog({
      title,
      body,
      author,
      category,
      date,
      image: {
        data: req.file.filename,
        contentType: "image/png",
      },
    });

    newImage
      .save()
      .then((response) => {
        res.json({ message: "Blog created successfully", response });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
      });
  });
};

module.exports = { sendPost };

const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, body, author } = req.body;

  try {
    const result = await Blog.findByIdAndUpdate(
      id,
      { title, body, author },
      { new: true }
    );
    res.json({ message: "Blog updated successfully", result });
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
    const result = await Blog.findByIdAndDelete(id);
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
      return res.status(409).json({ mesage: "Email already exists" });
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

    res.json({ message: "Login successful", token });
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
