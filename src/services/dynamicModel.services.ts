import { ILogger } from "../utility/logger";
import { AddColumnDto, CreateModelDto } from "../dto/dynamicModel.dto";
import databaseConfig, { DatabaseConfig } from "../db";
import { BadRequestError } from "../utility/errors";
import { DataTypes, ModelAttributes } from "sequelize";
import { Literal } from "sequelize/types/utils";

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

export interface IDynamicModelServices {
    createModel(createModelDto: CreateModelDto): Promise<void>;
    addColumn(addColumnDto: AddColumnDto): Promise<void>
    deleteColumn(addColumnDto: AddColumnDto): Promise<void>

}

export default class DynamicModelServices implements IDynamicModelServices {

    private readonly logger: ILogger;
    private readonly databaseConfig: DatabaseConfig

    constructor(logger: ILogger) {
        this.logger = logger
        this.databaseConfig = databaseConfig
    }

    private async isTable(tableName: string): Promise<boolean> {
        try {
            const queryInterface = databaseConfig.sequelize.getQueryInterface();

            const table = await queryInterface.showAllTables().then(
                tables => tables.includes(tableName)
            );

            if (!table) return false

            return true;
        } catch (error) {
            this.logger.error("create entity error", null, {
                error
            })
            throw error
        }
    }


    private async isColumn(tableName: string, columnName: string) {
        try {

            const queryInterface = databaseConfig.sequelize.getQueryInterface();

            const tableDefinition = await queryInterface.describeTable(tableName);


            if (tableDefinition[columnName]) return true;


            return false
        } catch (error) {
            console.error('Error checking for column existence:', error);
            throw error;
        }
    }

    async createModel(createModelDto: CreateModelDto): Promise<void> {
        try {


            const queryInterface = databaseConfig.sequelize.getQueryInterface();
            const sequelize = this.databaseConfig.sequelize

            const table = await this.isTable(createModelDto.name)

            if (table) throw new BadRequestError(`table ${createModelDto.name} is already exist`)

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
                // Define other columns here
            };



            await queryInterface.createTable(
                createModelDto.name,
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

    async addColumn(addColumnDto: AddColumnDto): Promise<void> {
        try {

            const table = await this.isTable(addColumnDto.table)

            if (!table)
                throw new BadRequestError(`table "${addColumnDto.table}" is not exist`)


            const queryInterface = databaseConfig.sequelize.getQueryInterface();
            const sequelize = this.databaseConfig.sequelize

            const column = await this.isColumn(addColumnDto.table, addColumnDto.name)

            if (column)
                throw new BadRequestError(`column "${addColumnDto.name}" is already exist in table ${addColumnDto.table}`)

            let attr: IAttr = {
                type: DataTypes[addColumnDto.type],
                allowNull: addColumnDto.required,
            };
            ;

            if (addColumnDto.type === COLUMN_TYPE.date) {
                attr = {
                    type: DataTypes[addColumnDto.type],
                    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
                    allowNull: !addColumnDto.required,
                }
            } else {
                attr = {
                    type: DataTypes[addColumnDto.type],
                    allowNull: !addColumnDto.required,
                }
            }

            if (addColumnDto?.ref) {

                const table = await this.isTable(addColumnDto.ref)

                if (!table)
                    throw new BadRequestError(`reference table "${addColumnDto.ref}" is not exist`)

                const column = await this.isColumn(addColumnDto.ref, "id")

                if (!column)
                    throw new BadRequestError(`column "ID" is R already exist in references table ${addColumnDto.ref}`)


                attr = {
                    allowNull: false,
                    type: DataTypes.INTEGER.UNSIGNED,
                    references: {
                        model: addColumnDto.ref, // Name of the related table
                        key: 'id', // Name of the related column
                        onDelete: 'CASCADE'
                    },
                }


            }


            await queryInterface.addColumn(
                addColumnDto.table,
                addColumnDto.name,
                attr
            )


            return;
        } catch (error) {
            this.logger.error("create entity error", null, {
                error
            })
            throw error
        }
    }

    async deleteColumn(addColumnDto: AddColumnDto): Promise<void> {
        try {

            const table = await this.isTable(addColumnDto.table)

            if (!table)
                throw new BadRequestError(`table "${addColumnDto.table}" is not exist`)


            const queryInterface = databaseConfig.sequelize.getQueryInterface();
            const sequelize = this.databaseConfig.sequelize

            const column = await this.isColumn(addColumnDto.table, addColumnDto.name)

            if (column)
                throw new BadRequestError(`column "${addColumnDto.name}" is already exist in table ${addColumnDto.table}`)

            let attr: IAttr = {
                type: DataTypes[addColumnDto.type],
                allowNull: addColumnDto.required,
            };
            ;

            if (addColumnDto.type === COLUMN_TYPE.date) {
                attr = {
                    type: DataTypes[addColumnDto.type],
                    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
                    allowNull: !addColumnDto.required,
                }
            } else {
                attr = {
                    type: DataTypes[addColumnDto.type],
                    allowNull: !addColumnDto.required,
                }
            }

            if (addColumnDto?.ref) {

                const table = await this.isTable(addColumnDto.ref)

                if (!table)
                    throw new BadRequestError(`reference table "${addColumnDto.ref}" is not exist`)

                const column = await this.isColumn(addColumnDto.ref, "id")

                if (!column)
                    throw new BadRequestError(`column "ID" is R already exist in references table ${addColumnDto.ref}`)


                attr = {
                    allowNull: false,
                    type: DataTypes.INTEGER.UNSIGNED,
                    references: {
                        model: addColumnDto.ref, // Name of the related table
                        key: 'id', // Name of the related column
                        onDelete: 'CASCADE'
                    },
                }


            }


            await queryInterface.addColumn(
                addColumnDto.table,
                addColumnDto.name,
                attr
            )


            return;
        } catch (error) {
            this.logger.error("create entity error", null, {
                error
            })
            throw error
        }
    }
}
