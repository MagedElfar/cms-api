// src/models/User.ts
import { Model, DataTypes, Optional } from "sequelize";
import DatabaseConfig from "./../db";
import { AttrAttributes } from "./attribute.model";

export interface EntityAttributes {
    id: number;
    name: string,
    createdAt?: Date;
    updatedAt?: Date;
    attributes?: AttrAttributes[]
}

interface EntityCreationAttributes extends Optional<EntityAttributes, "id"> { }

class Entity extends Model<EntityAttributes, EntityCreationAttributes> implements EntityAttributes {
    public id!: number;
    public name!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Entity.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize: DatabaseConfig.sequelize,
        tableName: "entities",
        timestamps: true, // Enable timestamps for createdAt and updatedAt
        createdAt: "createdAt", // Customize the name of the createdAt field
        updatedAt: "updatedAt", // Customize the name of the updatedAt field
    }
);


export default Entity;
