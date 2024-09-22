"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const list_1 = __importDefault(require("./list"));
const auth_1 = __importDefault(require("./auth"));
const users_1 = __importDefault(require("./users"));
const update_notes_order_1 = __importDefault(require("./update-notes-order"));
const currentUser_1 = __importDefault(require("./currentUser"));
const path_1 = __importDefault(require("path"));
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
exports.default = () => {
    (0, list_1.default)(router);
    (0, auth_1.default)(router);
    (0, update_notes_order_1.default)(router);
    (0, users_1.default)(router);
    (0, currentUser_1.default)(router);
    router.get('/', middleware_1.verifyToken, (_req, res) => {
        res.sendFile(path_1.default.join(process.cwd(), 'frontend', 'index.html'));
    });
    return router;
};
//# sourceMappingURL=index.js.map