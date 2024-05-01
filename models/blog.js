const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const THUMB_PATH = path.join("/uploads/blogs/thumbnails");
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", THUMB_PATH));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

blogSchema.statics.uploadThumbnail = multer({ storage: storage }).single(
  "thumbnail"
);
blogSchema.statics.thumbPath = THUMB_PATH;
const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
