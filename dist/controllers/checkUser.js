"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = void 0;
const index_1 = require("../index");
async function checkUser(req, res) {
    const { email } = req.body;
    console.log("checkUser - email: ", email);
    try {
        const data = await index_1.db.query(`
			SELECT 1 FROM users
			where email=$1
		`, [email]);
        console.log("checkUser - data.rows: ", data.rows);
        if (data.rowCount > 0) {
            console.log("user exists");
            res.status(200).json({ userExists: true });
        }
        else {
            console.log("user doesn't exist");
            res.status(200).json({ userExists: false });
        }
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}
exports.checkUser = checkUser;
//# sourceMappingURL=checkUser.js.map