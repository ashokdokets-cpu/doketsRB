const health = require('./health');
const createOrder = require('./create-order');
const verifyPayment = require('./verify-payment');
const linkedinExchange = require('./linkedin-exchange');
const razorpayWebhook = require('./webhook/razorpay');
const createPayPalOrder = require('./create-paypal-order');
const capturePayPalOrder = require('./capture-paypal-order');
const aiAnalyze = require('./ai-analyze');
const fetchJob = require('./fetch-job');
const status = require('./status');

const routes = {
    '/api/health': health,
    '/api/create-order': createOrder,
    '/api/verify-payment': verifyPayment,
    '/api/linkedin-exchange': linkedinExchange,
    '/api/webhook/razorpay': razorpayWebhook,
    '/api/create-paypal-order': createPayPalOrder,
    '/api/capture-paypal-order': capturePayPalOrder,
    '/api/ai-analyze': aiAnalyze,
    '/api/fetch-job': fetchJob,
    '/api/status': status,
};

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    var url = new URL(req.url, 'http://' + req.headers.host);
    var handler = routes[url.pathname];

    if (handler) {
        try {
            return await handler(req, res);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }

    return res.status(404).json({ error: 'Not Found', path: url.pathname });
};