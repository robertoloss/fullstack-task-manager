"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("../middleware");
dotenv_1.default.config();
const baseURL = process.env.BASE_URL;
async function verifyUser(req, res) {
    console.log("VerifyUser Req headers: ", req.headers);
    console.log("verify user");
    const token = req.cookies.token;
    console.log("req.cookies (verifyUser): ", req.cookies);
    if (!token) {
        console.log("no token (verify user)");
        return res.status(401).json({ redirect: `${baseURL}/login` });
    }
    try {
        console.log("verifyToken: try");
        const decoded = jsonwebtoken_1.default.verify(token, middleware_1.SECRET);
        if (decoded) {
            console.log("JWT OK (verifyUser): ", decoded.email);
            req.user = decoded.email;
            res.status(200).json({ status: '200' });
        }
        else {
            console.log("redirect");
            res.status(401).set('Location', `${baseURL}/login`).end();
        }
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}
exports.verifyUser = verifyUser;
//# sourceMappingURL=verifyUser.js.map