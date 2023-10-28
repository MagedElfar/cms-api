import { Request, Response, NextFunction } from "express";
import Joi from "joi";


function createRecordSchema(req: Request) {
    const data = req.model.attributes

    let dynamicSchema = Joi.object({});

    data.forEach((item) => {
        if (item.name === "id" || item.name === "updatedAt" || item.name === "createdAt") return;

        const key = item.name!;
        const isRequired = !item.allowNull; // allowNull: false means required
        let type;

        // Determine the Joi type based on the "type" property
        if (item.type.includes('INT')) {
            type = Joi.number();
        } else if (item.type.includes('FLOAT')) {
            type = Joi.number();
        } else if (item.type.includes("BOOLEAN")) {
            type = Joi.boolean();
        } else {
            type = Joi.string();
        }


        // Add the key to the dynamic schema with validation rules
        dynamicSchema = dynamicSchema.keys({ [key]: isRequired ? type.required() : type.optional() });
    });

    return dynamicSchema
}

function updateRecordSchema(req: Request) {
    const data = req.model.attributes

    let dynamicSchema = Joi.object({});

    data.forEach((item) => {
        if (item.name === "id" || item.name === "updatedAt" || item.name === "createdAt") return;

        const key = item.name!;
        let type;

        // Determine the Joi type based on the "type" property
        if (item.type.includes('INT')) {
            type = Joi.number();
        } else if (item.type.includes('FLOAT')) {
            type = Joi.number();
        } else if (item.type.includes("BOOLEAN")) {
            type = Joi.boolean();
        } else {
            type = Joi.string();
        }


        // Add the key to the dynamic schema with validation rules
        dynamicSchema = dynamicSchema.keys({ [key]: type.optional() });
    });

    return dynamicSchema
}

function getAllRecordSchema(req: Request) {
    const data = req.model.attributes

    let dynamicSchema = Joi.object({
        page: Joi.number().min(1).optional(),
        limit: Joi.number().when('page', {
            is: Joi.exist(),
            then: Joi.required(),
            otherwise: Joi.optional()
        })
    });

    data.forEach((item) => {
        if (item.name === "id" || item.name === "updatedAt" || item.name === "createdAt") return;

        const key = item.name!;
        let type;

        // Determine the Joi type based on the "type" property
        if (item.type.includes('INT')) {
            type = Joi.number();
        } else if (item.type.includes('FLOAT')) {
            type = Joi.number();
        } else if (item.type.includes("BOOLEAN")) {
            type = Joi.boolean();
        } else {
            type = Joi.string();
        }


        // Add the key to the dynamic schema with validation rules
        dynamicSchema = dynamicSchema.keys({ [key]: type.optional() });
    });

    return dynamicSchema
}



const paramRecordSchema = Joi.object({
    entity: Joi.string().disallow('refresh_token_list', 'users').required(),
    id: Joi.number().optional(),
})


export {
    paramRecordSchema,
    getAllRecordSchema,
    createRecordSchema,
    updateRecordSchema
}
