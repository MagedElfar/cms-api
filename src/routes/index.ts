import { Router } from "express"
import authRoutes from "./auth.routes"
import userRoutes from "./user.routes"
import unHandelRouter from "./unHandel.routes";
import authMiddleware from "../middlewares/auth.middleware";
import entitiesRouter from "./entities.routes";
import attributesRouter from "./attributes.routes";
import dynamicModelRouter from "./dynamicModel.routes";
import { permissionMiddleware } from "../middlewares/permission.middleware";
import entityInstanceRouter from "./entityInstance.routes";

const router = Router();

router.use("/auth", authRoutes)
router.use("/users", authMiddleware.authenticate, userRoutes)
router.use("/entities", authMiddleware.authenticate, entitiesRouter)
router.use("/attributes", authMiddleware.authenticate, attributesRouter)
router.use("/entities_attributes", authMiddleware.authenticate, permissionMiddleware, entityInstanceRouter)

// router.use("/model", authMiddleware.authenticate, dynamicModelRouter)
router.use("/*", unHandelRouter)

export default router;