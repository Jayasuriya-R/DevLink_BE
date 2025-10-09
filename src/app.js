const express = require("express");

const { connectDB } = require("./config/database");

const { User } = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);

  const user = new User(req.body);
  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("error occured", err.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const data = await User.find({ emailId: req.body.emailId });
    res.send(data);
  } catch (err) {
    res.status(400).send("something went wrong", err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const data = await User.find({});
    res.send(data);
  } catch (err) {
    res.status(400).send("something went wrong", err.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.id);
    res.send("deleted successfully");
  } catch (err) {
    res.status(400).send("something went wrong", err.message);
  }
});

app.patch("/user", async (req, res) => {
  try {
    const data = await User.findByIdAndUpdate(req.body._id, {
      firstName: req.body.firstName
    },{ new: true } );
    res.send(data);
  } catch (err) {
    res.status(400).send("something went wrong", err.message);
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
