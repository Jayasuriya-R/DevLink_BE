const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const reviewRouter = require("./routes/review")
const userRouter = require("./routes/user")

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",reviewRouter);
app.use("/",userRouter)




app.get("/feed", async (req, res) => {
  try {
    const data = await User.find({});
    res.send(data);
  } catch (err) {
    res.status(400).send("something went wrong", err.message);
  }
});



app.patch("/user/:userId", async (req, res) => {
  const data = req.body;
  const notAllowedUpdates = ["emailId", "age"];
  try {
    const isNotAllowed = Object.keys(data).some((k) =>
      notAllowedUpdates.includes(k)
    );
    if (isNotAllowed)
      throw new Error(`update not allowed for ${notAllowedUpdates.join(",")}`);

    await User.findByIdAndUpdate(req.params?.userId, data, {
      new: true,
      runValidators: true,
    });
    res.send("Updated sucessfully");
  } catch (err) {
    res.status(400).send("update failed" + err.message);
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
