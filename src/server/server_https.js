import express from 'express';
import cors from 'cors';
import http from 'http';
import https from 'https';
import fs from 'fs';
import initializeSocket from './config/socket_init.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import wallRoutes from './routes/wall.js';
import benchRoutes from './routes/bench.js';
import mailRoutes from './routes/mail/mail.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const serverPort = 3001;

// HTTP Server
const httpServer = http.createServer(app);

// HTTPS Server
const privateKeyPath = '/etc/nginx/ssl/www.brainstormish.site.key';
const certificatePath = '/etc/nginx/ssl/brainstormish_site_chain.crt';

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

// Initializing the socket
initializeSocket(httpsServer); // Use httpsServer for HTTPS or httpServer for HTTP

// Enabling passing data to the body of the req
app.use(express.json({ extended: false }));

// CORS setup
if (process.env.PRODUCTION === 'yes') {
    // Production
    app.use(cors({
        origin: ['https://brainstormish.site'],
        credentials: true,
    }));
} else {
    // Development
    app.use(cors({ origin: true, credentials: true }));
}

app.use(cookieParser());
app.use('/auth', authRoutes);
app.use('/wall', wallRoutes);
app.use('/bench', benchRoutes);
app.use('/mail', mailRoutes);

// Start the server
httpsServer.listen(serverPort, () => {
    console.log(`HTTPS Server running on port ${serverPort}`);
});