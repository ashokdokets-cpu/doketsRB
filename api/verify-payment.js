// Vercel Serverless Function - Razorpay Payment Verification
const crypto = require('crypto');

export default async function handler(req, res) {
    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, plan } = req.body;

        // Validate required fields
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required payment information' 
            });
        }

        // Get your Razorpay Key Secret from environment variables
        const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
        
        if (!RAZORPAY_KEY_SECRET) {
            console.error('RAZORPAY_KEY_SECRET not configured');
            return res.status(500).json({ 
                success: false, 
                error: 'Payment verification not configured' 
            });
        }

        // Verify the payment signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Payment is verified - in production, you would:
            // 1. Save payment details to database
            // 2. Activate user's premium account
            // 3. Send confirmation email
            
            console.log(`✅ Payment verified: ${razorpay_payment_id} for ${plan} plan`);
            
            return res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                payment_id: razorpay_payment_id,
                plan: plan,
                activated: true
            });
        } else {
            console.warn(`❌ Signature mismatch for payment: ${razorpay_payment_id}`);
            return res.status(400).json({
                success: false,
                error: 'Payment verification failed - invalid signature'
            });
        }

    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal verification error'
        });
    }
}