"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middleware_1 = require("../middleware");
const users_1 = require("../controllers/users");
function default_1(router) {
    router.get('/users', middleware_1.verifyToken, users_1.getAllUsers);
    router.delete('/users/:id', middleware_1.verifyToken, users_1.deleteUser);
}
exports.default = default_1;
//# sourceMappingURL=users.js.map