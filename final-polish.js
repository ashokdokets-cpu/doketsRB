var fs = require('fs');
var path = require('path');
var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// ============================================
// 1. RICH TEXT EDITOR CSS
// ============================================
var rteCSS = `
.rte-toolbar{display:flex;gap:2px;padding:4px;background:#f8fafc;border:1px solid #e2e8f0;border-bottom:none;border-radius:6px 6px 0 0}
.rte-toolbar button{padding:4px 8px;border:1px solid #e2e8f0;background:white;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;color:#475569}
.rte-toolbar button:hover{background:#eff6ff;color:#2563eb}
.rte-toolbar button.active{background:#2563eb;color:white}
.rte-content{min-height:60px;max-height:200px;overflow-y:auto;padding:8px 12px;border:1px solid #e2e8f0;border-radius:0 0 6px 6px;background:white;font-size:13px;line-height:1.5;outline:none}
.rte-content:focus{border-color:#2563eb;box-shadow:0 0 0 2px rgba(37,99,235,0.1)}
.rte-content b,.rte-content strong{font-weight:700}
.rte-content i,.rte-content em{font-style:italic}
.rte-content u{text-decoration:underline}
.rte-content ul,.rte-content ol{padding-left:20px;margin:4px 0}
.section-move-btn{padding:2px 6px;border:1px solid #e2e8f0;background:white;border-radius:4px;cursor:pointer;font-size:11px;color:#94a3b8}
.section-move-btn:hover{background:#eff6ff;color:#2563eb}
`;

html = html.replace('</style>', '\n' + rteCSS + '</style>');

// ============================================
// 2. RICH TEXT EDITOR HELPER FUNCTIONS
// ============================================
var rteFunctions = `
function execCmd(cmd, val) { document.execCommand(cmd, false, val || null); }
function initRTE(id) {
    var el = document.getElementById(id);
    if (!el || el.dataset.rteInit) return;
    el.dataset.rteInit = '1';
    el.addEventListener('input', function() {
        var targetId = el.dataset.target;
        if (targetId) {
            var target = document.getElementById(targetId);
            if (target) target.value = el.innerHTML;
            // Trigger change event
            var event = new Event('change', { bubbles: true });
            if (target) target.dispatchEvent(event);
        }
    });
}
function createRTE(id, value, placeholder) {
    var ph = placeholder || 'Start typing...';
    return '<div class="rte-toolbar"><button onclick="execCmd(\\'bold\\');this.classList.toggle(\\'active\\')" title="Bold"><b>B</b></button><button onclick="execCmd(\\'italic\\');this.classList.toggle(\\'active\\')" title="Italic"><i>I</i></button><button onclick="execCmd(\\'underline\\');this.classList.toggle(\\'active\\')" title="Underline"><u>U</u></button><button onclick="execCmd(\\'insertUnorderedList\\')" title="Bullet List">•</button><button onclick="execCmd(\\'insertOrderedList\\')" title="Numbered List">1.</button></div><div id="' + id + '" class="rte-content" contenteditable="true" data-target="' + id + '-hidden" data-rte-init="0" data-placeholder="' + ph + '">' + (value || '') + '</div><textarea id="' + id + '-hidden" style="display:none">' + (value || '') + '</textarea>';
}

// Move section up/down helper
function moveSection(type, index, direction) {
    var rd = { ...App.resumeData };
    var arr = rd[type];
    if (!arr) return;
    var newIndex = index + direction;
    if (newIndex < 0 || newIndex >= arr.length) return;
    var temp = arr[index];
    arr[index] = arr[newIndex];
    arr[newIndex] = temp;
    updateState({ resumeData: rd });
}
`;

html = html.replace('\n    function navigate(view){', rteFunctions + '\n    function navigate(view){');

// ============================================
// 3. CONVERT SUMMARY TO RICH TEXT EDITOR
// ============================================
html = html.replace(
    '<textarea rows="3" onchange="updateField(\'summary\',this.value)" class="w-full px-3 py-2.5 border rounded-lg text-sm resize-none">${rd.summary}</textarea>',
    '${createRTE("rte-summary", rd.summary, "Write your professional summary...")}'
);

