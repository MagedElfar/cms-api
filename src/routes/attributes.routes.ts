import { Router } from "express"
import * as attributeValidation from "../validations/attribute.validation"
import validation from "../middlewares/validation.middleware"
import { Logger } from '../utility/logger';
import EntitiesServices from "../services/entities.services";
import AttributesController from "../controllers/attributes.controllers";
import AttributesServices from "../services/attributes.services";
import { permissionMiddleware } from "../middlewares/permission.middleware";
import AttributeRepository from "../repositories/attribute.repository";
import EntityRepository from "../repositories/entity.repository";

const attributesRouter = Router();

const attributesController: AttributesController = new AttributesController(
    new AttributesServices(
        new AttributeRepository(),
        new EntitiesServices(new EntityRepository(), new Logger()),
        new Logger()
    )
)

attributesRouter.get(
    "/",
    validation(attributeValidation.getManySchema, "query"),
    attributesController.getAttributesHandler.bind(attributesController)
)


attributesRouter.post(
    "/",
    permissionMiddleware,
    validation(attributeValidation.createAttributeSchema),
    attributesController.createAttributeHandler.bind(attributesController)
)

attributesRouter.put(
    "/:id",
    permissionMiddleware,
    validation(attributeValidation.updateAttributeSchema),
    attributesController.updateAttributeHandler.bind(attributesController)
)

attributesRouter.get(
    "/:id",
    attributesController.getAttributeHandler.bind(attributesController)
)


attributesRouter.delete(
    "/:id",
    permissionMiddleware,
    attributesController.removeAttributeHandler.bind(attributesController)
)

// attributesRouter.put(
//     "/rename",
//     permissionMiddleware,
//     validation(attributeValidation.renameAttributeSchema),
//     attributesController.renameAttributeHandler.bind(attributesController)
// )

// attributesRouter.get(
//     "/:entity",
//     validation(attributeValidation.getAttributeSchema, "param"),
//     attributesController.getAttributeHandler.bind(attributesController)
// )


export default attributesRouter;