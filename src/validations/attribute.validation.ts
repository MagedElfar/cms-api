import Joi from "joi";
import { COLUMN_TYPE } from "../services/attributes.services";

const attributeSchema = Joi.object({
    ref: Joi.string().optional(),
    type: Joi.string()
        .when('ref', {
            is: Joi.exist(),
            then: Joi.valid(COLUMN_TYPE.integer).required(),
            otherwise: Joi.valid(...Object.values(COLUMN_TYPE)).required(),
        }),
    required: Joi.boolean()
        .when('ref', {
            is: Joi.exist(),
            then: Joi.valid(true).required(),
            otherwise: Joi.required(),
        }),
    name: Joi.string()
        .regex(/^[A-Za-z_]+$/)
        .disallow('id', 'createdAt', 'updatedAt')
        .required()
        .messages(
            {
                'string.pattern.base': 'Invalid characters in the name. Only letters, and underscores are allowed.',

                'any.invalid': 'Invalid column name. "id," "createdAt," and "updatedAt" are not allowed.'
            }
        ),
})

const createAttributeSchema = Joi.object({
    entity: Joi.string().required(),
    attribute: Joi.array().items(attributeSchema).min(1).required()
})


const removeAttributeSchema = Joi.object({
    entity: Joi.string().disallow('refresh_token_list', 'users').required(),
    attribute: Joi.string().disallow('id', 'createdAt', 'updatedAt').required(),
})

const renameAttributeSchema = Joi.object({
    entity: Joi.string().disallow('refresh_token_list', 'users').required(),
    attribute: Joi.string().disallow('id', 'createdAt', 'updatedAt').required(),
    newName: Joi.string().required(),
})

const getAttributeSchema = Joi.object({
    entity: Joi.string().disallow('refresh_token_list', 'users').required(),
})


export {
    createAttributeSchema,
    removeAttributeSchema,
    getAttributeSchema,
    renameAttributeSchema
}
