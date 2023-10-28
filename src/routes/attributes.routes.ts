import { Router } from "express"
import * as attributeValidation from "../validations/attribute.validation"
import validation from "../middlewares/validation.middleware"
import { Logger } from '../utility/logger';
import EntitiesServices from "../services/entities.services";
import AttributesController from "../controllers/attributes.controllers";
import AttributesServices from "../services/attributes.services";
import { permissionMiddleware } from "../middlewares/permission.middleware";

const attributesRouter = Router();

const attributesController: AttributesController = new AttributesController(
    new AttributesServices(
        new EntitiesServices(new Logger()),
        new Logger()
    )
)


attributesRouter.post(
    "/",
    permissionMiddleware,
    validation(attributeValidation.createAttributeSchema),
    attributesController.createAttributeHandler.bind(attributesController)
)

attributesRouter.delete(
    "/:entity/:attribute",
    permissionMiddleware,
    validation(attributeValidation.removeAttributeSchema, "param"),
    attributesController.removeAttributeHandler.bind(attributesController)
)

attributesRouter.put(
    "/rename",
    permissionMiddleware,
    validation(attributeValidation.renameAttributeSchema),
    attributesController.renameAttributeHandler.bind(attributesController)
)

attributesRouter.get(
    "/:entity",
    validation(attributeValidation.getAttributeSchema, "param"),
    attributesController.getAttributeHandler.bind(attributesController)
)


export default attributesRouter;