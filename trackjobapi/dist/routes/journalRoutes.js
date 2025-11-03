"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_1 = require("../data/data");
const journalRouter = express_1.default.Router();
journalRouter.get("/", (req, res) => {
    res.status(200).json({ message: "succesfull", data: "Sever up and running" });
});
journalRouter.get("/entries", (req, res) => {
    res.status(200).json({ message: "succesfull", data: data_1.entries });
});
exports.default = journalRouter;
