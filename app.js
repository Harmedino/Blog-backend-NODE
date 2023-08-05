const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const blog = require("./model/blog");
const userRoute = require("./router/blog");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`App running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

connectDB();

app.use("/", userRoute);

app.post("/", userRoute);

app.get("/getBlog/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await blog.findById(id);
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

app.delete("/deleteBlog/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await blog.findByIdAndDelete(id);
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

app.patch("/", userRoute);
