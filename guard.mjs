import jwt from "jsonwebtoken";
import { User } from "./handlers/users/users.model.mjs";
import Card from "./handlers/cards/cards.model.mjs";

export const adminGuard = (req, res, next) => {
    const user = getUser(req);

    if (user?.isAdmin) {
        next();
    } else {
        res.status(401).send("User is not authorized, only admin");
    }
};

export const registeredUserGuard = (req, res, next) => {
    const user = getUser(req);
    if (user) {
        if (user._id === req.params.id) {
            next();
        } else {
            res.status(401).send(
                "User is not authorized, only registered user"
            );
        }
    } else {
        res.status(403).send("No user with that id");
    }
};

export const adminOrRegisteredUserGuard = (req, res, next) => {
    const user = getUser(req);
    if (user) {
        if (user._id === req.params.id) {
            next();
        } else if (user?.isAdmin) {
            next();
        } else {
            res.status(401).send(
                "User is not authorized, only admin or the registered user"
            );
        }
    } else {
        res.status(403).send("No user with that id");
    }
};

export const getUser = (req) => {
    if (!req.headers.authorization) {
        return null;
    }
    const user = jwt.decode(req.headers.authorization, process.env.JWT_SECRET);

    if (!user) {
        return null;
    }

    return user;
};

export const generateBizNumber = async () => {
    let biz = "";
    let generated = false;

    while (!generated) {
        biz = "";
        for (let i = 0; i < 7; i++) {
            biz += Math.floor(Math.random() * 6) + 1;
        }
        const checkBiz = await Card.findOne({ bizNumber: biz });
        if (!checkBiz) {
            generated = true;
        }
    }
    return biz;
};
