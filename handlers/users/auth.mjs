import { app } from "../../index.mjs";
import { userLogin, userSchema } from "./users.joi.mjs";
import { User } from "./users.model.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

app.post("/users", async (req, res) => {
    const { name, email, phone, password, address, image, isBusiness } =
        req.body;

    const validate = userSchema.validate(req.body, { allowUnknown: true });
    if (validate.error) {
        return res.status(403).send(validate.error.details[0].message);
    }

    if (await User.findOne({ email })) {
        return res.status(403).send("User with that email already exists");
    }

    const user = new User({
        name,
        email,
        phone,
        password: await bcrypt.hash(password, 10),
        address,
        image,
        createdAt: new Date(),
        isBusiness,
    });
    const newUser = await user.save();
    res.send(newUser);
});

app.post("/users/login", async (req, res) => {
    const { email, password } = req.body;

    const validate = userLogin.validate({ email, password });
    if (validate.error) {
        return res.status(403).send(validate.error.details[0].message);
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(403).send("email or password is incorrect");
    }
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
        return res.status(403).send("email or password is incorrect");
    }
    const token = jwt.sign(
        {
            _id: user._id,
            name: user.name,
            isBusiness: user.isBusiness,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "10h" }
    );

    res.send(token);
});
