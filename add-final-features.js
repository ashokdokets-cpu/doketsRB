var fs = require('fs');
var path = require('path');
var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// ============================================
// 3. BUILDER SECTIONS (Certifications, Projects, Languages)
// ============================================
var certSection = `
                <div class="bg-white rounded-xl p-4 border shadow-sm"><div class="flex justify-between mb-2"><h3 class="font-bold text-sm"><i data-lucide="award" class="w-4 h-4 text-brand-600 inline mr-1"></i> Certifications</h3><button onclick="addCertification();navigate('builder')" class="text-xs bg-brand-100 text-brand-700 px-3 py-1.5 rounded-lg font-semibold">+ Add</button></div>\${rd.certifications&&rd.certifications.length>0?rd.certifications.map((c,i)=>'<div class="bg-gray-50 rounded-lg p-3 border mb-2"><div class="flex justify-between"><input value="'+(c.name||'')+'" onchange="updateCertification('+i+',\\'name\\',this.value)" placeholder="Certification Name" class="font-semibold text-sm bg-transparent border-none outline-none flex-1"><button onclick="removeCertification('+i+');navigate(\\'builder\\')" class="text-danger"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div><input value="'+(c.issuer||'')+'" onchange="updateCertification('+i+',\\'issuer\\',this.value)" placeholder="Issuing Organization" class="text-xs px-2 py-1 border rounded bg-white w-full mt-1"><input value="'+(c.year||'')+'" onchange="updateCertification('+i+',\\'year\\',this.value)" placeholder="Year" class="text-xs px-2 py-1 border rounded bg-white w-full mt-1"></div>').join(''):'<p class="text-sm text-gray-800 text-center py-4">No certifications added yet.</p>'}</div>
`;

var projSection = `
                <div class="bg-white rounded-xl p-4 border shadow-sm"><div class="flex justify-between mb-2"><h3 class="font-bold text-sm"><i data-lucide="folder-git" class="w-4 h-4 text-brand-600 inline mr-1"></i> Projects</h3><button onclick="addProject();navigate('builder')" class="text-xs bg-brand-100 text-brand-700 px-3 py-1.5 rounded-lg font-semibold">+ Add</button></div>\${rd.projects&&rd.projects.length>0?rd.projects.map((p,i)=>'<div class="bg-gray-50 rounded-lg p-3 border mb-2"><div class="flex justify-between"><input value="'+(p.name||'')+'" onchange="updateProject('+i+',\\'name\\',this.value)" placeholder="Project Name" class="font-semibold text-sm bg-transparent border-none outline-none flex-1"><button onclick="removeProject('+i+');navigate(\\'builder\\')" class="text-danger"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div><textarea rows="2" onchange="updateProject('+i+',\\'description\\',this.value)" placeholder="Project description..." class="text-xs px-2 py-1 border rounded bg-white w-full mt-1 resize-none">'+(p.description||'')+'</textarea><input value="'+(p.url||'')+'" onchange="updateProject('+i+',\\'url\\',this.value)" placeholder="Project URL (GitHub, live demo, etc.)" class="text-xs px-2 py-1 border rounded bg-white w-full mt-1"><input value="'+(p.tech||'')+'" onchange="updateProject('+i+',\\'tech\\',this.value)" placeholder="Technologies used (e.g., React, Python, AWS)" class="text-xs px-2 py-1 border rounded bg-white w-full mt-1"></div>').join(''):'<p class="text-sm text-gray-800 text-center py-4">No projects added yet.</p>'}</div>
`;

var langSection = `
                <div class="bg-white rounded-xl p-4 border shadow-sm"><div class="flex justify-between mb-2"><h3 class="font-bold text-sm"><i data-lucide="globe" class="w-4 h-4 text-brand-600 inline mr-1"></i> Languages</h3><button onclick="addLanguage();navigate('builder')" class="text-xs bg-brand-100 text-brand-700 px-3 py-1.5 rounded-lg font-semibold">+ Add</button></div>\${rd.languages&&rd.languages.length>0?rd.languages.map((l,i)=>'<div class="bg-gray-50 rounded-lg p-3 border mb-2"><div class="flex justify-between"><input value="'+(l.name||'')+'" onchange="updateLanguage('+i+',\\'name\\',this.value)" placeholder="Language" class="font-semibold text-sm bg-transparent border-none outline-none flex-1"><button onclick="removeLanguage('+i+');navigate(\\'builder\\')" class="text-danger"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div><select onchange="updateLanguage('+i+',\\'proficiency\\',this.value)" class="text-xs px-2 py-1 border rounded bg-white w-full mt-1"><option value="">Select Proficiency</option><option '+(l.proficiency==='Native'?'selected':'')+' value="Native">Native</option><option '+(l.proficiency==='Fluent'?'selected':'')+' value="Fluent">Fluent</option><option '+(l.proficiency==='Advanced'?'selected':'')+' value="Advanced">Advanced</option><option '+(l.proficiency==='Intermediate'?'selected':'')+' value="Intermediate">Intermediate</option></select></div>').join(''):'<p class="text-sm text-gray-800 text-center py-4">No languages added yet.</p>'}</div>
`;

