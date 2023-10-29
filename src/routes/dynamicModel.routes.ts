import { Router } from "express"
import * as dynamicModelValidation from "../validations/dynamicModel.validation"
import validation, { createRecordSchemaMiddleware, updateRecordSchemaMiddleware, getAllRecordSchemaMiddleware } from "../middlewares/validation.middleware"
import mapModelMiddleware from "../middlewares/mappedModel.middleware";
import { DynamicModelController } from "../controllers/dynamicModel.controllers";
import DynamicModelServices from "../services/dynamicModel.services";
import DynamicRepository from "../repositories/dynamicModel.repository";
import { Logger } from "../utility/logger";
import EntityRepository from "../repositories/entity.repository";

const dynamicModelRouter = Router();

const dynamicModelController: DynamicModelController = new DynamicModelController(
    new DynamicModelServices(
        new DynamicRepository(new EntityRepository(), new Logger()),
    )
)

dynamicModelRouter.post(
    "/:entity",
    validation(dynamicModelValidation.paramRecordSchema, "param"),
    mapModelMiddleware,
    createRecordSchemaMiddleware,
    dynamicModelController.createRecordHandler.bind(dynamicModelController)
)

dynamicModelRouter.put(
    "/:entity/:id",
    validation(dynamicModelValidation.paramRecordSchema, "param"),
    mapModelMiddleware,
    updateRecordSchemaMiddleware,
    dynamicModelController.updateRecordHandler.bind(dynamicModelController)
)

dynamicModelRouter.get(
    "/:entity",
    validation(dynamicModelValidation.paramRecordSchema, "param"),
    mapModelMiddleware,
    getAllRecordSchemaMiddleware,
    dynamicModelController.getManyRecordsHandler.bind(dynamicModelController)
)

dynamicModelRouter.get(
    "/:entity/:id",
    validation(dynamicModelValidation.paramRecordSchema, "param"),
    mapModelMiddleware,
    dynamicModelController.getRecordByIdHandler.bind(dynamicModelController)
)

dynamicModelRouter.delete(
    "/:entity/:id",
    validation(dynamicModelValidation.paramRecordSchema, "param"),
    mapModelMiddleware,
    dynamicModelController.deleteRecordHandler.bind(dynamicModelController)
)

export default dynamicModelRouter;