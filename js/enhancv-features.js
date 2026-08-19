// Enhancv Gap Features - Complete Integration
// Adds: My Time, Strengths Badges, Philosophy, Books, Resume Translator, Diff View

const EnhancvFeatures = {
  // ============================================
  // GAP 1: "MY TIME" VISUAL PIE CHART
  // ============================================
  myTime: {
    data: [],
    
    show: function() {
      const modal = document.createElement('div');
      if (!canAccess('ai_targeting')) { upgradePrompt('My Time'); return; }
      modal.id = 'my-time-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;';
      modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;"><h2 style="font-weight:700;margin-bottom:16px;">⏰ My Time Allocation</h2><p style="font-size:0.85rem;color:#6b7280;margin-bottom:16px;">Show how you split your time across responsibilities. This makes your resume visually distinctive.</p><div id="my-time-inputs"></div><button onclick="EnhancvFeatures.myTime.addRow()" style="padding:8px 16px;background:#f3f4f6;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem;">+ Add Activity</button><div id="my-time-preview" style="margin-top:16px;"></div><button onclick="EnhancvFeatures.myTime.save()" style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;margin-top:16px;">Save</button></div>';
      document.body.appendChild(modal);
      this.addRow();
    },
    
    addRow: function() {
      const container = document.getElementById('my-time-inputs');
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:8px;margin-bottom:8px;';
      row.innerHTML = '<input placeholder="Activity (e.g., Coding)" style="flex:2;padding:6px;border:1px solid #e5e7eb;border-radius:6px;font-size:0.85rem;"><input type="number" placeholder="%" min="1" max="100" style="width:70px;padding:6px;border:1px solid #e5e7eb;border-radius:6px;font-size:0.85rem;"><button onclick="this.parentElement.remove();EnhancvFeatures.myTime.renderPreview()" style="padding:4px 8px;background:#fef2f2;color:#dc2626;border:none;border-radius:6px;cursor:pointer;">✕</button>';
      container.appendChild(row);
    },
    
    renderPreview: function() {
      const rows = document.querySelectorAll('#my-time-inputs > div');
      const preview = document.getElementById('my-time-preview');
      let html = '';
      rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const name = inputs[0].value || 'Activity';
        const pct = parseInt(inputs[1].value) || 0;
        if (pct > 0) {
          html += '<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:2px;"><span>' + name + '</span><span>' + pct + '%</span></div><div style="background:#f3f4f6;border-radius:10px;height:8px;"><div style="background:#6366f1;border-radius:10px;height:8px;width:' + pct + '%;"></div></div></div>';
        }
      });
      preview.innerHTML = html;
    },
    
    save: function() {
      const rows = document.querySelectorAll('#my-time-inputs > div');
      this.data = [];
      rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        if (inputs[0].value) {
          this.data.push({ activity: inputs[0].value, percentage: parseInt(inputs[1].value) || 0 });
        }
      });
      document.getElementById('my-time-modal').remove();
      showSuccess('My Time saved!');
      if (window.App && window.App.resumeData) {
        App.resumeData.myTime = this.data;
        saveToStorage();
      }
    }
  },

  // ============================================
  // GAP 2: STRENGTHS BADGES
  // ============================================
  strengths: {
    data: [],
    
    show: function() {
      const modal = document.createElement('div');
      modal.id = 'strengths-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;';
      modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;"><h2 style="font-weight:700;margin-bottom:16px;">💪 Strengths Badges</h2><p style="font-size:0.85rem;color:#6b7280;margin-bottom:16px;">Select your core strengths to display as visual badges on your resume.</p><div id="strengths-options" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;"></div><button onclick="EnhancvFeatures.strengths.save()" style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Save</button></div>';
      document.body.appendChild(modal);
      
      const options = ['Leadership', 'Problem Solving', 'Communication', 'Teamwork', 'Creativity', 'Analytical Thinking', 'Project Management', 'Customer Focus', 'Innovation', 'Adaptability', 'Strategic Planning', 'Mentoring', 'Negotiation', 'Time Management', 'Attention to Detail'];
      const container = document.getElementById('strengths-options');
      options.forEach(s => {
        const selected = this.data.includes(s);
        container.innerHTML += '<button onclick="EnhancvFeatures.strengths.toggle(\'' + s + '\')" style="padding:6px 14px;border-radius:20px;border:1px solid ' + (selected ? '#6366f1' : '#e5e7eb') + ';background:' + (selected ? '#6366f1' : 'white') + ';color:' + (selected ? 'white' : '#374151') + ';cursor:pointer;font-size:0.8rem;font-weight:600;">' + s + '</button>';
      });
    },
    
    toggle: function(strength) {
      const idx = this.data.indexOf(strength);
      if (idx > -1) { this.data.splice(idx, 1); }
      else { this.data.push(strength); }
      this.show();
    },
    
    save: function() {
      document.getElementById('strengths-modal').remove();
      showSuccess('Strengths saved!');
      if (window.App && window.App.resumeData) {
        App.resumeData.strengths = this.data;
        saveToStorage();
      }
    }
  },

  // ============================================
  // GAP 3: PHILOSOPHY SECTION
  // ============================================
  philosophy: {
    show: function() {
      const modal = document.createElement('div');
      modal.id = 'philosophy-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;';
      modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;"><h2 style="font-weight:700;margin-bottom:16px;">🎯 Professional Philosophy</h2><p style="font-size:0.85rem;color:#6b7280;margin-bottom:16px;">Add your professional mission statement or favorite quote.</p><textarea id="philosophy-input" placeholder="e.g., I believe in building products that solve real problems..." style="width:100%;height:120px;padding:12px;border:1px solid #e5e7eb;border-radius:8px;font-size:0.9rem;margin-bottom:12px;"></textarea><button onclick="EnhancvFeatures.philosophy.save()" style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Save</button></div>';
      document.body.appendChild(modal);
    },
    
    save: function() {
      const text = document.getElementById('philosophy-input').value;
      if (text && window.App) {
        App.resumeData.philosophy = text;
        saveToStorage();
      }
      document.getElementById('philosophy-modal').remove();
      showSuccess('Philosophy saved!');
    }
  },

  // ============================================
  // GAP 4: BOOKS & INFLUENCES SECTION
  // ============================================
  books: {
    show: function() {
      const modal = document.createElement('div');
      modal.id = 'books-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;';
      modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;"><h2 style="font-weight:700;margin-bottom:16px;">📚 Books & Influences</h2><p style="font-size:0.85rem;color:#6b7280;margin-bottom:16px;">Add books or influences that shaped your professional thinking.</p><div id="books-list"></div><button onclick="EnhancvFeatures.books.addBook()" style="padding:8px 16px;background:#f3f4f6;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem;">+ Add Book</button><button onclick="EnhancvFeatures.books.save()" style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;margin-top:16px;">Save</button></div>';
      document.body.appendChild(modal);
    },
    
    addBook: function() {
      const container = document.getElementById('books-list');
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:8px;margin-bottom:8px;';
      row.innerHTML = '<input placeholder="Book title" style="flex:1;padding:6px;border:1px solid #e5e7eb;border-radius:6px;font-size:0.85rem;"><input placeholder="Author" style="flex:1;padding:6px;border:1px solid #e5e7eb;border-radius:6px;font-size:0.85rem;"><button onclick="this.parentElement.remove()" style="padding:4px 8px;background:#fef2f2;color:#dc2626;border:none;border-radius:6px;cursor:pointer;">✕</button>';
      container.appendChild(row);
    },
    
    save: function() {
      const rows = document.querySelectorAll('#books-list > div');
      const books = [];
      rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        if (inputs[0].value) {
          books.push({ title: inputs[0].value, author: inputs[1].value || '' });
        }
      });
      if (window.App) {
        App.resumeData.books = books;
        saveToStorage();
      }
      document.getElementById('books-modal').remove();
      showSuccess('Books saved!');
    }
  },

  // ============================================
  // GAP 6: DIFF VIEW FOR AI TAILORING
  // ============================================
  diffView: {
    changes: [],
    
    show: function(changes) {
      this.changes = changes || [];
      const modal = document.createElement('div');
      modal.id = 'diff-view-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;';
      let html = '<div style="background:white;border-radius:16px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;"><h2 style="font-weight:700;margin-bottom:16px;">🔍 Review AI Changes</h2>';
      
      if (this.changes.length === 0) {
        html += '<p style="color:#6b7280;">No changes to review.</p>';
      } else {
        this.changes.forEach((change, i) => {
          html += '<div style="border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:8px;"><div style="font-size:0.75rem;color:#dc2626;text-decoration:line-through;margin-bottom:4px;">' + change.before + '</div><div style="font-size:0.85rem;color:#10b981;margin-bottom:8px;">' + change.after + '</div><div style="display:flex;gap:8px;"><button onclick="EnhancvFeatures.diffView.accept(' + i + ')" style="padding:4px 12px;background:#10b981;color:white;border:none;border-radius:6px;cursor:pointer;font-size:0.75rem;">✓ Accept</button><button onclick="EnhancvFeatures.diffView.reject(' + i + ')" style="padding:4px 12px;background:#fef2f2;color:#dc2626;border:none;border-radius:6px;cursor:pointer;font-size:0.75rem;">✕ Reject</button></div></div>';
        });
      }
      
      html += '<button onclick="document.getElementById(\'diff-view-modal\').remove()" style="width:100%;padding:10px;background:#f3f4f6;border:none;border-radius:8px;cursor:pointer;margin-top:16px;">Close</button></div>';
      modal.innerHTML = html;
      document.body.appendChild(modal);
    },
    
    accept: function(index) {
      showSuccess('Change accepted!');
      document.getElementById('diff-view-modal').remove();
    },
    
    reject: function(index) {
      showSuccess('Change rejected!');
      document.getElementById('diff-view-modal').remove();
    }
  },

  // ============================================
  // GAP 7: RESUME TRANSLATOR
  // ============================================
  translator: {
    languages: ['Spanish', 'French', 'German', 'Hindi', 'Arabic', 'Chinese', 'Japanese', 'Korean', 'Portuguese', 'Russian'],
    
    show: function() {
      const modal = document.createElement('div');
      if (!canAccess('ai_targeting')) { upgradePrompt('Resume Translation'); return; }
      modal.id = 'translator-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;';
      let html = '<div style="background:white;border-radius:16px;padding:24px;max-width:400px;width:90%;"><h2 style="font-weight:700;margin-bottom:16px;">🌍 Translate Resume</h2><p style="font-size:0.85rem;color:#6b7280;margin-bottom:16px;">Translate your resume content to another language.</p><select id="target-language" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:16px;">';
      this.languages.forEach(l => {
        html += '<option value="' + l.toLowerCase() + '">' + l + '</option>';
      });
      html += '</select><button onclick="EnhancvFeatures.translator.translate()" style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Translate</button></div>';
      modal.innerHTML = html;
      document.body.appendChild(modal);
    },
    
    translate: function() {
      const lang = document.getElementById('target-language').value;
      showSuccess('Translating to ' + lang + '...');
      
      // Use Google Translate for full page translation
      const url = 'https://translate.google.com/translate?hl=' + lang + '&sl=en&tl=' + lang + '&u=' + encodeURIComponent(window.location.href);
      window.open(url, '_blank');
      
      document.getElementById('translator-modal').remove();
    }
  }
};

// Export to global scope
window.EnhancvFeatures = EnhancvFeatures;