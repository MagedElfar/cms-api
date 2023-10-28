import { Logger } from './../utility/logger';
import { Request, Response, NextFunction } from "express";
import AttributesServices, { IAttr } from "../services/attributes.services";
import EntitiesServices from "../services/entities.services";
import { NotFoundError } from '../utility/errors';

export interface IModel {
    entity: string,
    attributes: IAttr[]
}

export default async function mapModelMiddleware(req: Request, res: Response, next: NextFunction) {

    try {
        const { entity } = req.params
        const logger = new Logger()
        const entitiesServices = new EntitiesServices(logger)

        const tables = await entitiesServices.getEntities()

        if (!tables.includes(entity)) return next(new NotFoundError("entity not exist"))

        const attributesServices = new AttributesServices(
            entitiesServices,
            logger
        )

        const attributes = await attributesServices.getColumns({ entity })

        const model: IModel = {
            entity,
            attributes
        }

        req.model = model

        return next()

    } catch (error) {
        throw error
    }



}