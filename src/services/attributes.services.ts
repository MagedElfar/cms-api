import { EntityAttributes } from './../models/entity.model';
import { ILogger } from "../utility/logger";
import databaseConfig, { DatabaseConfig } from "../db";
import { NotFoundError } from "../utility/errors";
import { CreateAttributesDto, UpdateAttributesDto } from "../dto/attributes.dto";
import { IEntitiesServices } from "./entities.services";
import AttributeRepository from "../repositories/attribute.repository";
import { AttrAttributes } from "../models/attribute.model";
import { DataTypes, Transaction } from 'sequelize';
import { GetManyDto } from '../repositories/genericRepository';

export interface IAttributesServices {
    createAttributes(createAttributesDto: CreateAttributesDto): Promise<AttrAttributes>
    getAttribute(attrAttributes: Partial<AttrAttributes>): Promise<AttrAttributes | null>
    updateAttribute(updateAttributesDto: UpdateAttributesDto): Promise<AttrAttributes | null>
    deleteAttribute(id: number): Promise<number>
    getAttributes(getManyDto: GetManyDto): Promise<any>;
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

    async getAttributes(getManyDto: GetManyDto): Promise<any> {
        try {
            return this.attributeRepository.findMany(getManyDto)
        } catch (error) {
            throw error
        }
    }

    async getAttribute(attrAttributes: Partial<AttrAttributes>): Promise<AttrAttributes | null> {
        try {
            const attribute = await this.attributeRepository.findOne(attrAttributes)

            return attribute
        } catch (error) {
            throw error
        }
    }


    async updateAttribute(updateAttributesDto: UpdateAttributesDto): Promise<AttrAttributes | null> {
        const queryInterface = this.databaseConfig.sequelize.getQueryInterface();
        const savepoint: Transaction[] = [];

        try {
            const { id, ...others } = updateAttributesDto;
            let attribute = await this.attributeRepository.findOne({ id });

            if (!attribute) throw new NotFoundError("attribute not found");


            if (attribute?.entities) {
                await Promise.all(attribute.entities.map(async (entity, index) => {
                    // Continue with other operations
                    const transaction: Transaction = await queryInterface.sequelize.transaction();

                    savepoint.push(transaction);

                    await queryInterface.changeColumn(
                        entity.name,
                        attribute?.name!,
                        {
                            type: DataTypes[others.type || attribute!.type],
                            allowNull: others.required || !attribute!.required,
                        },
                        { transaction }
                    );
                }));

                if (others.name && attribute?.name !== others?.name) {
                    await Promise.all(attribute.entities.map(async (entity, index) => {
                        if (others.name && attribute?.name !== others?.name) {
                            // Create a savepoint

                            await queryInterface.renameColumn(
                                entity.name,
                                others.name,
                                others.name);
                        }
                    }));

                }

            }

            const updatedAttribute = await this.attributeRepository.update(id, others);

            return updatedAttribute;
        } catch (error) {
            // Rollback savepoints in case of an error
            // await Promise.all(savepoint.map(async (t) => await t.rollback()));
            throw error;
        }
    }


    async deleteAttribute(id: number): Promise<number> {
        const queryInterface = this.databaseConfig.sequelize.getQueryInterface();
        const savepoint: Transaction[] = [];

        try {
            let attribute = await this.attributeRepository.findOne({ id });

            if (!attribute) throw new NotFoundError("attribute not found");


            if (attribute?.entities) {
                await Promise.all(attribute.entities.map(async (entity, index) => {
                    // Continue with other operations
                    const transaction: Transaction = await queryInterface.sequelize.transaction();

                    savepoint.push(transaction);

                    await queryInterface.removeColumn(entity.name, attribute?.name!)
                }))
            }


            const attr = await this.attributeRepository.delete({ id });

            await Promise.all(savepoint.map(async (t) => await t.commit()));

            return attr;

        } catch (error) {
            // Rollback savepoints in case of an error
            await Promise.all(savepoint.map(async (t) => await t.rollback()));
            throw error;
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

}

