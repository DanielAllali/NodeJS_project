import mongoose, { Schema } from "mongoose";

const Name = new Schema({
    first: String,
    middle: String,
    last: String,
});
const Address = new Schema({
    state: String,
    country: String,
    city: String,
    street: String,
    houseNumber: String,
});
const Image = new Schema({
    url: String,
    alt: { type: String, default: "" },
});

const schema = new Schema({
    name: Name,
    phone: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    address: Address,
    image: Image,
    createdAt: String,
    isBusiness: Boolean,
    isAdmin: { type: Boolean, default: false },
});

export const User = mongoose.model("users", schema);
