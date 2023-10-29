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

    public async findMany(getManyDto: GetManyDto): Promise<{ count: number, records: AttrAttributes[] }> {
        try {
            const data = await this.model.findAll({
                where: getManyDto.data,
                limit: getManyDto.options.limit,
                offset: (getManyDto.options.page - 1) * getManyDto.options.limit,
            });

            const count = await this.model.count({
                include: [
                    {
                        model: Entity,
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