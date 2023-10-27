import { ILogger } from "../utility/logger";
import { CreateEntitiesDto } from "../dto/entities.dto";
import databaseConfig, { DatabaseConfig } from "../db";
import { BadRequestError } from "../utility/errors";
import { DataTypes, ModelAttributes } from "sequelize";

export enum COLUMN_TYPE {
    string = "STRING",
    integer = "INTEGER",
    float = "FLOAT",
    date = "DATE",
    boolean = "BOOLEAN"
}

interface IAttr {

    type: any;
    allowNull: boolean;
    defaultValue?: any;
    references?: {
        model: string;
        key: string;
        onDelete: string;
    };

}

export interface IEntitiesServices {
    createEntities(createEntitiesDto: CreateEntitiesDto): Promise<void>;
    getEntities(): Promise<string[]>;
    // addColumn(addColumnDto: AddColumnDto): Promise<void>

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


    // private async isColumn(tableName: string, columnName: string) {
    //     try {

    //         const queryInterface = databaseConfig.sequelize.getQueryInterface();

    //         const tableDefinition = await queryInterface.describeTable(tableName);


    //         if (tableDefinition[columnName]) return true;


    //         return false
    //     } catch (error) {
    //         console.error('Error checking for column existence:', error);
    //         throw error;
    //     }
    // }

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
                    type: DataTypes.INTEGER,
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

    // async addColumn(addColumnDto: AddColumnDto): Promise<void> {
    //     try {

    //         const table = await this.isTable(addColumnDto.table)

    //         if (!table)
    //             throw new BadRequestError(`table "${addColumnDto.table}" is not exist`)


    //         const queryInterface = databaseConfig.sequelize.getQueryInterface();
    //         const sequelize = this.databaseConfig.sequelize

    //         const column = await this.isColumn(addColumnDto.table, addColumnDto.name)

    //         if (column)
    //             throw new BadRequestError(`column "${addColumnDto.name}" is already exist in table ${addColumnDto.table}`)

    //         let attr: IAttr = {
    //             type: DataTypes[addColumnDto.type],
    //             allowNull: addColumnDto.required,
    //         };
    //         ;

    //         if (addColumnDto.type === COLUMN_TYPE.date) {
    //             attr = {
    //                 type: DataTypes[addColumnDto.type],
    //                 defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    //                 allowNull: !addColumnDto.required,
    //             }
    //         } else {
    //             attr = {
    //                 type: DataTypes[addColumnDto.type],
    //                 allowNull: !addColumnDto.required,
    //             }
    //         }

    //         if (addColumnDto?.ref) {

    //             const table = await this.isTable(addColumnDto.ref)

    //             if (!table)
    //                 throw new BadRequestError(`reference table "${addColumnDto.ref}" is not exist`)

    //             const column = await this.isColumn(addColumnDto.ref, "id")

    //             if (!column)
    //                 throw new BadRequestError(`column "ID" is R already exist in references table ${addColumnDto.ref}`)


    //             attr = {
    //                 allowNull: false,
    //                 type: DataTypes.INTEGER.UNSIGNED,
    //                 references: {
    //                     model: addColumnDto.ref, // Name of the related table
    //                     key: 'id', // Name of the related column
    //                     onDelete: 'CASCADE'
    //                 },
    //             }


    //         }


    //         await queryInterface.addColumn(
    //             addColumnDto.table,
    //             addColumnDto.name,
    //             attr
    //         )


    //         return;
    //     } catch (error) {
    //         this.logger.error("create entity error", null, {
    //             error
    //         })
    //         throw error
    //     }
    // }
}