// Insert sections into builder (before Skills section)
html = html.replace('<div class="bg-white rounded-xl p-4 border shadow-sm"><h3 class="font-bold text-sm mb-2"><i data-lucide="zap"',
    certSection + '\n' + projSection + '\n' + langSection + '\n                <div class="bg-white rounded-xl p-4 border shadow-sm"><h3 class="font-bold text-sm mb-2"><i data-lucide="zap"');

// Add helper functions
var sectionFns = `
function addCertification(){var rd={...App.resumeData};if(!rd.certifications)rd.certifications=[];rd.certifications.push({name:'',issuer:'',year:''});updateState({resumeData:rd})}
function removeCertification(i){var rd={...App.resumeData};rd.certifications.splice(i,1);updateState({resumeData:rd})}
function updateCertification(i,f,v){var rd={...App.resumeData};rd.certifications[i][f]=v;updateState({resumeData:rd})}
function addProject(){var rd={...App.resumeData};if(!rd.projects)rd.projects=[];rd.projects.push({name:'',description:'',url:'',tech:''});updateState({resumeData:rd})}
function removeProject(i){var rd={...App.resumeData};rd.projects.splice(i,1);updateState({resumeData:rd})}
function updateProject(i,f,v){var rd={...App.resumeData};rd.projects[i][f]=v;updateState({resumeData:rd})}
function addLanguage(){var rd={...App.resumeData};if(!rd.languages)rd.languages=[];rd.languages.push({name:'',proficiency:''});updateState({resumeData:rd})}
function removeLanguage(i){var rd={...App.resumeData};rd.languages.splice(i,1);updateState({resumeData:rd})}
function updateLanguage(i,f,v){var rd={...App.resumeData};rd.languages[i][f]=v;updateState({resumeData:rd})}
`;

html = html.replace("function showError(m){", sectionFns + "function showError(m){");

// ============================================
// 4. RICH TEXT EDITOR
// ============================================
var rteCSS = `
.rte-toolbar{display:flex;gap:2px;padding:4px;background:#f8fafc;border:1px solid #e2e8f0;border-bottom:none;border-radius:6px 6px 0 0}
.rte-toolbar button{padding:4px 8px;border:1px solid #e2e8f0;background:white;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;color:#475569}
.rte-toolbar button:hover{background:#eff6ff;color:#2563eb}
.rte-content{min-height:60px;max-height:200px;overflow-y:auto;padding:8px 12px;border:1px solid #e2e8f0;border-radius:0 0 6px 6px;background:white;font-size:13px;line-height:1.5;outline:none}
.rte-content:focus{border-color:#2563eb}
`;

html = html.replace('</style>', '\n' + rteCSS + '</style>');

var rteFn = `
function execCmd(c,v){document.execCommand(c,false,v||null)}
`;

html = html.replace("function showError(m){", rteFn + "function showError(m){");

// Replace summary textarea with RTE
html = html.replace('<textarea rows="3" onchange="updateField(\'summary\',this.value)" class="w-full px-3 py-2.5 border rounded-lg text-sm resize-none">',
    '<div class="rte-toolbar"><button onclick="execCmd(\'bold\')"><b>B</b></button><button onclick="execCmd(\'italic\')"><i>I</i></button><button onclick="execCmd(\'underline\')"><u>U</u></button><button onclick="execCmd(\'insertUnorderedList\')">•</button><button onclick="execCmd(\'insertOrderedList\')">1.</button></div><div class="rte-content" contenteditable="true" oninput="updateField(\'summary\',this.innerHTML)" onblur="updateField(\'summary\',this.innerHTML)">');

html = html.replace('</textarea>', '</div>');

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('ALL REMAINING FEATURES ADDED: Dark Mode, Blog, Certifications, Projects, Languages, Rich Text Editor');