const { userSchemaValidate } = require("../middleware/yupvalidation");
const blog = require("../model/blog");

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
  const { fullName, userName, email, password } = req.body;

  try {
    await userSchemaValidate.validate({ fullName, userName, email, password });
    console.log("validated");
    try {
      const response = await user.create({
        fullName,
        userName,
        email,
        password,
      });
      res.json({ message: "addedd", response });
      console.log("created");
    } catch (err) {
      res.json(err.message);
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(404).json({ error: error.message });
    } else {
      res.send("an error occured");
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
