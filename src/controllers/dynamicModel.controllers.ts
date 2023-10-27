// src/controllers/userController.ts
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utility/responseHelpers";
import { IDynamicModelServices } from "../services/dynamicModel.services";

export default class DynamicModelController {

    private dynamicModelServices: IDynamicModelServices

    constructor(dynamicModelServices: IDynamicModelServices) {
        this.dynamicModelServices = dynamicModelServices
    }

    async createModelHandler(req: Request, res: Response, next: NextFunction) {

        try {

            await this.dynamicModelServices.createModel(req.body);

            sendResponse(res, {
                message: "model is created successfully"
            }, 201)

        } catch (error) {
            next(error)
        }

    }

    async createAttributeHandler(req: Request, res: Response, next: NextFunction) {

        try {

            await this.dynamicModelServices.addColumn(req.body);

            sendResponse(res, {
                message: "attribute is added successfully"
            }, 201)

        } catch (error) {
            next(error)
        }

    }
}
