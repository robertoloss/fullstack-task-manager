"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.deleteUser = exports.getAllUsers = void 0;
const index_1 = require("../index");
async function getAllUsers(_req, res) {
    try {
        const response = await index_1.db.query(`
			SELECT * FROM users
		`);
        if (response.rowCount && response.rowCount > 0)
            res.send(response.rows);
        else
            res.sendStatus(400);
    }
    catch (error) {
        console.error(error);
    }
}
exports.getAllUsers = getAllUsers;
async function deleteUser(req, res) {
    const id = req.params.id;
    console.log("Id of user to delete: ", id);
    try {
        const response = await index_1.db.query(`
			DELETE FROM users
			WHERE id = $1
		`, [id]);
        if (response.rowCount && response.rowCount > 0)
            res.sendStatus(200);
        else
            res.sendStatus(400);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
}
exports.deleteUser = deleteUser;
async function getCurrentUser(req, res) {
    const userId = req.user;
    try {
        const result = await index_1.db.query(`
			SELECT email from users
			WHERE id = $1
		`, [userId]);
        if (result.rowCount && result.rowCount > 0) {
            const user = result.rows[0];
            res.json({ user });
        }
        else {
            res.status(400).json({ error: "No user found" });
        }
    }
    catch (error) {
        console.error(error);
    }
}
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=users.js.map