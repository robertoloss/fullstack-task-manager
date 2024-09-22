"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = __importDefault(require("pg"));
const router_1 = __importDefault(require("./router"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const middleware_1 = require("./middleware");
const authentication_1 = require("./controllers/authentication");
const verifyUser_1 = require("./controllers/verifyUser");
const auth_code_1 = require("./controllers/auth-code");
const checkUser_1 = require("./controllers/checkUser");
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
dotenv_1.default.config();
const dbUrl = process.env.DB_URL;
const baseUrl = process.env.BASE_URL;
const production = process.env.NODE_ENV === 'production';
console.log("base url: ", baseUrl);
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: baseUrl,
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true
}));
app.use(express_1.default.static(path_1.default.join(process.cwd(), 'frontend', 'dist')));
app.use('/signup', (_req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), 'frontend', 'dist', 'index.html'));
});
app.use('/login', (_req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), 'frontend', 'dist', 'index.html'));
});
app.post('/auth/login', authentication_1.login);
app.post('/auth/register', authentication_1.register);
app.post('/auth/verify', verifyUser_1.verifyUser);
app.post('/auth/check', checkUser_1.checkUser);
app.put('/auth/reset', authentication_1.resetPassword);
app.post('/auth-code/create', auth_code_1.createAuthCode);
app.post('/auth-code/verify', auth_code_1.verifyCode);
app.use('/', (0, router_1.default)());
app.use(express_1.default.static(path_1.default.join(process.cwd(), 'frontend', 'dist')));
app.use(middleware_1.verifyToken);
app.get('*', (_req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), 'frontend', 'dist', 'index.html'));
});
const { Pool } = pg_1.default;
exports.db = new Pool({
    connectionString: dbUrl,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
if (!production) {
    const sslOptions = {
        key: fs_1.default.readFileSync(path_1.default.join(__dirname, 'server.key')),
        cert: fs_1.default.readFileSync(path_1.default.join(__dirname, 'server.cert')),
    };
    https_1.default.createServer(sslOptions, app).listen(8090, () => {
        console.log('HTTPS Server running on port 8090');
    });
    http_1.default.createServer((req, res) => {
        res.writeHead(301, { 'Location': `https://${req.headers.host}${req.url}` });
        res.end();
    }).listen(80, () => {
        console.log('HTTP server listening on port 80 and redirecting to HTTPS');
    });
}
else {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server running in production mode on port ${process.env.PORT || 3000}`);
    });
}
//# sourceMappingURL=index.js.map