import { generateBizNumber } from "../guard.mjs";
import Card from "../handlers/cards/cards.model.mjs";
import { User } from "../handlers/users/users.model.mjs";
import { initialData } from "./initial-data.mjs";
import bcrypt from "bcrypt";

(async () => {
    const userAmount = await User.find().countDocuments();
    if (!userAmount) {
        for (const u of initialData.users) {
            const user = new User(u);
            user.password = await bcrypt.hash(user.password, 10);
            user.createdAt = new Date();
            await user.save();
        }
    }
    const cardsAmount = await Card.find().countDocuments();
    if (!cardsAmount) {
        for (const u of initialData.cards) {
            const card = new Card(u);
            card.bizNumber = await generateBizNumber();

            await card.save();
        }
    }
})();
