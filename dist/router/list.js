"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const list_1 = require("../controllers/list");
const middleware_1 = require("../middleware");
exports.default = (router) => {
    router.get('/list', middleware_1.verifyToken, list_1.getList);
    router.delete('/list/:id', middleware_1.verifyToken, list_1.deleteListEntry);
    router.post('/list', middleware_1.verifyToken, list_1.postListEntry);
    router.put('/list/:id', middleware_1.verifyToken, list_1.updateListEntry);
};
//# sourceMappingURL=list.js.map