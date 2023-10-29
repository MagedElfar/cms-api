import { DataTypes, Sequelize } from 'sequelize';
import databaseConfig, { DatabaseConfig } from "../db";
import { ILogger, Logger } from "../utility/logger";
import { EntityAttributes } from "./entity.model";
import EntityRepository from "../repositories/entity.repository";

export default class DynamicModel {
    private entity: EntityAttributes;
    private readonly databaseConfig: DatabaseConfig
    private readonly logger: ILogger;
    private readonly entityRepository: EntityRepository

    constructor(
        entity: EntityAttributes,
        logger: ILogger,
        entityRepository: EntityRepository
    ) {
        this.entity = entity
        this.databaseConfig = databaseConfig
        this.logger = logger
        this.entityRepository = entityRepository
    }


    setModel(entity: EntityAttributes) {

        const include: any[] = []

        const dynamicModelAttributes: any = {};

        dynamicModelAttributes["id"] = {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        };

        if (entity.attributes) {
            entity.attributes.forEach((attribute) => {

                if (attribute.name === "id") return;

                dynamicModelAttributes[attribute.name!] = {
                    type: DataTypes[attribute.type],
                    allowNull: !attribute.required
                };



                // If references exist, add a reference to another model
                if (attribute.ref) {
                    dynamicModelAttributes[attribute.name!].type = DataTypes.INTEGER.UNSIGNED
                    dynamicModelAttributes[attribute.name!].references = {
                        model: attribute.ref.name,
                        key: "id",
                    };
                }
            });
        }


        const model = this.databaseConfig.sequelize.define(entity.name, dynamicModelAttributes, {
            timestamps: true,
            tableName: entity.name,
            createdAt: "createdAt", // Customize the name of the createdAt field
            updatedAt: "updatedAt", // Customize the name of the updatedAt field
        })

        return model;
    }

    async mainModel() {

        const model = this.setModel(this.entity);
        const include: any[] = []

        //foreignKey
        if (this.entity.attributes) {
            //foreignKey
            await Promise.all(this.entity.attributes.map(async (attribute) => {
                if (attribute.refId) {

                    const refEntity = await this.entityRepository.findOne({ id: attribute.refId })


                    if (!refEntity) return;

                    const ReferencedModel = this.setModel(refEntity)

                    // Assuming you have a dynamic model for the referenced model
                    // Define the association
                    model.belongsTo(ReferencedModel, {
                        foreignKey: attribute.name, // Assuming the column name matches the model name
                        as: refEntity.name, // Use the referenced model name as the alias
                        targetKey: "id",
                        onDelete: attribute.onDelete,
                        onUpdate: attribute.onUpdate
                    });

                    include.push({
                        model: ReferencedModel,
                        as: refEntity.name
                    })
                }
            }))
        }


        return { model, include }
    }
}

