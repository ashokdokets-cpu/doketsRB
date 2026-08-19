var fs = require('fs');
var path = require('path');
var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// ============================================
// 1. ADD CERTIFICATIONS, PROJECTS, LANGUAGES to App.resumeData
// ============================================
html = html.replace(
    "skills: [],",
    "skills: [],\n            certifications: [],\n            projects: [],\n            languages: [],\n            customSections: [],"
);

// ============================================
// 2. ADD CERTIFICATIONS SECTION IN BUILDER (after Education div)
// ============================================
var certSection = `
                <div class="bg-white rounded-xl p-4 border shadow-sm"><div class="flex justify-between mb-2"><h3 class="font-bold text-sm"><i data-lucide="award" class="w-4 h-4 text-brand-600 inline mr-1"></i> Certifications</h3><button onclick="addCertification();navigate('builder')" class="text-xs bg-brand-100 text-brand-700 px-3 py-1.5 rounded-lg font-semibold">+ Add</button></div>\${rd.certifications&&rd.certifications.length>0?rd.certifications.map((c,i)=>'<div class="bg-gray-50 rounded-lg p-3 border mb-2"><div class="flex justify-between"><input value="'+(c.name||'')+'" onchange="updateCertification('+i+',\\'name\\',this.value)" placeholder="Certification Name" class="font-semibold text-sm bg-transparent border-none outline-none flex-1"><button onclick="removeCertification('+i+');navigate(\\'builder\\')" class="text-danger"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div><input value="'+(c.issuer||'')+'" onchange="updateCertification('+i+',\\'issuer\\',this.value)" placeholder="Issuing Organization" class="text-xs px-2 py-1 border rounded bg-white w-full mt-1"><input value="'+(c.year||'')+'" onchange="updateCertification('+i+',\\'year\\',this.value)" placeholder="Year" class="text-xs px-2 py-1 border rounded bg-white w-full mt-1"></div>').join(''):'<p class="text-sm text-gray-800 text-center py-4">No certifications added yet.</p>'}</div>
`;

html = html.replace('</div>\n                <div class="bg-white rounded-xl p-4 border shadow-sm"><h3 class="font-bold text-sm mb-2"><i data-lucide="zap"', 
    certSection + '\n                <div class="bg-white rounded-xl p-4 border shadow-sm"><h3 class="font-bold text-sm mb-2"><i data-lucide="zap"');

// ============================================
// 3. ADD PROJECTS SECTION (after Certifications)
// ============================================
var projSection = `
                <div class="bg-white rounded-xl p-4 border shadow-sm"><div class="flex justify-between mb-2"><h3 class="font-bold text-sm"><i data-lucide="folder-git" class="w-4 h-4 text-brand-600 inline mr-1"></i> Projects</h3><button onclick="addProject();navigate('builder')" class="text-xs bg-brand-100 text-brand-700 px-3 py-1.5 rounded-lg font-semibold">+ Add</button></div>\${rd.projects&&rd.projects.length>0?rd.projects.map((p,i)=>'<div class="bg-gray-50 rounded-lg p-3 border mb-2"><div class="flex justify-between"><input value="'+(p.name||'')+'" onchange="updateProject('+i+',\\'name\\',this.value)" placeholder="Project Name" class="font-semibold text-sm bg-transparent border-none outline-none flex-1"><button onclick="removeProject('+i+');navigate(\\'builder\\')" class="text-danger"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div><textarea rows="2" onchange="updateProject('+i+',\\'description\\',this.value)" placeholder="Project description..." class="text-xs px-2 py-1 border rounded bg-white w-full mt-1 resize-none">'+(p.description||'')+'</textarea></div>').join(''):'<p class="text-sm text-gray-800 text-center py-4">No projects added yet.</p>'}</div>
`;

html = html.replace('</div>\n                <div class="bg-white rounded-xl p-4 border shadow-sm"><h3 class="font-bold text-sm mb-2"><i data-lucide="zap"',
    projSection + '\n                <div class="bg-white rounded-xl p-4 border shadow-sm"><h3 class="font-bold text-sm mb-2"><i data-lucide="zap"');

