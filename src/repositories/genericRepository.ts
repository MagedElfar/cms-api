import { Attributes, UpdateOptions, Model, ModelStatic, WhereAttributeHashValue, WhereOptions, FindOptions, Order, Op } from "sequelize";
import { MakeNullishOptional } from "sequelize/types/utils";
import { ILogger, Logger } from "../utility/logger";
import { InternalServerError } from "../utility/errors";

export interface FindManyOptions<T extends Model> {
    where?: WhereOptions<Attributes<T>> & {
        [Op.like]?: string
    };
    order?: Order;
    offset?: number;
    limit?: number;
}

export class GetManyDto {
    data: any
    options: {
        limit: number,
        page: number
    }
}

export default abstract class GenericRepository<T extends Model, I> {

    protected model: ModelStatic<T>
    protected readonly logger: ILogger

    constructor(model: ModelStatic<T>) {
        this.model = model
        this.logger = new Logger()

    }

    public async create(data: MakeNullishOptional<T["_creationAttributes"]>): Promise<I> {
        try {
            const model = await this.model.create(data)

            return model.dataValues

        } catch (error: any) {
            console.log(error)
            this.logger.error("database error", null, error?.stack || error?.message || error)
            throw new InternalServerError("database error")
        }

    }

    public async findById(id: number): Promise<I | null> {
        try {
            const model = await this.model.findByPk(id)

            return model?.dataValues
        } catch (error: any) {
            this.logger.error("database error", null, error?.stack || error?.message || error)
            throw new InternalServerError("database error")
        }
    }

    public async findOne(data: WhereOptions<Attributes<T>>): Promise<I | null> {
        try {
            const model = await this.model.findOne({
                where: data
            });

            return model?.dataValues
        } catch (error: any) {
            console.log(error)
            this.logger.error("database error", null, error?.stack || error?.message || error)
            throw new InternalServerError("database error")
        }
    }

    public async findMany(getManyDto: GetManyDto): Promise<{ count: number, records: I[] }> {
        try {
            const data = await this.model.findAll({
                where: getManyDto?.data?.name ?
                    {
                        name: {
                            [Op.like]: `%${getManyDto.data.name}%`
                        }
                    } : getManyDto.data,

                limit: getManyDto.options.limit,
                offset: (getManyDto.options.page - 1) * getManyDto.options.limit,
            });

            const count = await this.model.count({
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

    public async update(id: number, updates: Partial<T>): Promise<I | null> {
        try {
            const updateOptions: UpdateOptions = {
                where: { id },
            };

            const [rowCount] = await this.model.update(updates, updateOptions);

            if (rowCount === 0) {
                return null;
            }

            return await this.findById(id)

        } catch (error: any) {
            this.logger.error("database error", null, error?.stack || error?.message || error)
            throw new InternalServerError("database error")
        }
    }

    public async getCount(data: WhereOptions<Attributes<T>>): Promise<number> {
        try {


            const count = await this.model.count({
                where: data
            });


            return count
        } catch (error: any) {
            this.logger.error("database error", null, error);
            throw new InternalServerError("database error");
        }
    }

    public async delete(option: WhereAttributeHashValue<Attributes<T>[string]>): Promise<number> {
        try {
            return await this.model.destroy({
                where: option
            })
        } catch (error: any) {
            this.logger.error("database error", null, error?.stack || error?.message || error)
            throw new InternalServerError("database error")
        }

    }
}