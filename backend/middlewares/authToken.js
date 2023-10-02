const jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
    const authToken = req.cookies.authToken;
    // console.log("Auth token: " + authToken);
    // console.log("Check Auth TOken called",authToken);

    if(!authToken){
        return res.status(403).json({
            success: false,
            message:"Please login to access"
        })
    }

    jwt.verify(authToken,process.env.JWT_SECRET_KEY,(err,decoder)=>{
        if(err){
            return res.status(401).json({
                success: false,
                message:"Verification failed"
            })
        }
        else{
            req.userId = decoder.userId;
            next();
        }
    })

}

module.exports = checkAuth;