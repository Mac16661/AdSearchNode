const jwt = require("jsonwebtoken");
require("dotenv").config();


const JWT_SECRET_APP = process.env.JWT_SECRET_APP;
const JWT_SECRET_ORG = process.env.JWT_SECRET_ORG;

async function appAuthMiddleware(req, res, next) {
    // if the value is null/undefined then return empty string
    const authHeader = req.headers["authorization"] ?? "";
    try{
        const decoded = await jwt.verify(authHeader, JWT_SECRET_APP);
        console.log(decoded);

        if(decoded.userId) {
            
            req.userID = decoded.userId;
            return next();
        }else{
            return res.status(403). json({
                message: "unauthorized"
            })
        }
    }catch(e) {
        console.log(e)
        return res.status(403).json({
            message: "unauthorized"
        })
    }
}

async function orgAuthMiddleware(req, res, next) {
    // if the value is null/undefined then return empty string
    const authHeader = req.headers["authorization"] ?? "";
    
    try{
        const decoded = await jwt.verify(authHeader, JWT_SECRET_ORG);
        console.log(decoded);

        if(decoded.userId) {
            
            req.userID = decoded.userId;
            return next();
        }else{
            return res.status(403). json({
                message: "unauthorized"
            })
        }
    }catch(e) {
        console.log(e)
        return res.status(403).json({
            message: "unauthorized"
        })
    }
}

module.exports = {
    appAuthMiddleware,
    orgAuthMiddleware
}
