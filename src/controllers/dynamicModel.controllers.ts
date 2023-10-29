// src/controllers/userController.ts
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utility/responseHelpers";
import { NotFoundError } from "../utility/errors";
import { IDynamicModelServices } from "../services/dynamicModel.services";

export class DynamicModelController {

    private dynamicModelServices: IDynamicModelServices

    constructor(dynamicModelServices: IDynamicModelServices) {
        this.dynamicModelServices = dynamicModelServices
    }

    async createRecordHandler(req: Request, res: Response, next: NextFunction) {

        try {
            const data = await this.dynamicModelServices
                .createRecord(
                    {
                        entity: req.entity,
                        data: req.body
                    }
                )
            sendResponse(res, {
                message: `new record is added successfully from '${req.entity.name}' entity`,
                data
            }, 201)

        } catch (error) {
            next(error)
        }

    }

    async updateRecordHandler(req: Request, res: Response, next: NextFunction) {

        try {
            const { id } = req.params;

            const data = await this.dynamicModelServices
                .updateRecord(
                    {
                        entity: req.entity,
                        data: req.body,
                        id: +id
                    }
                )
            sendResponse(res, {
                message: `record updated successfully in '${req.entity.name}' entity`,
                data
            }, 200)

        } catch (error) {
            next(error)
        }

    }

    async getManyRecordsHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const { limit = 10, page = 1, ...others } = req.query

            const data = await this.dynamicModelServices
                .getManyRecords(
                    {
                        entity: req.entity,
                        data: others,
                        options: {
                            limit: +limit,
                            page: +page
                        }
                    }
                )
            sendResponse(res, {
                message: `get records from '${req.entity.name}' entity`,
                data
            }, 200)

        } catch (error) {
            next(error)
        }

    }

    async getRecordByIdHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const { id } = req.params
            const data = await this.dynamicModelServices
                .getRecordById(
                    {
                        entity: req.entity,
                        id: +id
                    }
                )
            sendResponse(res, {
                message: `get record from '${req.entity.name}' entity`,
                data
            }, 200)

        } catch (error) {
            next(error)
        }

    }

    async deleteRecordHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const { id } = req.params;

            await this.dynamicModelServices
                .deleteRecord(
                    {
                        entity: req.entity,
                        id: +id
                    }
                )
            sendResponse(res, {
                message: `delete record from '${req.entity.name}' entity`,
            }, 200)

        } catch (error) {
            next(error)
        }

    }
}
