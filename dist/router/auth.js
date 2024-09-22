"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("../controllers/authentication");
function default_1(router) {
    router.post('/auth/register', authentication_1.register);
    router.post('/auth/login', authentication_1.login);
    router.post('/auth/logout', (_, __, next) => { console.log("logging out"), next(); }, authentication_1.logOut);
}
exports.default = default_1;
//# sourceMappingURL=auth.js.map