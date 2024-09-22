"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.logOut = exports.login = exports.register = void 0;
const users_1 = require("../db/users");
const helpers_1 = require("../helpers");
const __1 = require("..");
async function register(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.error('Some credentials (either email or password) are missing');
            res.sendStatus(400);
        }
        console.log("Credentials: ok", email, password);
        const { userExists, user } = await (0, users_1.userWithEmailExists)(email);
        if (userExists === true) {
            console.log("user exists, ", userExists);
            console.log("the user: ", user);
            res.sendStatus(400);
        }
        else if (userExists === 'error') {
            console.log("userExists error: ", userExists);
            res.sendStatus(400);
        }
        else {
            const hash = await (0, helpers_1.hashPassword)(password);
            console.log("Hash: ", hash);
            const result = await __1.db.query(`
				INSERT INTO users
				(email, password)
				VALUES($1, $2)
				RETURNING id
			`, [email, hash]);
            if (result.rowCount && result.rowCount > 0) {
                console.log("User created: ", result.rows[0]);
                res.sendStatus(201);
            }
            else
                res.sendStatus(400);
        }
    }
    catch (error) {
        console.error(error);
    }
}
exports.register = register;
const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
};
async function login(req, res) {
    try {
        const { email, password } = req.body;
        console.log("Email and password for login: ", email, password);
        if (!email)
            res.sendStatus(404);
        const result = await __1.db.query(`
			SELECT * FROM users
			WHERE email = $1
		`, [email]);
        const user = result.rows[0];
        if (result.rowCount && result.rowCount > 0) {
            const storedHash = result.rows[0].password;
            console.log(storedHash);
            console.log("verifying password: ", await (0, helpers_1.verifyPassword)(password, storedHash));
            if (await (0, helpers_1.verifyPassword)(password, storedHash)) {
                const token = (0, helpers_1.generateToken)(user);
                res.cookie('token', token, {
                    ...cookieOptions,
                    maxAge: 3600000,
                });
                console.log("Headers when creating cookie: ", res.getHeaders());
                res.sendStatus(200);
                console.log("verified!");
            }
            else
                res.sendStatus(403);
        }
        else
            res.sendStatus(400);
    }
    catch (error) {
        console.error(error);
    }
}
exports.login = login;
async function logOut(_req, res) {
    console.log("logOut controller");
    res.clearCookie('token', cookieOptions);
    console.log("Headers after clearing cookie: ", res.getHeaders());
    res.status(200).json({ message: "Logged out succesfully" });
}
exports.logOut = logOut;
async function resetPassword(req, res) {
    const { email, password } = req.body;
    console.log("email and password: ", email, password);
    const hash = await (0, helpers_1.hashPassword)(password);
    try {
        const data = await __1.db.query(`
			UPDATE users
			set password=$2
			where email=$1
		`, [email, hash]);
        if (data.rowCount > 0) {
            res.sendStatus(200);
        }
        else {
            console.log(data.rowCount);
            console.log("data: ", data);
            res.sendStatus(500);
        }
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}
exports.resetPassword = resetPassword;
//# sourceMappingURL=authentication.js.map