import { WhereOptions, Attributes, Op, UpdateOptions } from "sequelize";
import Attribute, { AttrAttributes } from "../models/attribute.model";
import { InternalServerError } from "../utility/errors";
import GenericRepository, { GetManyDto } from "./genericRepository";
import Entity from "../models/entity.model";

export default class AttributeRepository extends GenericRepository<Attribute, AttrAttributes> {

    constructor() {
        super(Attribute)
    }

    public async findOne(data: WhereOptions<Attributes<Attribute>>): Promise<AttrAttributes | null> {
        try {
            const model = await this.model.findOne({
                where: data,
                include: [
                    {
                        model: Entity,
                        attributes: ["name"],
                        as: "entities",
                    },
                    {
                        model: Entity,
                        attributes: ["name"],
                        as: "ref",
                    },
                ]
            });

            if (!model) return null

            return model?.dataValues
        } catch (error: any) {
            this.logger.error("database error", null, error?.stack || error?.message || error)
            throw new InternalServerError("database error")
        }
    }


}