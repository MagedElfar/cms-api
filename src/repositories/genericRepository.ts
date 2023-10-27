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
            this.logger.error("database error", null, error?.stack || error?.message || error)
            throw new InternalServerError("database error")
        }
    }

    // ... other methods ...

    public async findMany(options: FindManyOptions<T> = {}): Promise<{ count: number, data: I[] }> {
        try {
            const queryOptions: FindOptions = {};

            if (options.where && Object.keys(options.where).length > 0) {
                queryOptions.where = options.where;
            }

            if (options.order) {
                queryOptions.order = options.order
            }

            if (options.offset !== undefined) {
                queryOptions.offset = options.offset;
            }

            if (options.limit !== undefined) {
                queryOptions.limit = options.limit;
            }

            const models = await this.model.findAll(queryOptions);

            const count = await this.model.count({
                where: queryOptions.where,
            });

            const data = models.map((model) => model.dataValues);

            return { count, data }
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