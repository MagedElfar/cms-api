import DataBase from "./index"
import { QueryInterface } from "sequelize";
import DatabaseConfig from "./../db"
import { InternalServerError } from "../utility/errors";
import { Logger } from "../utility/logger";


// Get the existing indexes for the model from the database
async function getExistingIndexes(queryInterface: QueryInterface, tableName: string): Promise<any> {
    const indexes = await queryInterface.showIndex(tableName)

    // console.log(tableName, " = ", indexes)

    return indexes

}

// Remove non-primary indexes from the database
async function removeIndexes(queryInterface: QueryInterface, tableName: string) {

    const tableExists = await queryInterface.showAllTables().then(tables => tables.includes(tableName));

    if (!tableExists) {
        console.log(`Table ${tableName} does not exist.`);
        return;
    }


    const indexes = await getExistingIndexes(queryInterface, tableName);

    await Promise.all(indexes.map(
        async (index: any) => {
            if (!index.primary && index.unique) {
                await queryInterface.removeIndex(tableName, index.name)
            }
        }
    ))
}


// async function migration(models: ModelStatic<any>[]) {
//     try {
//         // Call the sync method on each model's prototype

//         await DataBase.testConnection()
//         const queryInterface = DatabaseConfig.sequelize.getQueryInterface();

//         await Promise.all(models.map(async (model) => {
//             const table = model.tableName;
//             try {

//                 await removeIndexes(queryInterface, table)
//                 await model.sync({ alter: true });
//                 console.log(`${table} table created successfully!`)
//             } catch (error: any) {
//                 console.error(`Error creating table : ${table} with error : ${error}`);
//                 throw new InternalServerError(error)
//             }

//         }))

//         console.log("All table created successfully!")

//     } catch (error: any) {
//         console.error(error);
//         throw new InternalServerError(error)

//     }
// }


export async function checkModelModelMigration(model: any) {
    try {
        // Check the User model's migration without actually applying it
        await model.sync({ force: false });
    } catch (error: any) {
        const logger = new Logger()

        logger.error(`migration error with ${model} model`, null, {
            error: error.message
        })
    } finally {
        const sequelize = DatabaseConfig.sequelize;
        await sequelize.close();
    }
}

export async function migration(models: any[]) {
    try {
        await DataBase.testConnection();
        const queryInterface = DatabaseConfig.sequelize.getQueryInterface();

        for (const model of models) {
            const table = model.tableName;
            try {
                await removeIndexes(queryInterface, table);
                await model.sync({ alter: true });
                console.log(`${table} table created successfully!`);
            } catch (error: any) {
                console.log(error)
                console.error(`Error creating table : ${table} with error : ${error}`);
                throw new InternalServerError(error);
            }
        }

        console.log("All tables created successfully!");

    } catch (error: any) {
        console.error(error);
        throw new InternalServerError(error);
    }
}