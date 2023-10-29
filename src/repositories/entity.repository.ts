import { WhereOptions, Attributes } from "sequelize";
import Entity, { EntityAttributes } from "../models/entity.model";
import { InternalServerError } from "../utility/errors";
import GenericRepository from "./genericRepository";
import Attribute from "../models/attribute.model";

export default class EntityRepository extends GenericRepository<Entity, EntityAttributes> {

    constructor() {
        super(Entity)
    }

    public async findOne(data: WhereOptions<Attributes<Entity>>): Promise<EntityAttributes | null> {
        try {
            const model = await this.model.findOne({
                where: data,
                include: [
                    {
                        model: Attribute,
                        as: "attributes",
                        attributes: {
                            exclude: ['EntityInstance'], // Exclude the 'EntityInstance' attribute
                        },
                        include: [
                            {
                                model: Entity,
                                as: "ref"
                            }
                        ]
                    },

                ]
            });

            if (!model) return null

            return model?.dataValues
        } catch (error: any) {
            console.log(error)
            this.logger.error("database error", null, error?.stack || error?.message || error)
            throw new InternalServerError("database error")
        }
    }
}