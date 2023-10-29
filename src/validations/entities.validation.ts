import Joi from "joi";


const createModelSchema = Joi.object({

    name: Joi.string().regex(/^[A-Za-z_]+$/).required()
        .disallow('refresh_token_list', 'users')
        .messages(
            {
                'string.pattern.base': 'Invalid characters in the name. Only letters, and underscores are allowed.',
            }
        ),
})


const removeEntitySchema = Joi.object({
    entity: Joi.string().disallow('refresh_token_list', 'users').required(),
})

const updateEntitySchema = Joi.object({
    newName: Joi.string().required()
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
    createModelSchema,
    removeEntitySchema,
    updateEntitySchema,
    getManySchema
}