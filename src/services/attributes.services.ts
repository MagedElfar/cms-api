import { ILogger } from "../utility/logger";
import databaseConfig, { DatabaseConfig } from "../db";
import { BadRequestError, ForbiddenError, NotFoundError } from "../utility/errors";
import { CreateAttributesDto, GetAttributeDto, RemoveAttributeDto, RenameAttributeDto } from "../dto/attributes.dto";
import { IEntitiesServices } from "./entities.services";
import AttributeRepository from "../repositories/attribute.repository";
import { AttrAttributes } from "../models/attribute.model";

export interface IAttributesServices {
    createAttributes(createAttributesDto: CreateAttributesDto): Promise<AttrAttributes>
    getAttribute(attrAttributes: Partial<AttrAttributes>): Promise<AttrAttributes | null>
    // getColumns(getAttributeDto: GetAttributeDto): Promise<IAttr[]>
    // removeAttribute(removeAttributeDto: RemoveAttributeDto): Promise<void>
    // renameAttribute(renameAttributeDto: RenameAttributeDto): Promise<void>
}

export default class AttributesServices implements IAttributesServices {

    private readonly logger: ILogger;
    private readonly entitiesServices: IEntitiesServices
    private readonly attributeRepository: AttributeRepository
    private readonly databaseConfig: DatabaseConfig

    constructor(
        attributeRepository: AttributeRepository,
        entitiesServices: IEntitiesServices,
        logger: ILogger
    ) {
        this.attributeRepository = attributeRepository
        this.entitiesServices = entitiesServices
        this.logger = logger
        this.databaseConfig = databaseConfig
    }

    // async getColumns(getAttributeDto: GetAttributeDto) {
    //     try {

    //         const { entity: tableName } = getAttributeDto

    //         const queryInterface = databaseConfig.sequelize.getQueryInterface();

    //         //get column for the table
    //         const tableDefinition = await queryInterface.describeTable(tableName);

    //         //get ForeignKeyReferences For the Table
    //         const references = await queryInterface.getForeignKeyReferencesForTable(tableName) as [];

    //         const attributes: IAttr[] = Object.keys(tableDefinition).map(key => {
    //             const attr: IAttr = {
    //                 name: key,
    //                 allowNull: tableDefinition[key].allowNull,
    //                 type: tableDefinition[key].type,
    //             }

    //             const ref: any = references.find((item: any) => item?.columnName === key)

    //             if (ref) {
    //                 attr.references = {
    //                     model: ref?.referencedTableName,
    //                     key: ref?.referencedColumnName
    //                 }
    //             }

    //             return attr
    //         })

    //         return attributes
    //     } catch (error) {
    //         console.error('Error checking for column existence:', error);
    //         throw error;
    //     }
    // }

    async getAttribute(attrAttributes: Partial<AttrAttributes>): Promise<AttrAttributes | null> {
        try {
            const attribute = await this.attributeRepository.findOne(attrAttributes)

            return attribute
        } catch (error) {
            throw error
        }
    }

    async createAttributes(createAttributesDto: CreateAttributesDto): Promise<AttrAttributes> {
        try {

            if (createAttributesDto.refId) {
                const entity = await this.entitiesServices.getEntity({ id: createAttributesDto.refId })

                if (!entity) throw new NotFoundError("reference entity not found")
            }

            const attribute = await this.attributeRepository.create(createAttributesDto)

            return attribute;
        } catch (error) {
            this.logger.error("create entity error", null, {
                error
            })
            throw error
        }
    }

    // async removeAttribute(removeAttributeDto: RemoveAttributeDto): Promise<void> {
    //     try {
    //         const { entity, attribute } = removeAttributeDto

    //         //check if table exist in database
    //         const tables = await this.entitiesServices.getEntities()
    //         if (!tables.includes(entity))
    //             throw new BadRequestError(`Entities "${entity}" is not exist`)

    //         //check if column exist
    //         const columns = await this.getColumns({ entity })

    //         if (!columns.some(item => item.name === attribute))
    //             throw new BadRequestError(`attribute "${attribute}" is not exist in this entity`);

    //         const queryInterface = databaseConfig.sequelize.getQueryInterface();

    //         await queryInterface.removeColumn(entity, attribute)


    //     } catch (error) {
    //         throw error
    //     }
    // }

    // async renameAttribute(renameAttributeDto: RenameAttributeDto): Promise<void> {
    //     try {
    //         const { entity, attribute, newName } = renameAttributeDto

    //         //check if table exist in database
    //         const tables = await this.entitiesServices.getEntities()
    //         if (!tables.includes(entity))
    //             throw new BadRequestError(`Entities "${entity}" is not exist`)

    //         const columns = await this.getColumns({ entity })

    //         //check if column exist
    //         if (!columns.some(item => item.name === attribute))
    //             throw new BadRequestError(`attribute "${attribute}" is not exist in this entity`);

    //         //check if there any other column has same name
    //         if (columns.some(item => item.name === newName))
    //             throw new BadRequestError(`attribute "${newName}" is already exist in this entity`);

    //         const queryInterface = databaseConfig.sequelize.getQueryInterface();

    //         await queryInterface.renameColumn(entity, attribute, newName)


    //     } catch (error) {
    //         throw error
    //     }
    // }
}