// ============================================
// 4. ADD LANGUAGES SECTION (after Projects)
// ============================================
var langSection = `
                <div class="bg-white rounded-xl p-4 border shadow-sm"><div class="flex justify-between mb-2"><h3 class="font-bold text-sm"><i data-lucide="globe" class="w-4 h-4 text-brand-600 inline mr-1"></i> Languages</h3><button onclick="addLanguage();navigate('builder')" class="text-xs bg-brand-100 text-brand-700 px-3 py-1.5 rounded-lg font-semibold">+ Add</button></div>\${rd.languages&&rd.languages.length>0?rd.languages.map((l,i)=>'<div class="bg-gray-50 rounded-lg p-3 border mb-2"><div class="flex justify-between"><input value="'+(l.name||'')+'" onchange="updateLanguage('+i+',\\'name\\',this.value)" placeholder="Language" class="font-semibold text-sm bg-transparent border-none outline-none flex-1"><button onclick="removeLanguage('+i+');navigate(\\'builder\\')" class="text-danger"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div><select onchange="updateLanguage('+i+',\\'proficiency\\',this.value)" class="text-xs px-2 py-1 border rounded bg-white w-full mt-1"><option value="">Select Proficiency</option><option '+(l.proficiency===\\'Native\\'?\\'selected\\':\\'\\')+' value="Native">Native</option><option '+(l.proficiency===\\'Fluent\\'?\\'selected\\':\\'\\')+' value="Fluent">Fluent</option><option '+(l.proficiency===\\'Advanced\\'?\\'selected\\':\\'\\')+' value="Advanced">Advanced</option><option '+(l.proficiency===\\'Intermediate\\'?\\'selected\\':\\'\\')+' value="Intermediate">Intermediate</option></select></div>').join(''):'<p class="text-sm text-gray-800 text-center py-4">No languages added yet.</p>'}</div>
`;

html = html.replace('</div>\n                <div class="bg-white rounded-xl p-4 border shadow-sm"><h3 class="font-bold text-sm mb-2"><i data-lucide="zap"',
    langSection + '\n                <div class="bg-white rounded-xl p-4 border shadow-sm"><h3 class="font-bold text-sm mb-2"><i data-lucide="zap"');

// ============================================
// 5. ADD CUSTOM SECTIONS (after Languages)
// ============================================
var customSection = `
                <div class="bg-white rounded-xl p-4 border shadow-sm"><div class="flex justify-between mb-2"><h3 class="font-bold text-sm"><i data-lucide="plus-circle" class="w-4 h-4 text-brand-600 inline mr-1"></i> Custom Sections</h3><button onclick="addCustomSection();navigate('builder')" class="text-xs bg-brand-100 text-brand-700 px-3 py-1.5 rounded-lg font-semibold">+ Add</button></div>\${rd.customSections&&rd.customSections.length>0?rd.customSections.map((s,i)=>'<div class="bg-gray-50 rounded-lg p-3 border mb-2"><div class="flex justify-between"><input value="'+(s.title||'')+'" onchange="updateCustomSection('+i+',\\'title\\',this.value)" placeholder="Section Title" class="font-semibold text-sm bg-transparent border-none outline-none flex-1"><button onclick="removeCustomSection('+i+');navigate(\\'builder\\')" class="text-danger"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div><textarea rows="2" onchange="updateCustomSection('+i+',\\'content\\',this.value)" placeholder="Section content..." class="text-xs px-2 py-1 border rounded bg-white w-full mt-1 resize-none">'+(s.content||'')+'</textarea></div>').join(''):'<p class="text-sm text-gray-800 text-center py-4">No custom sections added yet.</p>'}</div>
`;

html = html.replace('</div>\n                <div class="bg-white rounded-xl p-4 border shadow-sm"><h3 class="font-bold text-sm mb-2"><i data-lucide="zap"',
    customSection + '\n                <div class="bg-white rounded-xl p-4 border shadow-sm"><h3 class="font-bold text-sm mb-2"><i data-lucide="zap"');

