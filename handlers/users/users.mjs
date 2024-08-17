import {
    adminGuard,
    adminOrRegisteredUserGuard,
    getUser,
    registeredUserGuard,
} from "../../guard.mjs";
import { app } from "../../index.mjs";
import { userUpdate } from "./users.joi.mjs";
import { User } from "./users.model.mjs";

app.get("/users", adminGuard, async (req, res) => {
    res.send(await User.find());
});
app.get("/users/:id", adminOrRegisteredUserGuard, async (req, res) => {
    const user = getUser(req);
    res.send(await User.findById(user._id));
});
app.put("/users/:id", registeredUserGuard, async (req, res) => {
    try {
        const { name, email, phone, address, image } = req.body;
        const { first, middle, last } = name;
        const { state, country, city, street, houseNumber } = address;
        const { url, alt } = image;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(403).send({ message: "User not found" });
        }
        const validate = userUpdate.validate(req.body, { allowUnknown: true });
        if (validate.error) {
            return res.status(403).send(validate.error.details[0].message);
        }
        if ((await User.findOne({ email }))._id.toString() !== req.params.id) {
            return res.status(403).send("User with that email already exists");
        }

        // Update the nested fields
        user.name.first = first;
        user.name.middle = middle;
        user.name.last = last;

        user.phone = phone;
        user.email = email;

        user.address.state = state;
        user.address.country = country;
        user.address.city = city;
        user.address.street = street;
        user.address.houseNumber = houseNumber;

        user.image.url = url;
        user.image.alt = alt;

        await user.save();

        res.send(user);
    } catch {
        return res.status(403).send("Invalid object");
    }
});

app.patch("/users/:id", registeredUserGuard, async (req, res) => {
    const { isBusiness } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(403).send({ message: "User not found" });
    }

    if (
        typeof isBusiness === "boolean" ||
        isBusiness == "true" ||
        isBusiness == "false"
    ) {
        user.isBusiness = isBusiness;
        await user.save();
        res.send(user);
    } else {
        res.status(403).send("Invalid syntax, isBusiness is true or false");
    }
});

app.delete("/users/:id", adminOrRegisteredUserGuard, async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(403).send("User not found");
    }

    await User.findByIdAndDelete(req.params.id);
    res.send(user);
});
