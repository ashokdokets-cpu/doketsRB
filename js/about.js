// About Us Page
if (typeof Views !== 'undefined') {
  Views['about'] = function() {
    return `
    <div class="max-w-3xl mx-auto px-4 py-12 animate-fade-in prose">
      <h1 class="text-3xl font-heading font-extrabold mb-6">About Dokets Resume Builder</h1>
      <p class="text-lg text-gray-700 mb-4">Dokets Resume Builder is an AI-powered platform designed to help job seekers build ATS-optimized resumes that get noticed by recruiters and pass through automated screening systems.</p>
      
      <h2 class="text-xl font-bold mt-8 mb-3">Our Mission</h2>
      <p class="text-gray-700 mb-4">We believe everyone deserves a fair shot at their dream job. Our AI tools level the playing field by helping candidates create professional, keyword-optimized resumes tailored to specific job descriptions — in minutes, not hours.</p>
      
      <h2 class="text-xl font-bold mt-8 mb-3">Why Choose Dokets?</h2>
      <div class="grid sm:grid-cols-2 gap-4 mt-4">
        <div class="bg-blue-50 rounded-xl p-4">
          <h3 class="font-bold text-blue-700">🤖 AI-Powered</h3>
          <p class="text-sm text-gray-600">Multi-AI engine  rewrites your resume for every job application.</p>
        </div>
        <div class="bg-green-50 rounded-xl p-4">
          <h3 class="font-bold text-green-700">📊 ATS-Optimized</h3>
          <p class="text-sm text-gray-600">Built-in ATS checker scores your resume against real applicant tracking systems.</p>
        </div>
        <div class="bg-purple-50 rounded-xl p-4">
          <h3 class="font-bold text-purple-700">🎨 12 Templates</h3>
          <p class="text-sm text-gray-600">Professionally designed templates for every industry and career level.</p>
        </div>
        <div class="bg-amber-50 rounded-xl p-4">
          <h3 class="font-bold text-amber-700">🔒 Privacy First</h3>
          <p class="text-sm text-gray-600">Your data is encrypted. We never share your information with third parties.</p>
        </div>
      </div>
      
      <h2 class="text-xl font-bold mt-8 mb-3">Part of the Dokets Ecosystem</h2>
      <p class="text-gray-700 mb-4">Dokets Resume Builder is part of the Dokets family of products, which includes <a href="https://dokets.com" class="text-blue-600 hover:underline">Dokets.com</a> and <a href="https://dokets.shop" class="text-blue-600 hover:underline">Dokets.shop</a>. Our mission is to build tools that empower professionals worldwide.</p>
    </div>`;
  };
}
