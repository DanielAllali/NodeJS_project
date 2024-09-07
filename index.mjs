import express from "express";
import fs, { stat } from "fs";
import cors from "cors";
import mongoose from "mongoose";
import chalk from "chalk";
import dotenv from "dotenv";
import morgan from "morgan";
import moment from "moment";
import path from "path";

dotenv.config();

async function main() {
    await mongoose.connect(
        process.env.NODE_ENV === "development"
            ? process.env.MONGO_URI
            : process.env.MONGO_ATLAS_URI
    );
    console.log("mongodb connected");
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
const methodColors = {
    GET: chalk.green,
    POST: chalk.yellow,
    PUT: chalk.blue,
    PATCH: chalk.magenta,
    DELETE: chalk.red,
};

const customMorganFormat = (tokens, req, res) => {
    const method = tokens.method(req, res);
    const status = tokens.status(req, res);
    const url = tokens.url(req, res);
    const responseTime = tokens["response-time"](req, res);

    const color = methodColors[method] || chalk.white;

    return [
        chalk.bgWhite.black(tokens.date(req, res)),
        color(method),
        chalk.cyan(url),
        status < 300 && status >= 200 ? chalk.green(status) : chalk.red(status),
        chalk.magenta(`${responseTime} ms`),
    ].join(" ");
};
app.use(morgan(customMorganFormat));

app.use((req, res, next) => {
    const originalSend = res.send;

    res.send = function (body) {
        const responseBody = body;

        if (res.statusCode >= 400) {
            let fileContent = "";

            const fileName = moment().format("YYYY_MM_DD-HH_mm_ss");

            fileContent += `Date: ${moment().format("YYYY_MM_DD-HH:mm:ss")}\n`;
            fileContent += `Status: ${res.statusCode}\n`;
            fileContent += `Error message: ${responseBody}\n`;

            fs.mkdirSync("./logs", { recursive: true });
            fs.writeFile(`./logs/${fileName}.txt`, fileContent, (err) => {
                if (err) {
                    console.error("Failed to write file:", err);
                } else {
                    console.log('Log file added to "logs" folder');
                }
            });
        }

        originalSend.call(this, body);
    };

    next();
});

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.send.PORT}`);
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
