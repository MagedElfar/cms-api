// import { Model, DataTypes, Optional } from "sequelize";
// import DatabaseConfig from "../db";




// class DynamicTableModel extends Model {
//     public id!: number;
//     token: string;
//     userId: number;
//     public readonly createdAt!: Date;
//     public readonly updatedAt!: Date;
// }

// RefreshToken.init(
//     {
//         id: {
//             type: DataTypes.INTEGER.UNSIGNED,
//             autoIncrement: true,
//             primaryKey: true,
//         },
//         token: {
//             type: DataTypes.TEXT,
//             allowNull: false,
//         },
//         userId: {
//             type: DataTypes.INTEGER.UNSIGNED,
//             allowNull: false,
//         },

//     },
//     {
//         sequelize: DatabaseConfig.sequelize,
//         tableName: "refresh_token_list",
//         timestamps: true, // Enable timestamps for createdAt and updatedAt
//         createdAt: "createdAt", // Customize the name of the createdAt field
//         updatedAt: "updatedAt", // Customize the name of the updatedAt field
//     }
// );




// export default RefreshToken; 