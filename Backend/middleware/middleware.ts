import { Response, NextFunction } from "express";
import { JWT_SECRET } from "../lib/config";

const jwt: any = require("jsonwebtoken")

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({
            message: "Invalid token"
        })
    }

    try {
        const token: string = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            throw Error;
        }
    } catch (error) {
        res.status(403).json({
            message: "Invalid token"
        })
    }
}

export {
    authMiddleware
}