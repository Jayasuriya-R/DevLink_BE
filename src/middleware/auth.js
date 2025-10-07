const adminAuth = (req,res,next)=>{
    const isAuthenticated = 'xyz'== 'xyz'
  if(isAuthenticated){
    next()
  }else{
    res.status(401).send("unauthorized")
  }
}

const guestAuth = (req,res,next)=>{
    const isAuthenticated = 'xyz'== 'xyz'
  if(isAuthenticated){
    next()
  }else{
    res.status(401).send("unauthorized")
  }
}

module.exports= {adminAuth, guestAuth}