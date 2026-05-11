const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. The Bouncer asks for the token from the request headers
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Access Denied. No Security Key Provided!" });
    }

    try {
        // 2. Extract the actual token (It comes looking like "Bearer eYJhbGciOi...")
        const token = authHeader.split(' ')[1];

        // 3. The Bouncer verifies the token using your Master Secret
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. If valid, the Bouncer unlocks the user's ID and lets them pass
        req.user = verified; 
        next(); // Pass the request to the next function
        
    } catch (error) {
        res.status(403).json({ success: false, message: "Invalid or Expired Security Key!" });
    }
};

module.exports = verifyToken;