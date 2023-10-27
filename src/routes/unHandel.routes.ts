import { NextFunction, Request, Response, Router } from "express"
import { NotFoundError } from "../utility/errors";

const unHandelRouter = Router();


unHandelRouter.use((req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError("Router not found"))
})



export default unHandelRouter; 