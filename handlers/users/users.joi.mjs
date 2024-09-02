import Joi from "joi";

const nameSchema = Joi.object({
    first: Joi.string().required().min(1).max(20),
    middle: Joi.string().optional().min(1).max(20),
    last: Joi.string().required().min(1).max(20),
});

const addressSchema = Joi.object({
    state: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    houseNumber: Joi.string().required(),
});

const imageSchema = Joi.object({
    url: Joi.string().uri().required(),
    alt: Joi.string().allow("").optional(),
});

export const userSchema = Joi.object({
    name: nameSchema,
    phone: Joi.string().required().min(8).max(15),
    email: Joi.string().email().required(),
    password: Joi.string()
        .pattern(/^(?=.*[A-Z])[A-Za-z0-9\s\W]{5,20}$/)
        .required(),
    address: addressSchema,
    image: imageSchema,
    isBusiness: Joi.boolean().required(),
    isAdmin: Joi.boolean().default(false),
});

export const userLogin = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .pattern(/^(?=.*[A-Z])[A-Za-z0-9\s\W]{5,20}$/)
        .required(),
});

export const userUpdate = Joi.object({
    name: nameSchema,
    phone: Joi.string().required().min(8).max(15),
    email: Joi.string().email().required(),
    address: addressSchema,
    image: imageSchema,
});
