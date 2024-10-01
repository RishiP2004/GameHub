import express from 'express';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import authRoutes from './routes/authRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import socketSetup from './sockets/socket.js';
import { setupDatabase } from './db/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = createServer(app);
import cors from 'cors';

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up database
setupDatabase()
    .then(() => console.log('Setup complete'))
    .catch((error) => console.error('Setup failed:', error));

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// Routes setup
app.use('/api', authRoutes);
app.use('/api', statsRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Fallback to client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Socket.io setup
socketSetup(server);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
