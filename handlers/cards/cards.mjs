import mongoose, { get } from "mongoose";
import {
    adminGuard,
    adminOrRegisteredUserGuard,
    businessGuard,
    generateBizNumber,
    getCard,
    getUser,
} from "../../guard.mjs";
import { app } from "../../index.mjs";
import Card from "./cards.model.mjs";
import cardSchema from "./cards.joi.mjs";

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
    res.send(await getCard(req, res));
});
app.post("/cards", businessGuard, async (req, res) => {
    const { title, subtitle, description, phone, email, web, image, address } =
        req.body;

    const user = getUser(req);
    if (!user) {
        return res.status(403).send("User not found");
    }
    const validate = cardSchema.validate(req.body, { allowUnknown: true });
    if (validate.error) {
        return res.status(403).send(validate.error.details[0].message);
    }
    const card = new Card({
        title,
        subtitle,
        description,
        phone,
        email,
        web,
        image,
        address,
        bizNumber: await generateBizNumber(),
        likes: [],
        user_id: user._id,
    });
    const newCard = await card.save();
    res.send(newCard);
});

app.put("/cards/:id", async (req, res) => {
    const card = await getCard(req);
    if (!card) {
        return res.status(403).send("Card not found");
    }
    const user = getUser(req);
    if (!user) {
        return res.status(403).send("User not found");
    }
    if (card.user_id.toString() !== user._id.toString()) {
        return res
            .status(401)
            .send(
                "Unauthronized: only the user who created the card is allowed"
            );
    }

    const { title, subtitle, description, phone, email, web, image, address } =
        req.body;
    const validate = cardSchema.validate(req.body, { allowUnknown: true });
    if (validate.error) {
        return res.status(403).send(validate.error.details[0].message);
    }
    try {
        card.title = title;
        card.subtitle = subtitle;
        card.description = description;
        card.phone = phone;
        card.email = email;
        card.web = web;
        card.image = image;
        card.address = address;
        await card.save();
        return res.send(card);
    } catch (error) {
        return res.status(500).send("Failed to update card: " + error.message);
    }
});

app.patch("/cards/:id", async (req, res) => {
    try {
        const card = await getCard(req);
        if (!card) {
            return res.status(403).send("Card not found");
        }
        const user = getUser(req);
        if (!user) {
            return res.status(403).send("User not found");
        }
        let isLiked = false;
        for (const like in card.likes) {
            if (card.likes[like].toString() === user._id) {
                card.likes.splice(like, 1);
                isLiked = true;
                break;
            }
        }
        if (!isLiked) {
            card.likes.push(user._id);
        }
        await card.save();
        res.send(card);
    } catch {
        res.status(500).send("An error occured while updating card");
    }
});

app.delete("/cards/:id", async (req, res) => {
    try {
        const user = getUser(req);
        if (!user) {
            return res.status(403).send("User not found");
        }
        const card = await getCard(req);
        if (!card) {
            return res.status(403).send("Card not found");
        }
        if (!user.isAdmin && card.user_id.toString() !== user._id) {
            return res
                .status(401)
                .send(
                    "Unauthronized: only user that created the card or admin are allowed"
                );
        }
        await Card.findByIdAndDelete(card._id);
        res.send(card);
    } catch {
        res.status(500).send("An error occured while deleting this card");
    }
});
