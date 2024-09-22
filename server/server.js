import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { createServer } from 'http';
import authRoutes from './routes/authRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import socketSetup from './socket.js';
import {setupDatabase} from './db/db.js';

const app = express();
const server = createServer(app);

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
app.use(express.static(path.join(process.cwd(), 'client', 'build')));

// Fallback to client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'public', 'index.html'));
});

// Socket.io setup
socketSetup(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
