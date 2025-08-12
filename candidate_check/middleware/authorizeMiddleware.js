const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()


const authorizeMiddleware = (requiredRole) => {
    return (req, res, next) => {


        const authHeader = req.header("Authorization")
        const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

        try {
            if (!token) {
                return res.status(401).json({ message: "Unauthorized, No Token Provided" })
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if (!decoded) {
                return res.status(403).json({ message: "Access Denied, Invalid token" })
            }
            if (decoded.role !== requiredRole) {
                return res.status(403).json({ message: "Access Denied, Invalid Role" })
            }
            req.token = decoded;
            next();
        } catch (error) {
            return res.status(500).json({ message: "Internal Server error" });
        }


    }
}



module.exports = { authorizeMiddleware }