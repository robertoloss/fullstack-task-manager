"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userWithEmailExists = void 0;
const __1 = require("..");
async function userWithEmailExists(email) {
    try {
        const result = await __1.db.query(`
			SELECT * FROM users 
			WHERE email = $1
		`, [email]);
        console.log("userWithEmailExists: ", result.rows);
        if (result.rowCount > 0) {
            console.log("userWithEmailExists: YES");
            return {
                userExists: result.rowCount > 0,
                user: result.rows[0]
            };
        }
        else {
            console.log("userWithEmailExists: NO");
            return {
                userExists: false,
                user: null
            };
        }
    }
    catch (error) {
        console.error("there was an error (userWithEmailExists): ", error);
        return {
            userExists: 'error',
            user: null
        };
    }
}
exports.userWithEmailExists = userWithEmailExists;
//# sourceMappingURL=users.js.map