// Builder Enhancements

// Certifications
function addCertification(){var rd={...App.resumeData};if(!rd.certifications)rd.certifications=[];rd.certifications.push({name:'',issuer:'',year:''});updateState({resumeData:rd})}
function removeCertification(i){var rd={...App.resumeData};rd.certifications.splice(i,1);updateState({resumeData:rd})}
function updateCertification(i,f,v){var rd={...App.resumeData};rd.certifications[i][f]=v;updateState({resumeData:rd})}

// Projects
function addProject(){var rd={...App.resumeData};if(!rd.projects)rd.projects=[];rd.projects.push({name:'',description:''});updateState({resumeData:rd})}
function removeProject(i){var rd={...App.resumeData};rd.projects.splice(i,1);updateState({resumeData:rd})}
function updateProject(i,f,v){var rd={...App.resumeData};rd.projects[i][f]=v;updateState({resumeData:rd})}

// Languages
function addLanguage(){var rd={...App.resumeData};if(!rd.languages)rd.languages=[];rd.languages.push({name:'',proficiency:''});updateState({resumeData:rd})}
function removeLanguage(i){var rd={...App.resumeData};rd.languages.splice(i,1);updateState({resumeData:rd})}
function updateLanguage(i,f,v){var rd={...App.resumeData};rd.languages[i][f]=v;updateState({resumeData:rd})}

// Builder Tools

function duplicateResume(){var rd=JSON.parse(JSON.stringify(App.resumeData));rd.personal.fullName=(rd.personal.fullName||'Resume')+' (Copy)';updateState({resumeData:rd});showSuccess('Resume duplicated!')}
function renameResume(){var n=prompt('Enter new resume name:',App.resumeData.personal.fullName||'My Resume');if(n){var rd={...App.resumeData};rd.personal.fullName=n;updateState({resumeData:rd});showSuccess('Resume renamed!')}}
function undoLastChange(){if(versionHistory.length>0){App.resumeData=versionHistory.pop();saveToStorage();refreshView();showSuccess('Undo successful!')}else{showError('Nothing to undo.')}}
function addCertification(){var rd={...App.resumeData};if(!rd.certifications)rd.certifications=[];rd.certifications.push({name:'',issuer:'',year:''});updateState({resumeData:rd})}
function removeCertification(i){var rd={...App.resumeData};rd.certifications.splice(i,1);updateState({resumeData:rd})}
function updateCertification(i,f,v){var rd={...App.resumeData};rd.certifications[i][f]=v;updateState({resumeData:rd})}
function addLanguage(){var rd={...App.resumeData};if(!rd.languages)rd.languages=[];rd.languages.push({name:'',proficiency:''});updateState({resumeData:rd})}
function removeLanguage(i){var rd={...App.resumeData};rd.languages.splice(i,1);updateState({resumeData:rd})}
function updateLanguage(i,f,v){var rd={...App.resumeData};rd.languages[i][f]=v;updateState({resumeData:rd})}
function addProject(){var rd={...App.resumeData};if(!rd.projects)rd.projects=[];rd.projects.push({name:'',description:'',url:'',tech:''});updateState({resumeData:rd})}
function removeProject(i){var rd={...App.resumeData};rd.projects.splice(i,1);updateState({resumeData:rd})}
function updateProject(i,f,v){var rd={...App.resumeData};rd.projects[i][f]=v;updateState({resumeData:rd})}
function clearResume(){if(!confirm('Delete ALL resume data? This cannot be undone.'))return;if(!confirm('Final confirmation: Clear everything?'))return;App.resumeData={personal:{fullName:'',email:'',phone:'',location:'',linkedin:''},summary:'',experience:[],education:[],skills:[],certifications:[],projects:[],languages:[],customSections:[]};saveToStorage();refreshView();showSuccess('Resume cleared! Start fresh.');navigate('builder')}

// Dark Mode
function toggleDarkMode(){var b=document.body;b.classList.toggle('dark');var t=document.getElementById('dark-toggle');if(b.classList.contains('dark')){t.textContent='☀️';localStorage.setItem('darkMode','1')}else{t.textContent='🌙';localStorage.setItem('darkMode','0')}}
if(window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches&&!localStorage.getItem('darkMode')){document.body.classList.add('dark');var t=document.getElementById('dark-toggle');if(t)t.textContent='☀️';localStorage.setItem('darkMode','1')}
setTimeout(function(){if(localStorage.getItem('darkMode')==='1'){document.body.classList.add('dark');var t=document.getElementById('dark-toggle');if(t)t.textContent='☀️'}},300);

