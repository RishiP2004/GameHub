/**
 * Verifies API Key for protected routes
 * requiring the request comes from an
 * authorized system
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
export const checkApiKey = (req, res, next) => {
    // Retrieve API key from request headers
    const apiKey = req.headers['x-api-key'];

    // Check if API key matches the expected value
    if (apiKey !== process.env.SYSTEM_API_KEY) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    // If the API key is valid, proceed to the next middleware or route handler
    next();
};
