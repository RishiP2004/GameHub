import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {db} from "../db/db.js";

const secretKey = process.env.SECRET_KEY;

/**
 * Register API
 *
 * Checks if username entry in
 * database and sends back a 1h
 * expiring JWT token, with set cookie
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await db('players').where({ username }).first();

        if (existingUser) {
            return res.status(401).json({ error: 'Username exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await db('players').insert({
            username,
            password: hashedPassword,
        });

        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
        res.cookie('authToken', token, { httpOnly: true });
        res.json({ token });
    } catch (error) {
        console.error('Error during register:', error);
        //res.status(500).json({ error: 'Internal Server Error' });
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

/**
 * Authentication API
 *
 * Checks if username and password
 * entries match in database and sends
 * back a 1h expiring JWT token, with
 * set cookie
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db('players').where({ username }).first();

        if (!user) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
        res.cookie('authToken', token, { httpOnly: true });
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Verify token API
 *
 * Checks if valid token through
 * JWT and sends back status
 * accordingly
 *
 * @param req
 * @param res
 * @returns {*}
 */
export const verifyToken = (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, secretKey, (err) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        res.sendStatus(200);
    });
};
