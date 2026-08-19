// Contact Page
if (typeof Views !== 'undefined') {
  Views['contact'] = function() {
    return `
    <div class="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <h1 class="text-3xl font-heading font-extrabold mb-6">Contact Us</h1>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl p-6 border">
          <h3 class="font-bold text-lg mb-3">📧 Email Us</h3>
          <p class="text-gray-700 mb-2">For general inquiries, support, or sales:</p>
          <a href="mailto:contact@dokets.com" class="text-blue-600 font-semibold text-lg hover:underline">contact@dokets.com</a>
          <p class="text-sm text-gray-500 mt-3">We typically respond within 24 hours.</p>
        </div>
        
        <div class="bg-white rounded-xl p-6 border">
          <h3 class="font-bold text-lg mb-3">💼 Enterprise Sales</h3>
          <p class="text-gray-700 mb-2">Interested in our Enterprise plan? Reach out to our sales team:</p>
          <a href="mailto:contact@dokets.com?subject=Enterprise%20Plan%20Inquiry" class="text-blue-600 font-semibold text-lg hover:underline">contact@dokets.com</a>
          <p class="text-sm text-gray-500 mt-3">Subject: Enterprise Plan Inquiry</p>
        </div>
        
        <div class="bg-white rounded-xl p-6 border">
          <h3 class="font-bold text-lg mb-3">🛠️ Technical Support</h3>
          <p class="text-gray-700 mb-2">Facing an issue? Let us help:</p>
          <a href="mailto:contact@dokets.com?subject=Technical%20Support" class="text-blue-600 font-semibold text-lg hover:underline">contact@dokets.com</a>
          <p class="text-sm text-gray-500 mt-3">Subject: Technical Support</p>
        </div>
        
        <div class="bg-white rounded-xl p-6 border">
          <h3 class="font-bold text-lg mb-3">🌐 Our Websites</h3>
          <div class="space-y-2">
            <a href="https://dokets.com" target="_blank" class="block text-blue-600 hover:underline">Dokets.com</a>
            <a href="https://dokets.shop" target="_blank" class="block text-blue-600 hover:underline">Dokets.shop</a>
            <a href="https://doketsrb.com" class="block text-blue-600 hover:underline">Doketsrb.com</a>
          </div>
        </div>
      </div>
    </div>`;
  };
}