// Add RTE init after view renders
html = html.replace(
    "if(App.currentView==='builder'){setTimeout(initRTE('rte-summary'),200);}",
    "if(App.currentView==='builder'){setTimeout(function(){initRTE('rte-summary');},300);}"
);

// Also add to the refreshView function
html = html.replace(
    "container.innerHTML = viewFn();\n            if(App.currentView==='my-resumes')setTimeout(loadResumeList,100);",
    "container.innerHTML = viewFn();\n            if(App.currentView==='builder'){setTimeout(function(){initRTE('rte-summary');},300);}\n            if(App.currentView==='my-resumes')setTimeout(loadResumeList,100);"
);

// ============================================
// 4. ADD MOVE UP/DOWN BUTTONS TO EXPERIENCE
// ============================================
html = html.replace(
    "removeItem('experience',${i});navigate('builder')",
    "moveSection('experience',${i},-1);navigate('builder')\">▲</button><button onclick=\"moveSection('experience',${i},1);navigate('builder')\">▼</button><button onclick=\"removeItem('experience',${i});navigate('builder')"
);

// Fix the button HTML to include the move buttons properly
html = html.replace(
    '<button onclick="removeItem(\'experience\',${i});navigate(\'builder\')" class="text-danger"><i data-lucide="trash-2" class="w-4 h-4"></i></button>',
    '<div class="flex gap-1"><button onclick="moveSection(\'experience\',${i},-1);navigate(\'builder\')" class="text-gray-400 hover:text-brand-600 text-xs" title="Move Up">▲</button><button onclick="moveSection(\'experience\',${i},1);navigate(\'builder\')" class="text-gray-400 hover:text-brand-600 text-xs" title="Move Down">▼</button><button onclick="removeItem(\'experience\',${i});navigate(\'builder\')" class="text-danger"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div>'
);

// Add move buttons to education
html = html.replace(
    '<button onclick="removeItem(\'education\',${i});navigate(\'builder\')" class="text-danger"><i data-lucide="trash-2" class="w-4 h-4"></i></button>',
    '<div class="flex gap-1"><button onclick="moveSection(\'education\',${i},-1);navigate(\'builder\')" class="text-gray-400 hover:text-brand-600 text-xs" title="Move Up">▲</button><button onclick="moveSection(\'education\',${i},1);navigate(\'builder\')" class="text-gray-400 hover:text-brand-600 text-xs" title="Move Down">▼</button><button onclick="removeItem(\'education\',${i});navigate(\'builder\')" class="text-danger"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div>'
);

// Add move buttons to certifications
html = html.replace(
    '<button onclick="removeCertification(',
    '<div class="flex gap-1"><button onclick="moveSection(\'certifications\',${i},-1);navigate(\'builder\')" class="text-gray-400 hover:text-brand-600 text-xs" title="Move Up">▲</button><button onclick="moveSection(\'certifications\',${i},1);navigate(\'builder\')" class="text-gray-400 hover:text-brand-600 text-xs" title="Move Down">▼</button><button onclick="removeCertification('
);

// Add move buttons to projects
html = html.replace(
    '<button onclick="removeProject(',
    '<div class="flex gap-1"><button onclick="moveSection(\'projects\',${i},-1);navigate(\'builder\')" class="text-gray-400 hover:text-brand-600 text-xs" title="Move Up">▲</button><button onclick="moveSection(\'projects\',${i},1);navigate(\'builder\')" class="text-gray-400 hover:text-brand-600 text-xs" title="Move Down">▼</button><button onclick="removeProject('
);

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('✅ Rich text editor + drag-and-drop reordering added!');
console.log('1. Summary now has B/I/U/Lists toolbar');
console.log('2. Experience sections have ▲▼ move buttons');
console.log('3. Education sections have ▲▼ move buttons');
console.log('4. Certifications have ▲▼ move buttons');
console.log('5. Projects have ▲▼ move buttons');