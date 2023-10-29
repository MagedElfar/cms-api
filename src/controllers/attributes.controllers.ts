// src/controllers/userController.ts
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utility/responseHelpers";
import { IAttributesServices } from "../services/attributes.services";
import { NotFoundError } from "../utility/errors";

export default class AttributesController {

    private attributesServices: IAttributesServices

    constructor(attributesServices: IAttributesServices) {

        this.attributesServices = attributesServices
    }


    async createAttributeHandler(req: Request, res: Response, next: NextFunction) {

        try {


            const attribute = await this.attributesServices.createAttributes(req.body);

            sendResponse(res, {
                message: "attributes is added successfully",
                attribute
            }, 201)

        } catch (error) {
            next(error)
        }

    }

    async updateAttributeHandler(req: Request, res: Response, next: NextFunction) {

        try {


            const attribute = await this.attributesServices.updateAttribute({
                ...req.body,
                ...req.params
            });

            sendResponse(res, {
                message: "attributes is added successfully",
                attribute
            }, 201)

        } catch (error) {
            next(error)
        }

    }

    async getAttributeHandler(req: Request, res: Response, next: NextFunction) {

        try {


            const attribute = await this.attributesServices.getAttribute(req.params);

            if (!attribute) throw new NotFoundError("attribute not found");

            sendResponse(res, {
                attribute
            }, 200)

        } catch (error) {
            next(error)
        }

    }

    async removeAttributeHandler(req: Request, res: Response, next: NextFunction) {
        try {

            const { id } = req.params
            await this.attributesServices.deleteAttribute(+id);

            sendResponse(res, {
                message: "attributes is removed successfully"
            }, 200)

        } catch (error) {
            next(error)
        }
    }

    async getAttributesHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const { limit = 10, page = 1, ...others } = req.query

            const entities = await this.attributesServices.getAttributes({
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


}
