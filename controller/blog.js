const verifyToken = require("../middleware/jwttokencheck");
const nodeMailer = require("nodemailer");
const Blog = require("../model/blog");
const fs = require("fs");
const { app } = require("../config/firebase.config");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const storage = getStorage(app);

const multer = require("multer");

const getBlog = async (req, res) => {
  try {
    const response = await Blog.find();
    res.json(response);
  } catch (error) {
    console.error("Error fetching blog data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserBlog = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const response = await Blog.find({ publisher: id });
    res.json(response);
  } catch (error) {
    console.error("Error fetching blog data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// storage
// const Storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Ensure that the "uploads" directory exists
//     const uploadDir = './uploads'; // Adjust the path as needed
//     fs.mkdir(uploadDir, { recursive: true }, (err) => {
//       if (err) {
//         return cb(err, null);
//       }
//       cb(null, uploadDir);
//     });
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
}).single("image");

const sendPost = async (req, res) => {
  verifyToken(req, res, () => {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error uploading image:", err);
        return res.status(400).json({ message: "Error uploading image" });
      }

      const { title, body, category, date, author, authorId } = req.body;
      const dateTime = new Date(); // Fixed the dateTime initialization
      const storageRef = ref(
        storage,
        `files/${req.file.originalname + dateTime.getTime()}`
      ); // Used getTime() to get milliseconds

      // Create file metadata including the content type
      const metadata = {
        contentType: req.file.mimetype,
      };

      try {
        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(
          storageRef,
          req.file.buffer,
          metadata
        );

        // Grab the public URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        // console.log('File successfully uploaded.', downloadURL);

        // Create the new blog with user's ID as the author and publisher
        const newBlog = new Blog({
          title,
          body,
          author,
          publisher: authorId,
          category,
          date,
          image: downloadURL,
        });

        const savedBlog = await newBlog.save();

        res.json({ message: "Blog created successfully", blog: savedBlog });
      } catch (error) {
        console.error("Error creating or uploading blog:", error.message);
        return res.status(500).json({ message: "Unable to create Blog" });
      }
    });
  });
};

const updateBlog = async (req, res) => {
  const { id } = req.params;

  try {
    // Verify token before updating the blog
    verifyToken(req, res, async () => {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: "Error uploading image" });
        }

        const newImage = {
          title: req.body.title,
          body: req.body.body,
          author: req.body.author,
          category: req.body.category,
          date: req.body.date,
          image: {
            data: req.file.filename,
          },
        };

        try {
          const result = await Blog.findByIdAndUpdate(id, newImage, {
            new: true,
          });

          if (!result) {
            return res.status(404).json({ message: "Blog not found" });
          }

          res.json({ message: "Blog updated successfully", result });
        } catch (err) {
          console.error("Error updating blog:", err);
          res.status(500).json({ message: "Error updating blog" });
        }
      });
    });
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(500).json({ message: "Error verifying token" });
  }
};

const getSingleBlog = async (req, res) => {
  const { id } = req.params;

  try {
    verifyToken(req, res, async () => {
      const result = await Blog.findById(id);
      if (!result) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.json(result);
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching blog" });
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

// const main(){
//   nodeMailer.createTransport({

//   })
// }

const addComment = async (req, res) => {
  const { id } = req.params;
  const { comment, author } = req.body;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const newComment = {
      comment,
      author,
    };

    blog.comments.push(newComment);

    const updatedBlog = await blog.save();

    res
      .status(200)
      .json({ message: "Comment added successfully", updatedBlog });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getBlog,
  sendPost,
  updateBlog,
  getUserBlog,
  getSingleBlog,
  addComment,
  deleteBlog,
};
