import { Router } from "express"
import * as entityInstanceValidation from "../validations/entityInstance.validation"
import validation from "../middlewares/validation.middleware"
import { Logger } from '../utility/logger';
import EntitiesServices from "../services/entities.services";
import AttributesServices from "../services/attributes.services";
import { permissionMiddleware } from "../middlewares/permission.middleware";
import AttributeRepository from "../repositories/attribute.repository";
import EntityRepository from "../repositories/entity.repository";
import EntitiesInstanceController from '../controllers/entityInstance.controllers';
import EntityInstanceServices from '../services/entityInstance.services';
import EntityInstanceRepository from '../repositories/entityInstance.repository';

const entityInstanceRouter = Router();

const entitiesInstanceController: EntitiesInstanceController = new EntitiesInstanceController(
    new EntityInstanceServices(
        new AttributesServices(
            new AttributeRepository(),
            new EntitiesServices(new EntityRepository(), new Logger()),
            new Logger()
        ),
        new EntitiesServices(new EntityRepository(), new Logger()),
        new EntityInstanceRepository()
    )
)


entityInstanceRouter.post(
    "/",
    permissionMiddleware,
    validation(entityInstanceValidation.assignEntityAttributeSchema),
    entitiesInstanceController.assignAttributeEntitiesHandler.bind(entitiesInstanceController)
)

export default entityInstanceRouter