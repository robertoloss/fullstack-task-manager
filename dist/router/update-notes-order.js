"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const list_1 = require("../controllers/list");
const middleware_1 = require("../middleware");
function default_1(router) {
    router.post('/update-notes-order', middleware_1.verifyToken, list_1.updateNotesPosition);
}
exports.default = default_1;
//# sourceMappingURL=update-notes-order.js.map