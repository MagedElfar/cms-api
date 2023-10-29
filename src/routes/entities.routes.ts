import { Router } from "express"
import * as entitiesValidation from "../validations/entities.validation"
import validation from "../middlewares/validation.middleware"
import { Logger } from '../utility/logger';
import EntitiesController from "../controllers/entities.controllers";
import EntitiesServices from "../services/entities.services";
import { permissionMiddleware } from "../middlewares/permission.middleware";
import EntityRepository from "../repositories/entity.repository";

const entitiesRouter = Router();

const entitiesController: EntitiesController = new EntitiesController(
    new EntitiesServices(
        new EntityRepository(),
        new Logger())
    ,
)

entitiesRouter.get(
    "/",
    validation(entitiesValidation.getManySchema, "query"),
    entitiesController.getEntitiesHandler.bind(entitiesController)
)

entitiesRouter.get(
    "/:id",
    entitiesController.getEntityHandler.bind(entitiesController)
)

entitiesRouter.post(
    "/",
    permissionMiddleware,
    validation(entitiesValidation.createModelSchema),
    entitiesController.createEntitiesHandler.bind(entitiesController)
)

entitiesRouter.delete(
    "/:id",
    permissionMiddleware,
    entitiesController.dropEntitiesHandler.bind(entitiesController)
)

entitiesRouter.put(
    "/:id",
    permissionMiddleware,
    validation(entitiesValidation.updateEntitySchema),
    entitiesController.updateEntitiesHandler.bind(entitiesController)
)

export default entitiesRouter;