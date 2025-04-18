
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; 
  

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: "Not Authorized, Login required" });
  }


  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.body.userId = decoded.id; 
    next(); 
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;
