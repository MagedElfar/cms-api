import { ILogger } from "../utility/logger";
import { CreateEntitiesDto, UpdatedEntityDto } from "../dto/entities.dto";
import databaseConfig, { DatabaseConfig } from "../db";
import { BadRequestError, NotFoundError } from "../utility/errors";
import { DataTypes, ModelAttributes } from "sequelize";
import EntityRepository from "../repositories/entity.repository";
import { EntityAttributes } from "../models/entity.model";
import DynamicModel from "../models/dynamicModel.model";
import { migration } from "../db/migration";
import { GetManyDto } from "../repositories/genericRepository";


export interface IEntitiesServices {
    createEntities(createEntitiesDto: CreateEntitiesDto): Promise<EntityAttributes>;
    getEntities(getManyDto: GetManyDto): Promise<any>;
    dropEntity(id: number): Promise<void>
    updatedEntity(updatedEntityDto: UpdatedEntityDto): Promise<void>
    getEntity(entityAttributes: Partial<EntityAttributes>): Promise<EntityAttributes | null>
}

export default class EntitiesServices implements IEntitiesServices {

    private readonly logger: ILogger;
    private readonly databaseConfig: DatabaseConfig
    private readonly entityRepository: EntityRepository;

    constructor(entityRepository: EntityRepository, logger: ILogger) {
        this.logger = logger
        this.databaseConfig = databaseConfig,
            this.entityRepository = entityRepository
    }

    async getEntities(getManyDto: GetManyDto): Promise<any> {
        try {
            const data = await this.entityRepository.findMany(getManyDto)

            return data
        } catch (error) {
            this.logger.error("create entity error", null, {
                error
            })
            throw error
        }
    }

    async getEntity(entityAttributes: Partial<EntityAttributes>): Promise<EntityAttributes | null> {
        try {

            const entity = await this.entityRepository.findOne(entityAttributes);

            return entity;
        } catch (error) {
            throw error
        }
    }

    async createEntities(createEntitiesDto: CreateEntitiesDto): Promise<EntityAttributes> {
        let entity;
        try {

            entity = await this.getEntity(createEntitiesDto)

            if (entity) throw new BadRequestError("entity is already exist")

            entity = await this.entityRepository.create(createEntitiesDto)

            const dynamicModel = new DynamicModel(entity!)

            const { model } = await dynamicModel.mainModel()


            await migration([model])

            return entity!;
        } catch (error) {
            this.logger.error("create entity error", null, {
                error
            })
            throw error
        }
    }

    async dropEntity(id: number) {
        try {

            const entity = await this.getEntity({ id });

            if (!entity) throw new NotFoundError("entity not found")

            const queryInterface = databaseConfig.sequelize.getQueryInterface();

            await queryInterface.dropTable(entity.name);

            await this.entityRepository.delete({ id })

            return;
        } catch (error) {
            throw error
        }
    }

    async updatedEntity(updatedEntityDto: UpdatedEntityDto) {
        try {

            const entity = await this.getEntity({ id: updatedEntityDto.id });

            if (!entity) throw new NotFoundError("entity not found")

            const isEntity = await this.getEntity({ name: updatedEntityDto.newName });

            console.log("isEntity", updatedEntityDto)

            if (isEntity) throw new BadRequestError("entity is already exist")

            const queryInterface = databaseConfig.sequelize.getQueryInterface();

            await queryInterface.renameTable(entity.name, updatedEntityDto.newName)

            await this.entityRepository.update(updatedEntityDto.id, {
                name: updatedEntityDto.newName
            })

            return;

        } catch (error) {
            throw error
        }
    }
}
