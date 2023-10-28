// src/controllers/userController.ts
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utility/responseHelpers";
import { IEntitiesServices } from "../services/entities.services";

export default class EntitiesController {

    private entitiesServices: IEntitiesServices

    constructor(entitiesServices: IEntitiesServices) {
        this.entitiesServices = entitiesServices
    }

    async createEntitiesHandler(req: Request, res: Response, next: NextFunction) {

        try {

            await this.entitiesServices.createEntities(req.body);

            sendResponse(res, {
                message: "entities is created successfully"
            }, 201)

        } catch (error) {
            next(error)
        }

    }

    async getEntitiesHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const entities = await this.entitiesServices.getEntities();

            sendResponse(res, {
                entities
            }, 200)

        } catch (error) {
            next(error)
        }

    }

    async dropEntitiesHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const { entity } = req.params;

            await this.entitiesServices.dropEntity(entity);

            sendResponse(res, {}, 200)

        } catch (error) {
            next(error)
        }

    }

    async updateEntitiesHandler(req: Request, res: Response, next: NextFunction) {

        try {

            await this.entitiesServices.updatedEntity(req.body);

            sendResponse(res, {}, 200)

        } catch (error) {
            next(error)
        }

    }
}
