import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chalk from "chalk";
import dotenv from "dotenv";
import morgan from "morgan";
import moment from "moment";
import path from "path";

dotenv.config();

async function main() {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("mongodb connection established on port 27017");
}

main().catch((err) => console.log(err));

export const app = express();

app.use(express.json());

app.use(express.static("public"));

app.use(
    cors({
        origin: true,
        credentials: true,
        methods: "GET,PUT,POST,PATCH,DELETE,OPTIONS",
        allowedHeaders: "Content-Type, Accept, Authorization",
    })
);

app.listen(process.env.PORT, () => {
    console.log("listening on port 7777");
});

app.get("/", (req, res) => {
    res.send({
        message: "Welcome To My Node Project!",
    });
});

(async () => {
    await import("./handlers/users/users.mjs");
    await import("./handlers/users/auth.mjs");
    await import("./handlers/cards/cards.mjs");
    await import("./initial-data/initial-data.service.mjs");

    app.get("*", (req, res) => {
        res.sendFile(path.resolve("error-page.html"));
    });
})();
