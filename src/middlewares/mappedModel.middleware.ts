import { Logger } from './../utility/logger';
import { Request, Response, NextFunction } from "express";
import EntitiesServices from "../services/entities.services";
import { NotFoundError } from '../utility/errors';
import EntityRepository from '../repositories/entity.repository';


export default async function mapModelMiddleware(req: Request, res: Response, next: NextFunction) {

    try {
        const logger = new Logger()

        const entityRepository = new EntityRepository()
        const entitiesServices = new EntitiesServices(entityRepository, logger)

        const entity = await entitiesServices.getEntity({ name: req.params.entity })

        if (!entity) return next(new NotFoundError("entity not exist"))

        req.entity = entity

        return next()

    } catch (error) {
        throw error
    }



}