function updateUserArea(){
  var a=document.getElementById('user-area');
  if(!a)return;
  if(currentUser&&userProfile){
    var n=App.resumeData.personal.fullName||userProfile.full_name||currentUser.email.split('@')[0];
    var plan=userProfile.plan||'free';
    var pc=plan==='free'?'bg-gray-100 text-gray-600':plan==='pro'?'bg-blue-100 text-blue-700':plan==='yearly'?'bg-purple-100 text-purple-700':plan==='jobhunt'?'bg-green-100 text-green-700':plan==='lifetime'?'bg-pink-100 text-pink-700':'bg-gray-100 text-gray-600';
    var planLabel=plan==='jobhunt'?'JOB HUNT':plan.toUpperCase();
    a.innerHTML='<div class="flex items-center gap-2"><span class="text-xs font-semibold '+pc+' px-2 py-1 rounded-full">'+planLabel+'</span><span class="text-sm font-semibold text-gray-700 hidden sm:inline">👤 '+n+'</span><button onclick="navigate(\'profile\')" class="w-8 h-8 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-sm hover:bg-brand-200 transition" title="Profile">'+(n.charAt(0).toUpperCase())+'</button><button onclick="logOut()" class="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-[9px] hover:bg-red-200 transition ml-1" title="Sign Out">Logout</button></div>';
  }else{
    a.innerHTML='<button onclick="navigate(\'signup\')" class="px-5 py-3 bg-blue-700 text-white font-black rounded-lg hover:bg-blue-800 transition text-base shadow-lg">Sign Up Free</button>';
  }
}
// Plan Badge
function updatePlanBadge(){var b=document.getElementById('plan-badge');var p=userProfile?(userProfile.plan||'free'):'free';if(!b){var n=document.querySelector('#navbar .flex.items-center.gap-2');if(n){b=document.createElement('span');b.id='plan-badge';b.style.cssText='font-size:10px;padding:2px 8px;border-radius:10px;font-weight:700;margin-left:4px';n.appendChild(b)}}if(b){if(p==='free'){b.textContent='FREE';b.style.background='#e5e7eb';b.style.color='#6b7280'}else if(p==='pro'){b.textContent='PRO';b.style.background='#dbeafe';b.style.color='#2563eb'}else if(p==='yearly'){b.textContent='ANNUAL';b.style.background='#ede9fe';b.style.color='#7c3aed'}else if(p==='jobhunt'){b.textContent='JOB HUNT';b.style.background='#d1fae5';b.style.color='#059669'}else if(p==='lifetime'){b.textContent='LIFETIME';b.style.background='#fce7f3';b.style.color='#db2777'}else{b.textContent='FREE';b.style.background='#e5e7eb';b.style.color='#6b7280'}}}

// Share Resume
function shareResume(){var d=App.resumeData;var json=btoa(unescape(encodeURIComponent(JSON.stringify(d))));if(!json){showError('Resume too large to share.');return}var url=window.location.origin+'?r='+encodeURIComponent(json).substring(0,2000);if(navigator.clipboard){navigator.clipboard.writeText(url).then(function(){showSuccess('Share link copied!')})}else{prompt('Copy link:',url)}}

function updateBenchmark(){var s=getCompositeScore();var m=document.getElementById('benchmark-msg');if(!m)return;var msg='';if(s>=80)msg='Your resume is in the Top 10%!';else if(s>=65)msg='Your resume scores higher than 75% of users';else if(s>=50)msg='Your resume is average.';else msg='Your resume needs work.';m.innerHTML='<div class=\"bg-white rounded-xl p-4 border shadow-sm text-center font-semibold\">Benchmark: '+msg+'</div>'}

function checkGrammar(){var text=App.resumeData.summary+' '+App.resumeData.experience.map(function(e){return e.bullets||''}).join(' ');var rules=[{p:/\bi\b/g,m:'Capitalize I'},{p:/\bteh\b/gi,m:'teh -> the'},{p:/\brecieve\b/gi,m:'recieve -> receive'},{p:/\bseperate\b/gi,m:'seperate -> separate'},{p:/\bdefinately\b/gi,m:'definately -> definitely'},{p:/\boccured\b/gi,m:'occured -> occurred'},{p:/\bacheive\b/gi,m:'acheive -> achieve'},{p:/\bbuisness\b/gi,m:'buisness -> business'},{p:/\bexpierence\b/gi,m:'expierence -> experience'}];var found=[];rules.forEach(function(r){if(r.p.test(text))found.push(r.m)});if(found.length>0)showError('Issues: '+found.slice(0,5).join(', '));else showSuccess('No issues found!')}

function updateTemplateBadge(){var b=document.getElementById('current-template-badge');if(b){var t=App.selectedTemplate;b.textContent='Template: '+t.charAt(0).toUpperCase()+t.slice(1)}}

