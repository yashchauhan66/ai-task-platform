import jwt from "jsonwebtoken"

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "unauthorized" });
        }

        const decodeToken = jwt.verify(token, process.env.Secret_Key);
        req.user = decodeToken;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

export default auth;