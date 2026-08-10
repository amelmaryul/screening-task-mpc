import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        );

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
}


export function requireAdmin(
    req: Request,
    res: Response,
    next: NextFunction
) {

    const authHeader = req.headers.authorization
    if (!authHeader){
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });

    }
    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload

        if (decoded.role !== "admin"){
            return res.status(403).json({
                success: false,
                message: "Unauthorized. Only admins can access this"
            });
        }

        next()

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
}