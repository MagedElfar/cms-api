import { Router } from "express"
import authRoutes from "./auth.routes"
import userRoutes from "./user.routes"
import unHandelRouter from "./unHandel.routes";
import authMiddleware from "../middlewares/auth.middleware";
import dynamicModelRouter from "./dynamicModel.routes";
import { permissionMiddleware } from "../middlewares/permission.middleware";

const router = Router();

router.use("/auth", authRoutes)
router.use("/users", authMiddleware.authenticate, userRoutes)
router.use("/entities", authMiddleware.authenticate, permissionMiddleware, dynamicModelRouter)
router.use("/*", unHandelRouter)

export default router;