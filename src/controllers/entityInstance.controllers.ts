// src/controllers/userController.ts
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utility/responseHelpers";
import { IEntityInstanceServices } from "../services/entityInstance.services";

export default class EntitiesInstanceController {

    private entityInstanceServices: IEntityInstanceServices

    constructor(entityInstanceServices: IEntityInstanceServices) {
        this.entityInstanceServices = entityInstanceServices
    }

    async assignAttributeEntitiesHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const entityValue = await this.entityInstanceServices.create(req.body);

            sendResponse(res, {
                message: "assign custom attribute to an entity",
                entityValue
            }, 201)

        } catch (error) {
            next(error)
        }

    }
}
