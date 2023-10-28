import { ILogger } from "../utility/logger";
import { CreateEntitiesDto, UpdatedEntityDto } from "../dto/entities.dto";
import databaseConfig, { DatabaseConfig } from "../db";
import { BadRequestError, NotFoundError } from "../utility/errors";
import { DataTypes, ModelAttributes } from "sequelize";


export interface IEntitiesServices {
    createEntities(createEntitiesDto: CreateEntitiesDto): Promise<void>;
    getEntities(): Promise<string[]>;
    dropEntity(entityName: string): Promise<void>
    updatedEntity(updatedEntityDto: UpdatedEntityDto): Promise<void>
}

export default class EntitiesServices implements IEntitiesServices {

    private readonly logger: ILogger;
    private readonly databaseConfig: DatabaseConfig

    constructor(logger: ILogger) {
        this.logger = logger
        this.databaseConfig = databaseConfig
    }

    async getEntities(): Promise<string[]> {
        try {
            const queryInterface = databaseConfig.sequelize.getQueryInterface();

            const tables = await queryInterface.showAllTables()

            return tables;
        } catch (error) {
            this.logger.error("create entity error", null, {
                error
            })
            throw error
        }
    }

    async createEntities(createEntitiesDto: CreateEntitiesDto): Promise<void> {
        try {

            const tableName = createEntitiesDto.name.toLowerCase()

            //check if Entities is already exist
            const tables = await this.getEntities()

            if (tables.includes(tableName))
                throw new BadRequestError(`table ${tableName} is already exist`)

            const queryInterface = databaseConfig.sequelize.getQueryInterface();
            const sequelize = this.databaseConfig.sequelize

            //define main attributes like (id , createdAt , updatedAt) for create new entities
            const columns = {
                id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
                    allowNull: false,
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
                    allowNull: false,
                },
            };

            //create new entities
            await queryInterface.createTable(
                tableName,
                columns
            )

            return;
        } catch (error) {
            this.logger.error("create entity error", null, {
                error
            })
            throw error
        }
    }

    async dropEntity(entityName: string) {
        try {
            const tableName = entityName

            //check if Entities is already exist
            const tables = await this.getEntities()

            if (!tables.includes(tableName))
                throw new NotFoundError(`table ${tableName} is not exist`)

            const queryInterface = databaseConfig.sequelize.getQueryInterface();

            await queryInterface.dropTable(tableName)

            return;
        } catch (error) {
            throw error
        }
    }

    async updatedEntity(updatedEntityDto: UpdatedEntityDto) {
        try {
            const tables = await this.getEntities()

            //check if Entities is already exist
            if (!tables.includes(updatedEntityDto.entity))
                throw new NotFoundError(`table ${updatedEntityDto.entity} is not exist`)

            //check  if there an Entities has same name 
            if (tables.includes(updatedEntityDto.newName))
                throw new NotFoundError(`table ${updatedEntityDto.newName} is already exist`)

            const queryInterface = databaseConfig.sequelize.getQueryInterface();

            await queryInterface.renameTable(updatedEntityDto.entity, updatedEntityDto.newName)

            return;

        } catch (error) {
            throw error
        }
    }
}
