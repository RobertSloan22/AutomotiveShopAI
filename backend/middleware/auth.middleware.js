import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Optional: Add role-based middleware
export const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ error: "Forbidden - Insufficient permissions" });
        }
        next();
    };
};

// Optional: Add multiple roles middleware
export const requireAnyRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden - Insufficient permissions" });
        }
        next();
    };
};

// Optional: Add ownership verification middleware
export const verifyOwnership = (model) => {
    return async (req, res, next) => {
        try {
            const document = await model.findById(req.params.id);
            if (!document) {
                return res.status(404).json({ error: "Resource not found" });
            }
            
            if (document.userId?.toString() !== req.user.userId) {
                return res.status(403).json({ error: "Forbidden - Not the owner" });
            }
            
            next();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}; 