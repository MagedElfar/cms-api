// src/controllers/userController.ts
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utility/responseHelpers";
import { IAttributesServices } from "../services/attributes.services";

export default class AttributesController {

    private attributesServices: IAttributesServices

    constructor(attributesServices: IAttributesServices) {
        this.attributesServices = attributesServices
    }


    async createAttributeHandler(req: Request, res: Response, next: NextFunction) {

        try {

            await this.attributesServices.createAttributes(req.body);

            sendResponse(res, {
                message: "attributes is added successfully"
            }, 201)

        } catch (error) {
            next(error)
        }

    }

    async removeAttributeHandler(req: Request, res: Response, next: NextFunction) {
        try {

            const { entity, attribute } = req.params
            await this.attributesServices.removeAttribute({ entity, attribute });

            sendResponse(res, {
                message: "attributes is removed successfully"
            }, 200)

        } catch (error) {
            next(error)
        }
    }

    async renameAttributeHandler(req: Request, res: Response, next: NextFunction) {
        try {

            await this.attributesServices.renameAttribute(req.body);

            sendResponse(res, {
                message: "attribute is renamed successfully"
            }, 200)

        } catch (error) {
            next(error)
        }
    }

    async getAttributeHandler(req: Request, res: Response, next: NextFunction) {
        try {

            const { entity } = req.params

            const attributes = await this.attributesServices.getColumns({ entity });

            sendResponse(res, {
                data: {
                    entity,
                    attributes
                }
            }, 200)

        } catch (error) {
            next(error)
        }
    }


}
