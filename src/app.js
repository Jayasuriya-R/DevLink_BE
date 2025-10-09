const express = require("express");

const { connectDB } = require("./config/database");

const { User } = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {

  console.log(req.body)
  
  const user = new User(req.body);
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
