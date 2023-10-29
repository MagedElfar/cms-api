import { Model, DataTypes, Optional } from "sequelize";
import DatabaseConfig from "../db";
import Entity, { EntityAttributes } from "./entity.model";
import Attribute, { AttrAttributes } from "./attribute.model";

export interface EntityInstanceAttributes {
    id: number;
    entityId: number;
    attributeId: number;
    entity?: EntityAttributes;
    attribute?: AttrAttributes;
}

interface EntityInstanceCreationAttributes extends Optional<EntityInstanceAttributes, "id"> { }

class EntityInstance extends Model<EntityInstanceAttributes, EntityInstanceCreationAttributes> implements EntityInstanceAttributes {
    public id!: number;
    public entityId!: number;
    public attributeId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

EntityInstance.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        attributeId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        entityId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        sequelize: DatabaseConfig.sequelize,
        tableName: "entities_attributes",
        timestamps: true, // Enable timestamps for createdAt and updatedAt
        createdAt: "createdAt", // Customize the name of the createdAt field
        updatedAt: "updatedAt", // Customize the name of the updatedAt field
    }
);

EntityInstance.belongsTo(Attribute, { as: "attribute", foreignKey: "attributeId", onDelete: "CASCADE" });
EntityInstance.belongsTo(Entity, { as: "entity", foreignKey: "entityId", onDelete: "CASCADE" });

Entity.belongsToMany(Attribute, {
    through: EntityInstance,
    as: "attributes",
    foreignKey: "entityId", // Specify the correct column name for the foreign key
    otherKey: "attributeId", // Specify the correct column name for the other key
});

Attribute.belongsToMany(Entity, {
    through: EntityInstance,
    as: "entities",
    foreignKey: "attributeId", // Specify the correct column name for the foreign key
    otherKey: "entityId", // Specify the correct column name for the other key
});

export default EntityInstance;
