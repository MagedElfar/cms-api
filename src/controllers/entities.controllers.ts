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

            const entity = await this.entitiesServices.createEntities(req.body);

            sendResponse(res, {
                message: "entities is created successfully",
                entity
            }, 201)

        } catch (error) {
            next(error)
        }

    }

    async getEntitiesHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const { limit = 10, page = 1, ...others } = req.query

            const entities = await this.entitiesServices.getEntities({
                data: others,
                options: {
                    limit: +limit,
                    page: +page
                }
            });

            sendResponse(res, {
                entities
            }, 200)

        } catch (error) {
            next(error)
        }

    }

    async getEntityHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const { id } = req.params

            const entity = await this.entitiesServices.getEntity({ id: +id });

            sendResponse(res, {
                entity
            }, 200)

        } catch (error) {
            next(error)
        }

    }

    async dropEntitiesHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const { id } = req.params;

            await this.entitiesServices.dropEntity(+id);

            sendResponse(res, {}, 200)

        } catch (error) {
            next(error)
        }

    }

    async updateEntitiesHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const { id } = req.params

            await this.entitiesServices.updatedEntity({
                ...req.body,
                id: +id
            });

            sendResponse(res, {}, 200)

        } catch (error) {
            next(error)
        }

    }
}
