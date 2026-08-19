// GPA Converter
// Converts between GPA scales and percentage systems

const gpaConverter = {
  // 10-point to 4-point
  from10to4: function(gpa) {
    if (gpa >= 9.0) return 4.0;
    if (gpa >= 8.0) return 3.7;
    if (gpa >= 7.0) return 3.3;
    if (gpa >= 6.0) return 3.0;
    if (gpa >= 5.0) return 2.7;
    if (gpa >= 4.0) return 2.0;
    return 1.0;
  },

  // Percentage to 4-point
  fromPercentTo4: function(pct) {
    if (pct >= 90) return 4.0;
    if (pct >= 85) return 3.7;
    if (pct >= 80) return 3.3;
    if (pct >= 75) return 3.0;
    if (pct >= 70) return 2.7;
    if (pct >= 65) return 2.3;
    if (pct >= 60) return 2.0;
    return 1.0;
  },

  // 4-point to percentage
  from4toPercent: function(gpa) {
    if (gpa >= 4.0) return '95-100';
    if (gpa >= 3.7) return '90-94';
    if (gpa >= 3.3) return '85-89';
    if (gpa >= 3.0) return '80-84';
    if (gpa >= 2.7) return '75-79';
    if (gpa >= 2.3) return '70-74';
    if (gpa >= 2.0) return '60-69';
    return 'Below 60';
  },

  // UK Class to GPA
  fromUKClass: function(ukClass) {
    var c = ukClass.toLowerCase();
    if (c.includes('first') || c.includes('1st')) return 4.0;
    if (c.includes('upper') || c.includes('2:1') || c.includes('2.1')) return 3.3;
    if (c.includes('lower') || c.includes('2:2') || c.includes('2.2')) return 2.7;
    if (c.includes('third') || c.includes('3rd')) return 2.0;
    return null;
  }
};

function showGPAConverter() {
  var existing = document.getElementById('gpa-modal');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'gpa-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

  modal.innerHTML = `
    <div style="background:white;border-radius:16px;padding:24px;max-width:450px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h2 style="font-size:1.3rem;font-weight:700;">GPA Converter</h2>
        <button onclick="document.getElementById('gpa-modal').remove()" 
                style="background:none;border:none;font-size:1.5rem;cursor:pointer;">✕</button>
      </div>
      
      <div style="margin-bottom:16px;">
        <label style="font-size:0.85rem;font-weight:600;">Convert from:</label>
        <select id="gpa-from" onchange="gpaConvert()" 
                style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-top:4px;">
          <option value="10to4">10-Point Scale → 4-Point</option>
          <option value="percent">Percentage → 4-Point</option>
          <option value="4topct">4-Point → Percentage</option>
          <option value="uk">UK Class → 4-Point</option>
        </select>
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:0.85rem;font-weight:600;">Enter value:</label>
        <input id="gpa-input" type="text" placeholder="e.g., 8.5" onkeyup="gpaConvert()"
               style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-top:4px;font-size:1.1rem;">
      </div>

      <div id="gpa-result" style="padding:16px;background:#f9fafb;border-radius:12px;text-align:center;min-height:60px;display:flex;align-items:center;justify-content:center;">
        <span style="color:#9ca3af;font-size:0.9rem;">Enter a value to convert</span>
      </div>

      <div style="margin-top:12px;font-size:0.75rem;color:#6b7280;text-align:center;">
        Common scales supported: India (10-pt), US (4-pt), UK (Class), Percentage
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function gpaConvert() {
  var from = document.getElementById('gpa-from').value;
  var input = parseFloat(document.getElementById('gpa-input').value);
  var resultDiv = document.getElementById('gpa-result');
  
  if (isNaN(input)) {
    resultDiv.innerHTML = '<span style="color:#9ca3af;">Enter a numeric value</span>';
    return;
  }

  var result;
  var label;

  if (from === '10to4') {
    result = gpaConverter.from10to4(input);
    label = input + ' (10-pt) = <b>' + result.toFixed(1) + ' (4-pt)</b>';
  } else if (from === 'percent') {
    result = gpaConverter.fromPercentTo4(input);
    label = input + '% = <b>' + result.toFixed(1) + ' (4-pt)</b>';
  } else if (from === '4topct') {
    result = gpaConverter.from4toPercent(input);
    label = input + ' (4-pt) ≈ <b>' + result + '%</b>';
  } else if (from === 'uk') {
    result = gpaConverter.fromUKClass(document.getElementById('gpa-input').value);
    label = result ? '"' + document.getElementById('gpa-input').value + '" = <b>' + result.toFixed(1) + ' (4-pt)</b>' : '<span style="color:#ef4444;">Enter First, Upper Second (2:1), Lower Second (2:2), or Third</span>';
  }

  resultDiv.innerHTML = '<span style="font-size:1.3rem;">' + label + '</span>';
}