async function tailorResume(){if(!currentUser||!canAccess('ai_targeting')){showError('Pro feature. Please upgrade.');return}var jd=App.jobTarget.description;if(!jd||jd.length<30){showError('Paste a job description in Dashboard first.');return}showLoader();try{var r=await fetch('/api/ai-analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jobDescription:jd,resumeData:truncateResumeForAI(App.resumeData),type:'tailor'})});var d=await r.json();hideLoader();if(d.success&&d.data&&!d.fallback){if(d.data.summary)App.resumeData.summary=d.data.summary;if(d.data.bullets){d.data.bullets.forEach(function(b,i){if(App.resumeData.experience[i]){if(typeof b==='string'){App.resumeData.experience[i].bullets=b}else if(b.bullet){App.resumeData.experience[i].bullets='• '+b.bullet}else if(b.description&&Array.isArray(b.description)){App.resumeData.experience[i].bullets=b.description.map(function(d){return'• '+d}).join('\n')}else if(b.title||b.description){App.resumeData.experience[i].bullets='• '+(b.title||'')+': '+(b.description||'')+(b.impact?' ['+b.impact+']':'')}else{App.resumeData.experience[i].bullets=JSON.stringify(b)}}})}saveToStorage();refreshView();showSuccess('Resume tailored! Review changes before exporting.');setTimeout(function(){if(!localStorage.getItem('interview_prompt_shown')){localStorage.setItem('interview_prompt_shown','true');var prompt=document.createElement('div');prompt.style.cssText='background:#fef3c7;border:1px solid #fde68a;border-radius:12px;padding:16px;margin-top:12px;text-align:center;';prompt.innerHTML='<p style="font-weight:600;color:#92400e;margin:0 0 8px;">Resume tailored! Ready for the interview?</p><p style="font-size:13px;color:#a16207;margin:0 0 12px;">Practice with AI-powered mock interviews based on your resume.</p><button onclick="showInterviewCoach()" style="padding:10px 20px;background:#f59e0b;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Practice Interview →</button>';var builderView=document.querySelector('#view-container');if(builderView)builderView.appendChild(prompt);}},1500);}else{hideLoader();parseAndMatch();saveToStorage();refreshView();showSuccess('Resume analyzed! (Local matching used)')}}catch(e){hideLoader();parseAndMatch();saveToStorage();refreshView();showSuccess('Resume analyzed! (Local matching used)')}}
function truncateResumeForAI(rd){var r=JSON.parse(JSON.stringify(rd));if(r.experience){r.experience=r.experience.slice(0,3);r.experience.forEach(function(e){if(e.bullets){var bl=e.bullets.toString().split('\n').slice(0,3);e.bullets=bl.join('\n')}})}if(r.skills)r.skills=r.skills.slice(0,10);if(r.summary)r.summary=r.summary.substring(0,500);return r}
function abTestResume(){if(!currentUser||!sbClient){showError('Please login first');return}if(!enforceResumeLimit())return;var name=prompt('Name this version (e.g., "Original" or "Creative Style"):',(App.resumeData.personal.fullName||'Resume')+' v1');if(!name)return;showLoader();sbClient.from('resumes').upsert({user_id:currentUser.id,title:name,resume_data:App.resumeData,template:App.selectedTemplate,updated_at:new Date().toISOString()}).then(function(){hideLoader();showSuccess('Version saved! You can compare versions in My Resumes.');navigate('my-resumes')}).catch(function(){hideLoader();showError('Save failed.')})}

function analyzeSkillGap(){if(!canAccess('ai_targeting')){showError('Pro feature. Please upgrade.');return}var jd=App.jobTarget.description;;if(!jd||jd.length<30){showError('Paste a job description in Dashboard first.');return}var skills=App.resumeData.skills.map(function(s){return s.toLowerCase()});var industrySkills={tech:['python','java','javascript','react','aws','docker','sql','git','agile','rest api'],healthcare:['patient care','hipaa','clinical','ehr','medical','diagnostics','nursing'],finance:['financial analysis','risk management','accounting','auditing','compliance','budgeting','forecasting'],hr:['recruitment','onboarding','employee relations','payroll','hris','performance management'],marketing:['seo','sem','social media','content marketing','analytics','campaign management'],operations:['logistics','supply chain','procurement','inventory','lean','six sigma']};var industry='tech';Object.keys(industrySkills).forEach(function(k){industrySkills[k].forEach(function(s){if(jd.toLowerCase().includes(s))industry=k})});var missing=industrySkills[industry].filter(function(s){return!skills.includes(s)});if(missing.length>0){showError('Missing '+industry+' skills: '+missing.slice(0,8).join(', ')+'. Add these to improve your match!')}else{showSuccess('Great! You have all key '+industry+' skills!')}}