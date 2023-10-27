import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../utility/errors";
import User, { Roles } from "../models/user.model";

export function permissionMiddleware(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User; // Cast req.user to User type

    if (req.user?.role === Roles.ADMIN) return next()

    const { id } = req.params;


    if (+id !== req.user?.id) return next(new ForbiddenError("Forbidden"))

}