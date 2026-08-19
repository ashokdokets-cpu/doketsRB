// FAQs Page
if (typeof Views !== 'undefined') {
  Views['faq'] = function() {
    return `
    <div class="max-w-3xl mx-auto px-4 py-12 animate-fade-in prose">
      <h1 class="text-3xl font-heading font-extrabold mb-6">Frequently Asked Questions</h1>
      
      <div class="space-y-6">
        <div class="bg-white rounded-xl p-5 border">
          <h3 class="font-bold text-lg">Is Dokets Resume Builder free?</h3>
          <p class="text-gray-700 mt-2">Yes! Our Free plan includes 1 resume, 3 templates, 5 AI suggestions per day, and PDF export. Upgrade to Pro for unlimited resumes, all 12 templates, and unlimited AI usage.</p>
        </div>
        
        <div class="bg-white rounded-xl p-5 border">
          <h3 class="font-bold text-lg">How does the AI resume tailoring work?</h3>
          <p class="text-gray-700 mt-2">Paste a job description, click "AI Tailor", and our AI engine  rewrites your resume to match the job requirements — including keywords, skills, and bullet points.</p>
        </div>
        
        <div class="bg-white rounded-xl p-5 border">
          <h3 class="font-bold text-lg">What file formats can I upload?</h3>
          <p class="text-gray-700 mt-2">You can upload PDF, DOCX, XLS, XLSX, CSV files, or LinkedIn data exports (ZIP). You can also connect your LinkedIn account or paste LinkedIn JSON data directly.</p>
        </div>
        
        <div class="bg-white rounded-xl p-5 border">
          <h3 class="font-bold text-lg">Is my data secure?</h3>
          <p class="text-gray-700 mt-2">Absolutely. Your resume data is encrypted and stored securely on Supabase with row-level security. Payment information is processed by Razorpay and PayPal — we never store your card details.</p>
        </div>
        
        <div class="bg-white rounded-xl p-5 border">
          <h3 class="font-bold text-lg">Can I cancel my subscription?</h3>
          <p class="text-gray-700 mt-2">Yes, you can cancel anytime. We offer a 7-day money-back guarantee on all paid plans. Contact us at contact@dokets.com for refund requests.</p>
        </div>
        
        <div class="bg-white rounded-xl p-5 border">
          <h3 class="font-bold text-lg">What payment methods do you accept?</h3>
          <p class="text-gray-700 mt-2">We accept Razorpay (for INR, EUR, GBP, AUD, SGD) and PayPal (for USD, CAD). All transactions are secure and encrypted.</p>
        </div>
        
        <div class="bg-white rounded-xl p-5 border">
          <h3 class="font-bold text-lg">Do you offer enterprise plans?</h3>
          <p class="text-gray-700 mt-2">Yes! Our Enterprise plan includes API access (50K calls/month), white-label branding, SSO integration, batch processing, and a dedicated account manager. Contact Sales for more information.</p>
        </div>
        
        <div class="bg-white rounded-xl p-5 border">
          <h3 class="font-bold text-lg">How do I import my LinkedIn profile?</h3>
          <p class="text-gray-700 mt-2">You have four options: (1) LinkedIn OAuth Connect for quick name/email import, (2) LinkedIn Export to upload your data ZIP file, (3) LinkedIn+ JSON to paste your profile data, or (4) Upload Resume for PDF/DOCX files.</p>
        </div>
      </div>
    </div>`;
  };
}
