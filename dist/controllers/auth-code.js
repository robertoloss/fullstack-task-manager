"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCode = exports.createAuthCode = void 0;
const nodejs_1 = __importDefault(require("@emailjs/nodejs"));
const index_1 = require("../index");
async function createAuthCode(req, res) {
    const { email } = req.body;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    console.log("Auth code created: ", code);
    const storedCodeRes = await index_1.db.query(`
		INSERT INTO	auth_codes (email, code)
		VALUES ($1, $2)
		RETURNING code
	`, [email, code]);
    if (storedCodeRes.rowCount = 0) {
        return res.status(500).json({ error: "Couldn't store generated key" });
    }
    const storedCode = storedCodeRes.rows[0]?.code;
    if (!storedCode) {
        return res.status(500).json({ error: "Couldn't store generated key" });
    }
    const templateParams = {
        to_email: email,
        code: storedCode
    };
    try {
        nodejs_1.default.init({
            publicKey: process.env.EMAIL_PUBLIC_KEY,
            validationRequired: false
        });
        const emailjsResponse = await nodejs_1.default.send(process.env.EMAIL_SERVICE_ID, process.env.EMAIL_TEMPLATE_ID, templateParams, {
            publicKey: process.env.EMAIL_PUBLIC_KEY,
            privateKey: process.env.EMAIL_PRIVATE_KEY
        });
        console.log('SUCCESS!');
        res.status(200).json({ message: "Email sent correctly" });
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}
exports.createAuthCode = createAuthCode;
async function verifyCode(req, res) {
    const { email, code } = req.body;
    console.log("verifyCode - email, body: ", email, code);
    try {
        const data = await index_1.db.query(`
				SELECT 1 from auth_codes
				where email=$1 and code=$2 and is_valid=true 
		`, [email, code]);
        const codeOk = data.rowCount > 0;
        if (codeOk) {
            res.status(200).json({ message: 'Code is valid.' });
            const invalidation = await index_1.db.query(`
				UPDATE auth_codes
				SET is_valid=false
				where email=$1 and code=$2 and is_valid=true
			`, [email, code]);
            if (invalidation.rowCount > 0) {
                console.log("Code successfully invalidated");
            }
            else {
                console.log("ERROR: code was not invalidated");
            }
        }
        else {
            res.status(404).json({ error: 'Code not found or invalid.' });
        }
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}
exports.verifyCode = verifyCode;
//# sourceMappingURL=auth-code.js.map