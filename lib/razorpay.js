var Razorpay = require('razorpay');

var razorpayInstance = null;

function getRazorpay() {
    if (razorpayInstance) return razorpayInstance;
    razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    return razorpayInstance;
}

var PLANS = {
    pro: {
        INR: { amount: 49900, currency: 'INR' },
        USD: { amount: 1499, currency: 'USD' },
        EUR: { amount: 1399, currency: 'EUR' },
        GBP: { amount: 1199, currency: 'GBP' },
        CAD: { amount: 1999, currency: 'CAD' },
        AUD: { amount: 2199, currency: 'AUD' },
        SGD: { amount: 1799, currency: 'SGD' }
    },
    yearly: {
        INR: { amount: 399900, currency: 'INR' },
        USD: { amount: 9900, currency: 'USD' },
        EUR: { amount: 8900, currency: 'EUR' },
        GBP: { amount: 7900, currency: 'GBP' },
        CAD: { amount: 15992, currency: 'CAD' },
        AUD: { amount: 17592, currency: 'AUD' },
        SGD: { amount: 14392, currency: 'SGD' }
    },
    lifetime: {
        INR: { amount: 999900, currency: 'INR' },
        USD: { amount: 14900, currency: 'USD' },
        EUR: { amount: 13900, currency: 'EUR' },
        GBP: { amount: 11900, currency: 'GBP' },
        CAD: { amount: 23988, currency: 'CAD' },
        AUD: { amount: 26388, currency: 'AUD' },
        SGD: { amount: 21588, currency: 'SGD' }
    }
};

function getPlanDetails(plan, currency) {
    if (!PLANS[plan]) throw new Error('Invalid plan: ' + plan);
    var cur = currency || 'INR';
    if (!PLANS[plan][cur]) throw new Error('Currency not available: ' + cur);
    return PLANS[plan][cur];
}

module.exports = { getRazorpay: getRazorpay, getPlanDetails: getPlanDetails };