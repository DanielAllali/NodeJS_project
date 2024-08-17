import mongoose from "mongoose";
import {
    adminGuard,
    adminOrRegisteredUserGuard,
    getUser,
    registeredUserGuard,
} from "../../guard.mjs";
import { app } from "../../index.mjs";
import Card from "./cards.model.mjs";

app.get("/cards", async (req, res) => {
    res.send(await Card.find());
});
app.get("/cards/my-cards", async (req, res) => {
    const user = getUser(req);
    if (!user) {
        return res.status(403).send("User not found");
    }
    const cards = await Card.find({ user_id: user._id });
    return res.send(cards);
});

app.get("/cards/:id", async (req, res) => {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
        const card = await Card.findById(id);
        if (!card) {
            return res.status(403).send("Card not found");
        }
        res.send(card);
    } else {
        return res.status(403).send("Invalid id");
    }
});
