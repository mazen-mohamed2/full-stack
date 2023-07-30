const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const cookie = require("cookie");

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, "your-secret-key", {
    expiresIn: "1h", // Change this to set the expiration time of the token
  });
};

exports.signup = async (req, res) => {
  try {
    const { username, password, phoneNumber } = req.body;
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, phoneNumber });
    const token = generateToken(user);
    // Set the token as a cookie in the response
    res.setHeader("Set-Cookie", cookie.serialize("token", token, { httpOnly: true, maxAge: 3600, sameSite: 'strict', secure: true }));
    res.status(201).json({ status: "success", token });
  } catch (error) {
    res.status(400).json({ status: "failed", error: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    const token = generateToken(user);
    // Set the token as a cookie in the response
    res.setHeader("Set-Cookie", cookie.serialize("token", token, { httpOnly: true, maxAge: 3600, sameSite: 'strict', secure: true }));
    res.status(200).json({ status: "success", token, username: user.username, phoneNumber: user.phoneNumber });
  } catch (error) {
    res.status(401).json({ status: "failed", error: error.message });
  }
};
