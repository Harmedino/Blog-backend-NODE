const mongoose = require("mongoose");

const { Schema } = mongoose;

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    publication: {
      type: Boolean,
      default: false,
    },
    publisher: {
        type: Schema.Types.ObjectId,
    ref: "User",
      
  },
    image: {
      data: String,
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
