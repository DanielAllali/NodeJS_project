import jwt from "jsonwebtoken";
import { User } from "./handlers/users/users.model.mjs";
import Card from "./handlers/cards/cards.model.mjs";
import mongoose from "mongoose";

export const adminGuard = (req, res, next) => {
    const user = getUser(req);

    if (user?.isAdmin) {
        next();
    } else {
        res.status(401).send("User is not authorized, only admin");
    }
};

export const businessGuard = (req, res, next) => {
    const user = getUser(req);

    if (user?.isBusiness) {
        next();
    } else {
        res.status(401).send("User is not authorized, only business");
    }
};

export const theRegisteredUserGuard = (req, res, next) => {
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

export const getCard = async (req) => {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
        const card = await Card.findById(id);
        if (!card) {
            return null;
        }
        return card;
    } else {
        return null;
    }
};

export const generateBizNumber = async () => {
    let biz = "";
    let generated = false;

    while (!generated) {
        biz = "";
        for (let i = 0; i < 7; i++) {
            biz += Math.floor(Math.random() * 10);
        }
        const checkBiz = await Card.findOne({ bizNumber: biz });
        if (!checkBiz) {
            generated = true;
        }
    }
    return biz;
};
