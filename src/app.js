const express = require("express");
const { adminAuth , guestAuth} = require("./middleware/auth");

const app = express();

app.listen(3000, () => {
  console.log("server is satrted successfully");
});

app.use("/admin", adminAuth);

app.get("/admin/:adminId", (req, res) => {
  console.log("admin id", req.params);
  res.send("Hello admin");
});

app.use("/guest", guestAuth,(req, res) => {
  throw new Error("error occured")
  res.send("hello from guest");
});

app.post("/user", (req, res) => {
  res.send("post response");
});

app.use('/',(err,req,res,next)=>{
  if(err){
    res.status(500).send("something went wrong")
  }
})


