import { IModel } from "../middlewares/mappedModel.middleware";
import { DataTypes, Sequelize } from 'sequelize';
import databaseConfig, { DatabaseConfig } from "../db";
import AttributesServices, { IAttributesServices } from "../services/attributes.services";
import EntitiesServices from "../services/entities.services";
import { Logger } from "../utility/logger";
import { EntityAttributes } from "./entity.model";

export default class DynamicModel {
    private entity: EntityAttributes;
    private readonly databaseConfig: DatabaseConfig

    constructor(entity: EntityAttributes) {
        this.entity = entity
        this.databaseConfig = databaseConfig

    }


    async mainModel() {

        const entity = this.entity;

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

        return { model }
    }

    // async referenceModel() {
    //     const model = this.mainModel();
    //     const include: any[] = []

    //     const logger = new Logger()

    //     const attributesServices: IAttributesServices = new AttributesServices(
    //         new EntitiesServices(logger),
    //         logger
    //     )

    //     // Create a DynamicModel for your primary model (e.g., DynamicModel)
    //     // Loop through your data to find and define associations
    //     await Promise.all(this.model.attributes.map(async (column) => {
    //         if (column.references) {

    //             const attributes = await attributesServices.getColumns({ entity: column.references.model })

    //             const ReferencedModel = this.mainModel({
    //                 entity: column.references.model,
    //                 attributes
    //             })

    //             // Assuming you have a dynamic model for the referenced model
    //             // Define the association
    //             model.belongsTo(ReferencedModel, {
    //                 foreignKey: column.name, // Assuming the column name matches the model name
    //                 as: column.references.model, // Use the referenced model name as the alias
    //                 targetKey: column.references.key,
    //             });

    //             include.push({
    //                 model: ReferencedModel,
    //                 as: column.references.model
    //             })
    //         }
    //     }))

    //     // Now, you can use the DynamicModel with dynamic associations


    //     return {
    //         model,
    //         include
    //     }
    // }
}

