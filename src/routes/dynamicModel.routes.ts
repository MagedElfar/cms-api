import DynamicModelController from './../controllers/dynamicModel.controllers';
import { UserController } from '../controllers/user.controllers';
import { Router } from "express"
import * as dynamicModelValidation from "./../validations/dynamicModel.validation"
import validation from "./../middlewares/validation.middleware"
import DynamicModelServices from '../services/dynamicModel.services';
import { Logger } from '../utility/logger';

const dynamicModelRouter = Router();

const dynamicModelController: DynamicModelController = new DynamicModelController(
    new DynamicModelServices(new Logger)
)

dynamicModelRouter.post(
    "/",
    validation(dynamicModelValidation.createModelSchema),
    dynamicModelController.createModelHandler.bind(dynamicModelController)
)

dynamicModelRouter.post(
    "/attributes",
    validation(dynamicModelValidation.createAttributeSchema),
    dynamicModelController.createAttributeHandler.bind(dynamicModelController)
)



export default dynamicModelRouter;