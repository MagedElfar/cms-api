import Joi from "joi";


const assignEntityAttributeSchema = Joi.object({

    attributeId: Joi.number().required(),
    entityId: Joi.number().required()
})


export {
    assignEntityAttributeSchema,
}