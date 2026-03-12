const jobMarketService = require('../services/jobMarketService');

/**
 * Controller to handle job market related requests
 */
exports.getJobMarketInsights = async (req, res) => {
    try {
        const { role } = req.params;
        const { country, location, experience } = req.query;

        if (!role) {
            return res.status(400).json({ error: 'Role parameter is required' });
        }

        // Call the service to get insights
        const insights = await jobMarketService.getInsightsByRole(role, country, location, experience);

        // Return the formatted response
        res.json(insights);
    } catch (error) {
        console.error('[JobMarketController] Error fetching insights for role:', req.params.role, error.message);

        // Handle specific errors based on status properties set in the service
        const statusCode = error.status || 500;

        if (statusCode === 429) {
            return res.status(429).json({ error: 'Rate limit exceeded for Adzuna API. Please try again later.' });
        } else if (statusCode === 400) {
            return res.status(400).json({ error: 'Invalid request to Adzuna API.' });
        } else if (statusCode === 401 || statusCode === 403) {
            return res.status(500).json({ error: 'Job market service configuration error.' });
        }

        // Generic error response
        res.status(500).json({ error: 'Failed to retrieve job market insights' });
    }
};
