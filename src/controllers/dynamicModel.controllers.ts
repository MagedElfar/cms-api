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
                        model: req.model,
                        data: req.body
                    }
                )
            sendResponse(res, {
                message: `new record is added successfully from '${req.model.entity}' entity`,
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
                        model: req.model,
                        data: req.body,
                        id: +id
                    }
                )
            sendResponse(res, {
                message: `record updated successfully in '${req.model.entity}' entity`,
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
                        model: req.model,
                        data: others,
                        options: {
                            limit: +limit,
                            page: +page
                        }
                    }
                )
            sendResponse(res, {
                message: `get records from '${req.model.entity}' entity`,
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
                        model: req.model,
                        id: +id
                    }
                )
            sendResponse(res, {
                message: `get record from '${req.model.entity}' entity`,
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
                        model: req.model,
                        id: +id
                    }
                )
            sendResponse(res, {
                message: `delete record from '${req.model.entity}' entity`,
            }, 200)

        } catch (error) {
            next(error)
        }

    }
}
