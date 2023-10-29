import { Model, DataTypes, Optional } from "sequelize";
import DatabaseConfig from "./../db";
import User from "./user.model";
import { EntityAttributes } from "./entity.model";
import Entity from "./entity.model";


export enum COLUMN_TYPE {
    string = "STRING",
    integer = "INTEGER",
    float = "FLOAT",
    date = "DATE",
    boolean = "BOOLEAN"
}

export enum FK_CONSTRAINTS {
    cascade = "CASCADE",
    setNull = "SET NULL"
}

export interface AttrAttributes {
    id: number;
    name: string,
    required: boolean,
    type: COLUMN_TYPE,
    refId?: number,
    ref?: EntityAttributes,
    onDelete?: FK_CONSTRAINTS,
    onUpdate?: FK_CONSTRAINTS,
    createdAt?: Date;
    updatedAt?: Date;
}

interface AttributeCreationAttributes extends Optional<AttrAttributes, "id"> { }

class Attribute extends Model<AttrAttributes, AttributeCreationAttributes> implements AttrAttributes {
    public id!: number;
    name: string
    required: boolean
    type: COLUMN_TYPE
    refId?: number
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Attribute.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM(...Object.values(COLUMN_TYPE)),
            allowNull: false
        },
        required: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        refId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },

    },
    {
        sequelize: DatabaseConfig.sequelize,
        tableName: "attributes",
        timestamps: true, // Enable timestamps for createdAt and updatedAt
        createdAt: "createdAt", // Customize the name of the createdAt field
        updatedAt: "updatedAt", // Customize the name of the updatedAt field
    }
);

Attribute.belongsTo(Entity, { as: "ref", foreignKey: "refId", onDelete: "SET NULL" })
Entity.hasMany(Attribute, { as: "ref", foreignKey: "refId" })


export default Attribute; 