// ============================================
// 6. ADD HELPER FUNCTIONS (before function navigate)
// ============================================
var helperFunctions = `
function addCertification(){var rd={...App.resumeData};if(!rd.certifications)rd.certifications=[];rd.certifications.push({name:'',issuer:'',year:''});updateState({resumeData:rd})}
function removeCertification(i){var rd={...App.resumeData};rd.certifications.splice(i,1);updateState({resumeData:rd})}
function updateCertification(i,f,v){var rd={...App.resumeData};rd.certifications[i][f]=v;updateState({resumeData:rd})}
function addProject(){var rd={...App.resumeData};if(!rd.projects)rd.projects=[];rd.projects.push({name:'',description:''});updateState({resumeData:rd})}
function removeProject(i){var rd={...App.resumeData};rd.projects.splice(i,1);updateState({resumeData:rd})}
function updateProject(i,f,v){var rd={...App.resumeData};rd.projects[i][f]=v;updateState({resumeData:rd})}
function addLanguage(){var rd={...App.resumeData};if(!rd.languages)rd.languages=[];rd.languages.push({name:'',proficiency:''});updateState({resumeData:rd})}
function removeLanguage(i){var rd={...App.resumeData};rd.languages.splice(i,1);updateState({resumeData:rd})}
function updateLanguage(i,f,v){var rd={...App.resumeData};rd.languages[i][f]=v;updateState({resumeData:rd})}
function addCustomSection(){var rd={...App.resumeData};if(!rd.customSections)rd.customSections=[];rd.customSections.push({title:'',content:''});updateState({resumeData:rd})}
function removeCustomSection(i){var rd={...App.resumeData};rd.customSections.splice(i,1);updateState({resumeData:rd})}
function updateCustomSection(i,f,v){var rd={...App.resumeData};rd.customSections[i][f]=v;updateState({resumeData:rd})}
function duplicateResume(){if(!enforceResumeLimit())return;var rd={...App.resumeData};rd.personal={...rd.personal,fullName:rd.personal.fullName+' (Copy)'};updateState({resumeData:rd});App.resumesCreated++;saveToStorage();showSuccess('Resume duplicated! Rename it to customize.')}
function renameResume(){var n=prompt('Enter new resume name:',App.resumeData.personal.fullName||'My Resume');if(n){var rd={...App.resumeData};rd.personal.fullName=n;updateState({resumeData:rd});showSuccess('Resume renamed!')}}
var versionHistory=[];
function undoLastChange(){if(versionHistory.length>0){var prev=versionHistory.pop();App.resumeData=prev;saveToStorage();refreshView();showSuccess('Undo successful!')}else{showError('Nothing to undo.')}}
`;

html = html.replace('\n    function navigate(view){', helperFunctions + '\n    function navigate(view){');

// ============================================
// 7. ADD VERSION TRACKING TO updateState
// ============================================
html = html.replace(
    'function updateState(changes) {\n        Object.assign(App, changes);\n        saveToStorage();\n        refreshView();\n    }',
    'function updateState(changes) {\n        versionHistory.push(JSON.parse(JSON.stringify(App.resumeData)));\n        if(versionHistory.length>20)versionHistory.shift();\n        Object.assign(App, changes);\n        saveToStorage();\n        refreshView();\n    }'
);

// ============================================
// 8. ADD BUTTONS TO BUILDER HEADER (Duplicate, Rename, Undo)
// ============================================
var builderButtons = `
<button onclick="duplicateResume()" class="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-semibold text-xs">📋 Duplicate</button>
<button onclick="renameResume()" class="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition font-semibold text-xs">✏️ Rename</button>
<button onclick="undoLastChange()" class="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-xs">↩ Undo</button>
`;

html = html.replace('← Dashboard</button><button onclick="exportPDF()"',
    '← Dashboard</button>' + builderButtons + '<button onclick="exportPDF()"');

// ============================================
// 9. UPDATE RESUME PREVIEW TO SHOW NEW SECTIONS
// ============================================
var previewExtras = `
if(rd.certifications&&rd.certifications.length>0){h+='<div class="section"><h2 style="color:'+accent+';">Certifications</h2>';rd.certifications.forEach(c=>{h+='<div style="margin-bottom:6px;"><h3>'+(c.name||'Certification')+'</h3><p>'+(c.issuer||'')+(c.year?' • '+c.year:'')+'</p></div>';});h+='</div>';}
if(rd.projects&&rd.projects.length>0){h+='<div class="section"><h2 style="color:'+accent+';">Projects</h2>';rd.projects.forEach(p=>{h+='<div style="margin-bottom:6px;"><h3>'+(p.name||'Project')+'</h3><p>'+(p.description||'')+'</p></div>';});h+='</div>';}
if(rd.languages&&rd.languages.length>0){h+='<div class="section"><h2 style="color:'+accent+';">Languages</h2><p>'+rd.languages.map(l=>l.name+(l.proficiency?' ('+l.proficiency+')':'')).join(' • ')+'</p></div>';}
if(rd.customSections&&rd.customSections.length>0){rd.customSections.forEach(s=>{h+='<div class="section"><h2 style="color:'+accent+';">'+s.title+'</h2><p>'+s.content+'</p></div>';});}
`;

html = html.replace("if(rd.skills.length>0)h+=`<div class=\"section\"><h2 style=\"color:${accent};\">Skills</h2><p>${rd.skills.join(' • ')}</p></div>`;",
    previewExtras + "\n        if(rd.skills.length>0)h+=`<div class=\"section\"><h2 style=\"color:${accent};\">Skills</h2><p>${rd.skills.join(' • ')}</p></div>`;");

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('✅ Builder enhanced with 9 features!');
console.log('1. Certifications section');
console.log('2. Projects section');
console.log('3. Languages section');
console.log('4. Custom sections');
console.log('5. Duplicate resume');
console.log('6. Rename resume');
console.log('7. Undo/Version history');
console.log('8. New sections in preview');
console.log('9. Builder header buttons');