const express = require("express");

const { connectDB } = require("./config/database");

const { User } = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Surya",
    lastName: "R",
    emailId: "surya@gmail.com",
    password: "surya123",
  };
  const user = new User(userObj);
  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("error occured", err.message);
  }
});

connectDB()
  .then(() => {
    console.log("db connection successful");
    app.listen(3000, () => {
      console.log("server is satrted successfully");
    });
  })
  .catch(() => console.log("connection failed"));
