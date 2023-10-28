import { Router } from "express"
import * as entitiesValidation from "../validations/entities.validation"
import validation from "../middlewares/validation.middleware"
import { Logger } from '../utility/logger';
import EntitiesController from "../controllers/entities.controllers";
import EntitiesServices from "../services/entities.services";
import { permissionMiddleware } from "../middlewares/permission.middleware";

const entitiesRouter = Router();

const entitiesController: EntitiesController = new EntitiesController(
    new EntitiesServices(new Logger())
)

entitiesRouter.get(
    "/",
    entitiesController.getEntitiesHandler.bind(entitiesController)
)

entitiesRouter.post(
    "/",
    permissionMiddleware,
    validation(entitiesValidation.createModelSchema),
    entitiesController.createEntitiesHandler.bind(entitiesController)
)

entitiesRouter.delete(
    "/:entity",
    permissionMiddleware,
    validation(entitiesValidation.removeEntitySchema, "param"),
    entitiesController.dropEntitiesHandler.bind(entitiesController)
)

entitiesRouter.put(
    "/",
    permissionMiddleware,
    validation(entitiesValidation.updateEntitySchema),
    entitiesController.updateEntitiesHandler.bind(entitiesController)
)

export default entitiesRouter;