import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  age: Number,
  email: String,
  profilePic: String,
});
const User = mongoose.model("User", userSchema);
export default User;
