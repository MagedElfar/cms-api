import { ILogger } from "../utility/logger";
import databaseConfig, { DatabaseConfig } from "../db";
import { BadRequestError, ForbiddenError } from "../utility/errors";
import { DataTypes } from "sequelize";
import { CreateAttributesDto, GetAttributeDto, RemoveAttributeDto } from "../dto/attributes.dto";
import { IEntitiesServices } from "./entities.services";

export enum COLUMN_TYPE {
    string = "STRING",
    integer = "INTEGER",
    float = "FLOAT",
    date = "DATE",
    boolean = "BOOLEAN"
}

export interface IAttr {
    name?: string,
    type: any;
    allowNull: boolean;
    defaultValue?: any;
    references?: {
        model: string;
        key: string;
        onDelete?: string;
    };

}

export interface IAttributesServices {
    createAttributes(createAttributesDto: CreateAttributesDto): Promise<void>
    getColumns(getAttributeDto: GetAttributeDto): Promise<IAttr[]>
    removeAttribute(removeAttributeDto: RemoveAttributeDto): Promise<void>
}

export default class AttributesServices implements IAttributesServices {

    private readonly logger: ILogger;
    private readonly entitiesServices: IEntitiesServices
    private readonly databaseConfig: DatabaseConfig

    constructor(
        entitiesServices: IEntitiesServices,
        logger: ILogger
    ) {
        this.entitiesServices = entitiesServices
        this.logger = logger
        this.databaseConfig = databaseConfig
    }

    async getColumns(getAttributeDto: GetAttributeDto) {
        try {

            const { entity: tableName } = getAttributeDto

            const queryInterface = databaseConfig.sequelize.getQueryInterface();

            //get column for the table
            const tableDefinition = await queryInterface.describeTable(tableName);

            //get ForeignKeyReferences For the Table
            const references = await queryInterface.getForeignKeyReferencesForTable(tableName) as [];

            const attributes: IAttr[] = Object.keys(tableDefinition).map(key => {
                const attr: IAttr = {
                    name: key,
                    allowNull: tableDefinition[key].allowNull,
                    type: tableDefinition[key].type,
                }

                const ref: any = references.find((item: any) => item?.columnName === key)

                if (ref) {
                    attr.references = {
                        model: ref?.referencedTableName,
                        key: ref?.referencedColumnName
                    }
                }

                return attr
            })

            return attributes
        } catch (error) {
            console.error('Error checking for column existence:', error);
            throw error;
        }
    }

    async createAttributes(createAttributesDto: CreateAttributesDto): Promise<void> {
        try {

            const { entity, attribute } = createAttributesDto


            //check if user has permission to alter table
            if (entity === "users" || entity === "refresh_token_list")
                throw new ForbiddenError(`you don't have a permission to edit on ${entity} entity`)


            //check if table exist in database
            const tables = await this.entitiesServices.getEntities()
            if (!tables.includes(entity))
                throw new BadRequestError(`Entities "${entity}" is not exist`)

            //get all table attributes
            const columns = await this.getColumns({ entity })

            const queryInterface = databaseConfig.sequelize.getQueryInterface();
            const sequelize = this.databaseConfig.sequelize

            await Promise.all(attribute.map(async (item) => {
                //check if column is exist in tabled
                if (columns.some(col => col.name === item.name)) {
                    this.logger.info("create attributes", null, {
                        message: `${item.name} is already exist`
                    })
                    return;
                }

                let attr: IAttr;

                if (item?.ref) {

                    //check if recreance  table is exist
                    const recreanceTable = item.ref;

                    if (!tables.includes(recreanceTable))
                        throw new BadRequestError(`reference table "${recreanceTable}" is not exist`)

                    attr = {
                        type: DataTypes.INTEGER.UNSIGNED,
                        allowNull: true,
                    }

                    await queryInterface.addColumn(
                        entity,
                        item.name,
                        attr
                    )

                    await queryInterface.addConstraint(
                        entity,
                        {

                            fields: [item.name],
                            type: 'foreign key',
                            name: `${entity}_${item.name}_fkey`,
                            onDelete: "SET NULL",
                            references: {
                                table: recreanceTable,
                                field: "id"
                            }
                        } as any
                    )

                    return;
                }

                if (item.type === COLUMN_TYPE.date) {
                    attr = {
                        type: DataTypes[item.type],
                        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
                        allowNull: !item.required,
                    }
                } else {
                    attr = {
                        type: DataTypes[item.type],
                        allowNull: !item.required,
                    }
                }


                await queryInterface.addColumn(
                    entity,
                    item.name,
                    attr
                )
            }))


            return;
        } catch (error) {
            this.logger.error("create entity error", null, {
                error
            })
            throw error
        }
    }

    async removeAttribute(removeAttributeDto: RemoveAttributeDto): Promise<void> {
        try {
            const { entity, attribute } = removeAttributeDto

            //check if table exist in database
            const tables = await this.entitiesServices.getEntities()
            if (!tables.includes(entity))
                throw new BadRequestError(`Entities "${entity}" is not exist`)

            //check if column exist
            const columns = await this.getColumns({ entity })

            if (!columns.some(item => item.name === attribute))
                throw new BadRequestError(`attribute "${attribute}" is not exist in this entity`);

            const queryInterface = databaseConfig.sequelize.getQueryInterface();

            await queryInterface.removeColumn(entity, attribute)


        } catch (error) {
            throw error
        }
    }
}
