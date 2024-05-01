const Blog = require("../../../models/blog");

module.exports.create = async (req, res) => {
  try {
    Blog.uploadThumbnail(req, res, async function (error) {
      // console.log("req.body", req.body);
      // console.log("req.file", req.file);
      if (error) {
        return res.status(400).json({ error: "Hi :" + error.message });
      } else if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }

      const { title, body, author } = req.body;
      if (!title || !body || !author) {
        return res.status(400).json({ error: "All fields are required" });
      }

      let thumbnail;
      if (req.file) {
        thumbnail = req.file.path;
      }
      const newBlog = new Blog({
        title,
        thumbnail,
        body,
        author,
      });

      await newBlog.save();

      res.status(201).json({ message: "Blog post created successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.update = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, body } = req.body;
    const userId = req.user.userId;
    console.log("req.body", req.body);
    console.log("userId", userId);
    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const postToUpdate = await Blog.findById(postId);

    if (!postToUpdate) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (postToUpdate.author.toString() !== userId) {
      return res.status(403).json({
        error: "Unauthorized: You are not allowed to update this post",
      });
    }

    if (title) {
      postToUpdate.title = title;
    }
    if (body) {
      postToUpdate.body = body;
    }

    await postToUpdate.save();
    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.allPost = async (req, res) => {
  try {
    const allPosts = await Blog.find().populate({
      path: "author",
      select: "username email avatar",
    });

    res.status(200).json(allPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }
    const postToDelete = await Blog.findById(postId);

    if (!postToDelete) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (postToDelete.author.toString() !== userId) {
      return res.status(403).json({
        error: "Unauthorized: You are not allowed to delete this post",
      });
    }

    await postToDelete.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
