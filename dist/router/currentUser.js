"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../controllers/users");
const middleware_1 = require("../middleware");
async function default_1(router) {
    router.get('/current-user', middleware_1.verifyToken, users_1.getCurrentUser);
}
exports.default = default_1;
//# sourceMappingURL=currentUser.js.map