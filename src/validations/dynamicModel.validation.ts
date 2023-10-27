import Joi from "joi";
import { COLUMN_TYPE } from "../services/dynamicModel.services";

const createModelSchema = Joi.object({

    name: Joi.string().regex(/^[A-Za-z_]+$/).required()
        .messages(
            {
                'string.pattern.base': 'Invalid characters in the name. Only letters, and underscores are allowed.',
            }
        ),
})

const createAttributeSchema = Joi.object({
    table: Joi.string().required(),
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
    name: Joi.string().regex(/^[A-Za-z_]+$/).required()
        .messages(
            {
                'string.pattern.base': 'Invalid characters in the name. Only letters, and underscores are allowed.',
            }
        ),
})




export {
    createModelSchema,
    createAttributeSchema
}