import { migration } from "../db/migration";
import { CreateEntityInstanceDto } from "../dto/entityInstance.dto";
import DynamicModel from "../models/dynamicModel.model";
import { EntityInstanceAttributes } from "../models/entityInstance.model";
import EntityRepository from "../repositories/entity.repository";
import EntityInstanceRepository from "../repositories/entityInstance.repository";
import { BadRequestError, NotFoundError } from "../utility/errors";
import { Logger } from "../utility/logger";
import { IAttributesServices } from "./attributes.services";
import { IEntitiesServices } from "./entities.services";

export interface IEntityInstanceServices {
    create(createEntityInstanceDto: CreateEntityInstanceDto): Promise<EntityInstanceAttributes>;
    findOne(data: Partial<EntityInstanceAttributes>): Promise<EntityInstanceAttributes | null>;
}


export default class EntityInstanceServices implements IEntityInstanceServices {

    private readonly attributesServices: IAttributesServices;
    private readonly entitiesServices: IEntitiesServices;
    private readonly entityInstanceRepository: EntityInstanceRepository


    constructor(
        attributesServices: IAttributesServices,
        entitiesServices: IEntitiesServices,
        entityInstanceRepository: EntityInstanceRepository
    ) {
        this.attributesServices = attributesServices;
        this.entitiesServices = entitiesServices;
        this.entityInstanceRepository = entityInstanceRepository
    }

    async create(createEntityInstanceDto: CreateEntityInstanceDto): Promise<EntityInstanceAttributes> {
        try {

            const attribute = await this.attributesServices.getAttribute({
                id: createEntityInstanceDto.attributeId
            });

            if (!attribute) throw new NotFoundError("Attribute is not found")

            let entity = await this.entitiesServices.getEntity({
                id: createEntityInstanceDto.entityId
            });

            if (!entity) throw new NotFoundError("Entity is not found")

            let entityValue;

            entityValue = await this.findOne(createEntityInstanceDto)

            if (entityValue) throw new BadRequestError("attribute is already has this assign to entity")

            if (entity?.attributes) entity?.attributes?.push(attribute)

            const dynamicModel = new DynamicModel(
                entity!,
                new Logger(),
                new EntityRepository()
            );

            const { model } = await dynamicModel.mainModel();

            await migration([model])

            entityValue = await this.entityInstanceRepository.create(createEntityInstanceDto)

            return entityValue
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<EntityInstanceAttributes>): Promise<EntityInstanceAttributes | null> {
        try {
            const entityValue = await this.entityInstanceRepository.findOne(data)

            if (!entityValue) return null;

            return entityValue
        } catch (error) {
            throw error
        }
    }


    // async findMany(): Promise<{ count: number, data: RolePermissionAttributes }> {
    //     try {
    //         const rolePermission = await this.rolePermissionRepository.findMany();

    //         const data = rolePermission.data.reduce((obj: any, item: RolePermissionAttributes) => {
    //             if (!obj[item.role?.name!]) {
    //                 obj[item.role?.name!] = [item]
    //             } else {
    //                 obj[item.role?.name!] = [...obj[item.role?.name!], item]
    //             }

    //             return obj
    //         }, {})

    //         return { data, count: rolePermission.count };
    //     } catch (error) {
    //         throw error
    //     }
    // }

    // async remove(id: number): Promise<number> {
    //     try {
    //         const isDeleted = await this.rolePermissionRepository.delete(id);

    //         return isDeleted
    //     } catch (error) {
    //         throw error
    //     }
    // }
}