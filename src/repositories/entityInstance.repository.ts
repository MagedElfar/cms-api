import { Op } from "sequelize";
import Attribute from "../models/attribute.model";
import { InternalServerError } from "../utility/errors";
import GenericRepository, { GetManyDto } from "./genericRepository";
import Entity from "../models/entity.model";
import EntityInstance, { EntityInstanceAttributes } from "../models/entityInstance.model";

export default class EntityInstanceRepository extends GenericRepository<EntityInstance, EntityInstanceAttributes> {

    constructor() {
        super(EntityInstance)
    }

    public async findMany(getManyDto: GetManyDto): Promise<{ count: number, records: EntityInstanceAttributes[] }> {
        try {
            const data = await this.model.findAll({
                where: getManyDto.data,
                limit: getManyDto.options.limit,
                offset: (getManyDto.options.page - 1) * getManyDto.options.limit,
            });

            const count = await this.model.count({
                include: [
                    {
                        model: Attribute,
                        attributes: ["name"],
                        as: "ref",
                    },
                ],
                where: getManyDto?.data?.name ?
                    {
                        name: {
                            [Op.like]: `%${getManyDto.data.name}%`
                        }
                    } : getManyDto.data
            });

            const records = data.map((model) => model.dataValues);

            return { count, records }

        } catch (error: any) {
            this.logger.error("database error", null, error);
            throw new InternalServerError("database error");
        }
    }


}