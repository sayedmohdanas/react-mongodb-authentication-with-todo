import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./modles/usermodel.js";
import jwt from "jsonwebtoken";
import { compareHasPassword, hashPassword } from "./Utils.js";
import upload from "./multer.js";
dotenv.config();

const dbUrl = process.env.DATABASEURL.replace(
  "<password>",
  process.env.DATABASEPASSWORD
);
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.error("Database connection error:", error));

const app = express();
app.use(express.json());

app.use(cors("*"));
app.use("/uploads", express.static("uploads"));

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.headers;
    const decode = jwt.verify(token, process.env.JWTTOKEN);
    const userData = await User.findOne({ _id: decode._id }).select(
      "-password"
    );
    if (!userData) {
      return res.status(404).send({ msg: "User not found" });
    }
    req.user = userData;
    next();
  } catch (error) {
    return res.status(403).send({ msg: "invalid token" });
  }
};

app.post("/register", async (req, res) => {
  console.log("ggggg")
  const { name, password, age, email } = req.body;
  if (!name || !password || !age || !email) {
    return res.send({ msg: "please fil all required field  " });
  }
  const passwordHash = await hashPassword(password);
  const checkIfUserExists = await User.findOne({ username: name });
  if (checkIfUserExists) {
    console.log(checkIfUserExists);
    return res.status(403).send({ msg: "User  exist" });
  }

  const user = await User.create({
    username: name,
    password: passwordHash,
    age: age,
    email: email,
  });
  res.send({ msg: "User crated", data: user });
});

app.get("/getUsers",  async (req, res) => {
  console.log("qqqqqqqqq")
  const allUser = await User.find({});
  console.log("hhh");

  res.status(200).send({ users: allUser });
});

app.patch(
  "/updatePassword",

  authMiddleware,

  async (req, res) => {
    const { id, oldPassword, newPassword } = req.body;
    const checkOldPasswordIsValid = await User.findOne({
      _id: id,
    });
    if (!checkOldPasswordIsValid) {
      return res.status(404).send({ msg: "User not found" });
    }
    const checkPassword = await compareHasPassword(
      oldPassword,
      checkOldPasswordIsValid.password
    );
    if (!checkPassword) {
      return res.status(403).send({ mas: "invalid password" });
    }
    const checkPasswordIsAsOldPassword = await compareHasPassword(
      newPassword,
      checkOldPasswordIsValid.password
    );
    if (checkPasswordIsAsOldPassword) {
      return res
        .status(403)
        .send({ msg: "your old password is same as your new password" });
    }
    const newHashPassword = await hashPassword(newPassword);
    await User.updateOne({ _id: id }, { password: newHashPassword });
    res.status(200).send({ msg: "Password updated " });
  }
);

app.delete("/deleteUser/:userId", authMiddleware, async (req, res) => {
  const userExists = await User.findOne({ _id: req.params.userId });
  if (!userExists) {
    res.status(404).send({ msg: "user not exists" });
  }
  await User.deleteOne({ _id: req.params.userId });
  res.status(200).send({ msg: "Deleted Successfully" });
});

// Edit User data Api///////

app.patch(
  "/updateUser",
  

  authMiddleware,
  upload.single("profile-file"),
  async (req, res) => {
    console.log("path", req.file.path);

    console.log({ id, username, email, age });
    try {
      const { id, username, email, age } = req.body;
      if (!id || !username || !age || !email) {
        return res.status(403).send({ msg: "invalid data" });
      }
      const checkIfUserExists = await User.findOne({ _id: id });
      if (!checkIfUserExists) {
        return res.status(404).send({ msg: "user not found" });
      }
      const ifUserhveNotChangeUserName = await User.findOne({
        _id: id,
        username: username,
      });
      if (!ifUserhveNotChangeUserName) {
        const checkUserName = await User.findOne({ username: username });
        if (checkUserName) {
         return res.status(403).send({ msg: "user already exists" });
        }
      }

      await User.updateOne({ _id: id }, { username, email, age });
      res.status(200).send({ msg: "data update successfully" });
    } catch (error) {
      return res.status(500).send({ msg: "internal server error" });
    }
  }
);

// Get individual user data///////

app.get("/getUserData/:id",  async (req, res) => {
  try {
    const { id } = req.params;
    const findUser = await User.findOne({ _id: id }).select("-password");

    if (!findUser) {
      res.status(403).send({ msg: "user not found " });
    }
    res.status(200).send({ user: findUser });
  } catch (error) {
    return res.status(500).send({ msg: "internal server error" });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const checkUser = await User.findOne({ username: username });
    if (!checkUser) {
       return res.status(404).send({ msg: "user not found" });
    }
    const checkPassword = await compareHasPassword(
      password,
      checkUser.password
    );

    if (!checkPassword) {
      return res.status(403).send({ msg: "invalid passsword" });
    }
    const token = jwt.sign({ _id: checkUser._id }, process.env.JWTTOKEN);
    return res.status(200).send({ token });
  } catch (error) {
    return res.status(500).send({ msg: "internal server error" });
  }
});

app.get("/loginUserData", async (req, res) => {
  try {
    const { token } = req.headers;
    const decode = jwt.verify(token, process.env.JWTTOKEN);
    const userData = await User.findOne({ _id: decode._id }).select(
      "-password"
    );
    if (!userData) {
      return res.status(404).send({ msg: "User not found" });
    }
    res.status(200).send({ user: userData });
  } catch (error) {
    return res.status(403).send({ msg: "invalid token" });
  }
});

app.listen(5000, () => {
  console.log("server is working");
  console.log("anas");
});
