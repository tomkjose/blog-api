const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const User = require("../../../models/user");
require("dotenv").config();

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "New user created Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    console.log("userId", user._id);
    const token = jwt.sign(
      { email: user.email, username: user.username, userId: user._id },
      process.env.JWT_SECRET
    );
    res.json({
      token,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    User.uploadAvatar(req, res, async (error) => {
      if (error) {
        return res.status(500).json({ error: "Error in updating" });
      }
      user.email = req.body.email;
      user.username = req.body.username;
      if (req.file) {
        if (user.avatar) {
          fs.unlinkSync(path.join(__dirname, "..", user.avatar));
        }
        user.avatar = User.avatarPath + "/" + req.file.filename;
      }
      try {
        await user.save();
        res.status(200).json({ message: "Profile updated successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error in updating profile" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
