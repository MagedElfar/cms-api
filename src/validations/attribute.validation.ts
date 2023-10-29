import Joi from "joi";
import { COLUMN_TYPE, FK_CONSTRAINTS } from "../models/attribute.model";

const createAttributeSchema = Joi.object({
    refId: Joi.number().optional(),
    onDelete: Joi.string().valid(...Object.values(FK_CONSTRAINTS)).when('refId', {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    onUpdate: Joi.string().valid(...Object.values(FK_CONSTRAINTS)).when('refId', {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    type: Joi.string()
        .when('refId', {
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

const updateAttributeSchema = Joi.object({
    refId: Joi.number().optional(),
    onDelete: Joi.string().valid(...Object.values(FK_CONSTRAINTS)).optional(),
    onUpdate: Joi.string().valid(...Object.values(FK_CONSTRAINTS)).optional(),
    type: Joi.string()
        .when('refId', {
            is: Joi.exist(),
            then: Joi.valid(COLUMN_TYPE.integer).optional(),
            otherwise: Joi.valid(...Object.values(COLUMN_TYPE)).optional(),
        }),
    required: Joi.boolean()
        .when('ref', {
            is: Joi.exist(),
            then: Joi.valid(true).optional(),
            otherwise: Joi.optional(),
        }),
    name: Joi.string()
        .regex(/^[A-Za-z_]+$/)
        .disallow('id', 'createdAt', 'updatedAt')
        .optional()
        .messages(
            {
                'string.pattern.base': 'Invalid characters in the name. Only letters, and underscores are allowed.',

                'any.invalid': 'Invalid column name. "id," "createdAt," and "updatedAt" are not allowed.'
            }
        ),
})

const getManySchema = Joi.object({

    name: Joi.string().optional(),

    page: Joi.number().min(1).optional(),
    limit: Joi.number().when('page', {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.optional()
    })

})



export {
    createAttributeSchema,
    updateAttributeSchema,
    getManySchema
}
