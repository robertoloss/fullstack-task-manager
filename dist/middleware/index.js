"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.SECRET = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.SECRET = process.env.JWT_SECRET;
const baseURL = process.env.BASE_URL;
function verifyToken(req, res, next) {
    console.log("Verifying token...");
    const token = req.cookies.token;
    if (!token) {
        console.log("no token (verify token)");
        res.redirect(`${baseURL}/login`);
        return;
    }
    try {
        console.log("VerifyToken: try");
        const decoded = jsonwebtoken_1.default.verify(token, exports.SECRET);
        if (decoded) {
            console.log("JWT OK (verifyToken): ", decoded.id);
            req.user = decoded.id;
            next();
        }
        else {
            res.redirect(`${baseURL}/login`);
            console.log("redirect");
        }
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}
exports.verifyToken = verifyToken;
;
//# sourceMappingURL=index.js.map