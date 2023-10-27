import { Router } from "express"
import * as dynamicModelValidation from "../validations/dynamicModel.validation"
import validation from "../middlewares/validation.middleware"
import { Logger } from '../utility/logger';
import EntitiesController from "../controllers/entities.controllers";
import EntitiesServices from "../services/entities.services";
import { permissionMiddleware } from "../middlewares/permission.middleware";

const entitiesRouter = Router();

const entitiesController: EntitiesController = new EntitiesController(
    new EntitiesServices(new Logger)
)

entitiesRouter.get(
    "/",
    validation(dynamicModelValidation.createModelSchema),
    entitiesController.getEntitiesHandler.bind(entitiesController)
)

entitiesRouter.post(
    "/",
    permissionMiddleware,
    validation(dynamicModelValidation.createModelSchema),
    entitiesController.createEntitiesHandler.bind(entitiesController)
)

// entitiesRouter.post(
//     "/attributes",
//     validation(dynamicModelValidation.createAttributeSchema),
//     dynamicModelController.createAttributeHandler.bind(dynamicModelController)
// )



export default entitiesRouter;