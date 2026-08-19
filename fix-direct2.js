const fs = require('fs');
let c = fs.readFileSync('js/currency-loader.js', 'utf8');

// Replace the fetch call with DIRECT Supabase REST call
const oldFetch = `fetch('/api/v1')
      .then(function(response) { return response.json(); })
      .then(function(data) {
        if (!data.success || !data.currencies || data.currencies.length === 0) {
          console.log('No new currencies from API');
          return;
        }
        
        // Store globally
        window.supabaseCurrencies = data.currencies;`;

const newFetch = `var SUPABASE_URL = 'https://arszgttojohsmzjiemgh.supabase.co';
    var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyc3pndHRvam9oc216amllbWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MTYwNTksImV4cCI6MjA5MzI5MjA1OX0.0Y6kM8cg0fERxlM0xTZu6AFzenfVY-USoNm6mJeg-dM';
    
    fetch(SUPABASE_URL + '/rest/v1/currencies?select=*&is_active=eq.true&order=display_order.asc', {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
      }
    })
      .then(function(response) { return response.json(); })
      .then(function(data) {
        if (!data || data.length === 0) {
          console.log('No new currencies from Supabase');
          return;
        }
        
        // Store globally
        window.supabaseCurrencies = data;`;

if (c.includes(oldFetch)) {
    c = c.replace(oldFetch, newFetch);
    fs.writeFileSync('js/currency-loader.js', c, 'utf8');
    console.log('SUCCESS: Loader now fetches DIRECTLY from Supabase!');
} else {
    console.log('Pattern not found - checking current fetch URL');
    if (c.includes('/api/v1')) {
        c = c.replace('/api/v1', SUPABASE_URL + '/rest/v1/currencies?select=*&is_active=eq.true&order=display_order.asc');
        fs.writeFileSync('js/currency-loader.js', c, 'utf8');
        console.log('SUCCESS: Simple replacement done!');
    }
}
