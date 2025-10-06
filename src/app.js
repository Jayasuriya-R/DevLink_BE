const express = require("express");
const {adminAuth} = require("./middleware/auth")

const app = express();

app.listen(3000, () => {
  console.log("server is satrted successfully");
});

app.use('/admin',adminAuth)

app.get('/admin/:adminId',(req,res)=>{
  console.log("admin id", req.params)
  res.send("Hello admin")
})

app.use("/guest", (req, res) => {
  res.send("hello from guest");
});

app.post("/user", (req, res) => {
  res.send("post response");
});

app.get(
  "/user/:userId",
  [(req, res, next) => {
    console.log("query", req.params);

    next();
    
  },
  (req,res,next ) => {
    next()
   
  },
  (req,res)=>{
    if('xyz' === 'xyz'){
  res.send("hello from server");

  }else{
    res.status(401).send("unauthorized")
  }
  }]
);
// app.use("/", (req, res) => {
//   if('xyx' === 'xyz'){
//   res.send("hello from server");

//   }else{
//     res.status(401).send("unauthorized")
//   }
// });
