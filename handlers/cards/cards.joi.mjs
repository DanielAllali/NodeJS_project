import Joi from "joi";

const imageSchema = Joi.object({
    url: Joi.string().uri().required(),
    alt: Joi.string(),
});

const addressSchema = Joi.object({
    state: Joi.string().default(""),
    country: Joi.string(),
    city: Joi.string(),
    street: Joi.string(),
    houseNumber: Joi.string(),
    zip: Joi.string().optional(),
});

const cardSchema = Joi.object({
    title: Joi.string().required(),
    subtitle: Joi.string().optional().allow(""),
    description: Joi.string().optional().allow(""),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    web: Joi.string().uri().optional().allow(""),
    image: imageSchema.optional(),
    address: addressSchema.optional(),
});

export default cardSchema;
