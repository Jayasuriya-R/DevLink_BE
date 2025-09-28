const express = require('express')

const app = express();

app.listen(3000,()=>{
    console.log("server is satrted successfully")
});

app.use("/1",(req,res)=>{
    res.send("hello from server")
})

app.use("/guest",(req,res)=>{
    res.send("hello from guest")
})