const adminAuth = (req,res,next)=>{
  if(true){
    next()
  }else{
    res.status(401).send("unauthorized")
  }
}

module.exports= {adminAuth}