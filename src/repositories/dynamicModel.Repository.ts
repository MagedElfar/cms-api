import { CreateRecordDto, DeleteRecordDto, GetManyRecordDto, GetOneRecordDto, GetRecordByIdDto, UpdateRecordDto } from '../dto/dynamicModel.dto';
import databaseConfig, { DatabaseConfig } from "../db";
import { ILogger } from "../utility/logger";
import { InternalServerError } from '../utility/errors';
import DynamicModel from '../models/dynamicModel.model';


export interface IDynamicRepository {
    createRecord(createRecordDto: CreateRecordDto): Promise<any>
    deleteRecord(deleteRecordDto: DeleteRecordDto): Promise<any>
    updateRecord(updateRecordDto: UpdateRecordDto): Promise<any>
    findOneRecord(getOneRecordDto: GetOneRecordDto): Promise<any>
    findRecordById(getRecordByIdDto: GetRecordByIdDto): Promise<any>
    findManyRecord(getManyRecordDto: GetManyRecordDto): Promise<any>
}

export default class DynamicRepository implements IDynamicRepository {
    private readonly logger: ILogger;

    constructor(
        logger: ILogger
    ) {
        this.logger = logger
    }


    async createRecord(createRecordDto: CreateRecordDto) {
        try {

            const model = new DynamicModel(createRecordDto.model).mainModel()

            const data = await model.create(createRecordDto.data)

            return data.dataValues

        } catch (error: any) {
            this.logger.error("database error", null, error?.stack || error?.message || error)
            throw new InternalServerError("database error")
        }
    }

    async updateRecord(updateRecordDto: UpdateRecordDto) {
        try {

            const model = new DynamicModel(updateRecordDto.model).mainModel()

            const [rowCount] = await model.update(updateRecordDto.data, {
                where: { id: updateRecordDto.id }
            });

            if (rowCount === 0) {
                return null;
            }

        } catch (error: any) {
            this.logger.error("database error", null, error?.stack || error?.message || error)
            throw new InternalServerError("database error")
        }
    }

    public async findManyRecord(getManyRecordDto: GetManyRecordDto): Promise<any> {
        try {
            const dynamicModel = new DynamicModel(getManyRecordDto.model);

            const { model, include } = await dynamicModel.referenceModel()

            const data = await model.findAll({
                where: getManyRecordDto.data,
                limit: getManyRecordDto.options.limit,
                offset: (getManyRecordDto.options.page - 1) * getManyRecordDto.options.limit,
                include
            });

            const count = await model.count({
                where: getManyRecordDto.data,
            });

            const records = data.map((model) => model.dataValues);

            return { count, records }
        } catch (error: any) {
            this.logger.error("database error", null, error);
            throw new InternalServerError("database error");
        }
    }

    public async findRecordById(getRecordByIdDto: GetRecordByIdDto) {
        try {

            const dynamicModel = new DynamicModel(getRecordByIdDto.model);

            const { model, include } = await dynamicModel.referenceModel()

            const data = await model.findByPk(getRecordByIdDto.id, {
                include
            })

            return data?.dataValues
        } catch (error: any) {
            this.logger.error("database error", null, error?.stack || error?.message || error)
            throw new InternalServerError("database error")
        }
    }

    public async findOneRecord(getOneRecordDto: GetOneRecordDto) {
        try {
            const model = new DynamicModel(getOneRecordDto.model).mainModel()

            const data = await model.findOne({
                where: getOneRecordDto.data
            });

            return data?.dataValues
        } catch (error: any) {
            this.logger.error("database error", null, error?.stack || error?.message || error)
            throw new InternalServerError("database error")
        }
    }

    public async deleteRecord(deleteRecordDto: DeleteRecordDto) {
        try {

            const dynamicModel = new DynamicModel(deleteRecordDto.model);

            const model = dynamicModel.mainModel()

            return await model.destroy({
                where: { id: deleteRecordDto.id }
            })

        } catch (error: any) {
            this.logger.error("database error", null, error?.stack || error?.message || error)
            throw new InternalServerError("database error")
        }
    }




    // async updateRecord(id, data) {
    //     return sequelize.getQueryInterface().update(data, { where: { id } }, this.tableName);
    // }

    // async deleteRecord(id) {
    //     return sequelize.getQueryInterface().delete(null, { where: { id } }, this.tableName);
    // }
}
