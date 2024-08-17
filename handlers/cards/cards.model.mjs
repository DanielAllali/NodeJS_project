import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
    state: { type: String, required: true, default: "" },
    country: { type: String, required: true, default: "" },
    city: { type: String, required: true, default: "" },
    street: { type: String, required: true, default: "" },
    houseNumber: { type: String, required: true, default: "" },
    zip: { type: String, required: true, default: "" },
});

const imageSchema = new Schema({
    url: { type: String },
    alt: { type: String, default: "" },
});

const cardSchema = new Schema(
    {
        title: { type: String, required: true },
        subtitle: { type: String },
        description: { type: String },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        web: { type: String },
        image: imageSchema,
        address: addressSchema,
        bizNumber: { type: String, required: true },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

const Card = mongoose.model("Card", cardSchema);

export default Card;
