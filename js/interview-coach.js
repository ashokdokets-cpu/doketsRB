// AI Interview Coach
// Mock interviews with AI feedback based on real resume data

const InterviewCoach = {
  questionBank: {
    general: [
      "Tell me about yourself.",
      "Why do you want to work here?",
      "What are your strengths?",
      "What are your weaknesses?",
      "Where do you see yourself in 5 years?",
      "Why should we hire you?",
      "Tell me about a challenge you overcame.",
      "How do you handle pressure?",
      "Describe your leadership style.",
      "What's your greatest achievement?"
    ],
    technical: [
      "Explain a complex technical concept to a non-technical person.",
      "How do you stay updated with industry trends?",
      "Describe a project where you used data to make a decision.",
      "How do you handle disagreements with team members?",
      "What's your experience with agile methodology?"
    ],
    behavioral: [
      "Tell me about a time you failed.",
      "Describe a conflict with a coworker and how you resolved it.",
      "Give an example of a goal you achieved.",
      "How do you prioritize tasks?",
      "Tell me about a time you went above and beyond."
    ]
  },

  generateQuestions: function(resumeData, jobDescription) {
    var questions = [];
    var jd = (jobDescription || '').toLowerCase();
    var rd = resumeData || {};
    var skills = (rd.skills || []).map(function(s) { return s.toLowerCase(); });
    var experience = rd.experience || [];
    var education = rd.education || [];
    var summary = (rd.summary || '').toLowerCase();

    // 1. SKILL-BASED QUESTIONS (from actual resume skills)
    if (skills.length > 0) {
      var topSkills = skills.slice(0, 3);
      if (topSkills.length > 0) {
        questions.push("I see " + topSkills.join(', ') + " on your resume. Can you tell me about a project where you used " + topSkills[0] + "?");
      }
      if (topSkills.length > 1) {
        questions.push("Between " + topSkills[0] + " and " + topSkills[1] + ", which are you stronger in and why?");
      }
      if (skills.length >= 5) {
        questions.push("You've listed " + skills.length + " skills. How do you keep all of them sharp?");
      }
    }

    // 2. EXPERIENCE-BASED QUESTIONS (from real work history)
    if (experience.length > 0) {
      var recentJob = experience[0];
      if (recentJob.title && recentJob.company) {
        questions.push("Tell me about your role as " + recentJob.title + " at " + recentJob.company + ". What was your biggest impact there?");
      }
      if (experience.length >= 2) {
        var prevJob = experience[1];
        if (prevJob.title) {
          questions.push("You moved from " + prevJob.title + " to " + (recentJob.title || 'your current role') + ". What motivated that transition?");
        }
      }
      if (experience.length >= 3) {
        questions.push("Of your " + experience.length + " roles, which taught you the most and why?");
      }
    }

    // 3. EDUCATION-BASED QUESTIONS
    if (education.length > 0 && education[0].degree) {
      questions.push("How did your " + education[0].degree + " prepare you for this role?");
    }

    // 4. JOB TARGET QUESTIONS
    if (jd.length > 20) {
      questions.push("Based on the job description, what do you think is the most important skill for this role?");
      questions.push("How does your background align with what we're looking for in this position?");
    }

    // 5. SUMMARY-BASED QUESTIONS
    if (summary.length > 50) {
      questions.push("Your summary mentions you're experienced in this field. What would you say sets you apart from other candidates?");
    }

    // 6. ROLE-SPECIFIC KEYWORD MATCHING (from original logic, enhanced)
    var allText = jd + ' ' + summary + ' ' + skills.join(' ');
    if (allText.includes('manager') || allText.includes('lead')) {
      questions.push("How do you motivate your team during tight deadlines?");
      questions.push("Describe a time you had to make a difficult decision as a leader.");
    }
    if (allText.includes('engineer') || allText.includes('developer') || allText.includes('software')) {
      questions.push("What's your approach to code review and ensuring quality?");
      questions.push("Tell me about the most complex technical problem you've solved.");
    }
    if (allText.includes('sales') || allText.includes('business development')) {
      questions.push("Walk me through how you handle a difficult prospect.");
      questions.push("What's your strategy for meeting quarterly targets?");
    }
    if (allText.includes('data') || allText.includes('analyst') || allText.includes('analytics')) {
      questions.push("Tell me about a time you used data to change a business decision.");
      questions.push("How do you ensure data accuracy in your work?");
    }

    // 7. Add general and behavioral questions to fill gaps
    questions = questions.concat(this.questionBank.behavioral.slice(0, 2));

    // 8. If we still have fewer than 5 questions, add general ones
    if (questions.length < 5) {
      questions = questions.concat(this.questionBank.general.slice(0, 3));
    }

    // Shuffle and return max 7
    return questions.sort(function(){ return Math.random() - 0.5; }).slice(0, 7);
  },

  analyze: function(question, answer, jobDescription) {
    var score = 50;
    var feedback = [];
    var tips = [];

    if (!answer || answer.length < 20) {
      return { score: 10, feedback: ['Answer too short.'], tips: ['Provide specific examples.', 'Use the STAR method.'] };
    }

    // Length check
    if (answer.length > 100) score += 15;
    if (answer.length > 200) score += 10;
    else feedback.push('Could be more detailed.');

    // STAR method check
    if (/\b(situation|task|action|result|led|managed|created|achieved|increased|reduced)\b/i.test(answer)) {
      score += 15;
      feedback.push('Good use of STAR method elements!');
    } else {
      tips.push('Use the STAR method: Situation, Task, Action, Result.');
    }

    // Metrics check
    if (/\d+%|\$\d+|\d+ (users|customers|clients|hours|days|team)/i.test(answer)) {
      score += 15;
      feedback.push('Great use of metrics!');
    } else {
      tips.push('Add numbers to quantify your achievements.');
    }

    // Confidence check
    if (/\b(we|our team|they)\b/i.test(answer) && !/\b(I |my |myself)\b/i.test(answer)) {
      tips.push('Use "I" more — own your achievements.');
    }

    score = Math.min(100, score);
    return { score: score, feedback: feedback, tips: tips };
  }
};

function showInterviewCoach() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }

  var existing = document.getElementById('interview-modal');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'interview-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:600px;width:90%;max-height:85vh;overflow-y:auto;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.3rem;font-weight:700;">🎤 AI Interview Coach</h2><button onclick="document.getElementById(\'interview-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">X</button></div><p style="font-size:0.85rem;color:#6b7280;margin-bottom:12px;">Personalized mock interviews based on YOUR resume and target job.</p><div id="interview-question" style="background:#f0fdf4;padding:16px;border-radius:10px;margin-bottom:12px;font-weight:600;font-size:1rem;color:#166534;">Click "Generate Question" to start.</div><textarea id="interview-answer" placeholder="Type your answer here... (use STAR method)" rows="4" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;resize:vertical;margin-bottom:12px;"></textarea><div id="interview-feedback" style="display:none;margin-bottom:12px;"></div><div style="display:flex;gap:8px;"><button onclick="generateInterviewQuestion()" style="flex:1;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Generate Question</button><button onclick="analyzeInterviewAnswer()" style="flex:1;padding:10px;background:#10b981;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Analyze Answer</button></div><button onclick="nextInterviewQuestion()" style="width:100%;padding:10px;background:#e5e7eb;color:#374151;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-top:8px;">Next Question →</button></div>';
  document.body.appendChild(modal);

  // Generate first question
  generateInterviewQuestion();
}

var currentQuestion = '';
var questionList = [];

function generateInterviewQuestion() {
  var jd = App.jobTarget?.description || '';
  questionList = InterviewCoach.generateQuestions(App.resumeData, jd);
  if (questionList.length === 0) {
    questionList = InterviewCoach.questionBank.general;
  }
  currentQuestion = questionList[0];
  document.getElementById('interview-question').textContent = 'Q: ' + currentQuestion;
  document.getElementById('interview-answer').value = '';
  document.getElementById('interview-feedback').style.display = 'none';
}

function analyzeInterviewAnswer() {
  var answer = document.getElementById('interview-answer').value;
  var jd = App.jobTarget?.description || '';
  var result = InterviewCoach.analyze(currentQuestion, answer, jd);

  var scoreColor = result.score >= 70 ? '#10b981' : result.score >= 40 ? '#f59e0b' : '#ef4444';
  var feedbackHTML = '<div style="text-align:center;margin-bottom:8px;"><span style="font-size:2rem;font-weight:800;color:'+scoreColor+';">'+result.score+'%</span></div>';

  if (result.feedback.length > 0) {
    feedbackHTML += '<div style="margin-bottom:6px;">'+result.feedback.map(function(f){ return '<div style="padding:6px 10px;background:#f0fdf4;border-radius:6px;font-size:0.8rem;margin-bottom:3px;color:#166534;">✅ '+f+'</div>'; }).join('')+'</div>';
  }
  if (result.tips.length > 0) {
    feedbackHTML += '<div>'+result.tips.map(function(t){ return '<div style="padding:6px 10px;background:#fffbeb;border-radius:6px;font-size:0.8rem;margin-bottom:3px;color:#92400e;">💡 '+t+'</div>'; }).join('')+'</div>';
  }

  document.getElementById('interview-feedback').innerHTML = feedbackHTML;
  document.getElementById('interview-feedback').style.display = 'block';
}

function nextInterviewQuestion() {
  if (questionList.length > 1) {
    questionList.shift();
    currentQuestion = questionList[0];
  } else {
    generateInterviewQuestion();
  }
  document.getElementById('interview-question').textContent = 'Q: ' + currentQuestion;
  document.getElementById('interview-answer').value = '';
  document.getElementById('interview-feedback').style.display = 'none';
}
function generateInterviewPrepReport() {
  if (!App.resumeData || !App.resumeData.personal?.fullName) {
    showError('Add resume content first to generate a report.');
    return;
  }

  var rd = App.resumeData;
  var jd = App.jobTarget?.description || '';
  var questions = InterviewCoach.generateQuestions(rd, jd);
  
  // Show loading modal
  var loadingModal = document.createElement('div');
  loadingModal.id = 'prep-report-loading';
  loadingModal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  loadingModal.innerHTML = '<div style="background:white;border-radius:12px;padding:32px;text-align:center;"><div style="width:40px;height:40px;border:3px solid #e5e7eb;border-top:3px solid #2563eb;border-radius:50%;margin:0 auto 16px;animation:spin 1s linear infinite;"></div><p style="color:#64748b;">Generating your interview prep report...</p></div>';
  document.body.appendChild(loadingModal);
  
  // Build base report HTML as a full page
  var reportHTML = '<html><head><title>Interview Prep Report - Dokets</title><style>body{font-family:Georgia,serif;max-width:800px;margin:0 auto;padding:40px;color:#1e293b;}h1{text-align:center;color:#1e293b;border-bottom:3px solid #2563eb;padding-bottom:12px;}h2{color:#2563eb;margin-top:30px;}ul{line-height:1.8;}.question-block{background:#f8fafc;padding:16px;border-radius:8px;margin-bottom:20px;}.question-block h3{color:#1e293b;margin:0 0 8px;}.answer-text{color:#334155;}.tip-text{color:#2563eb;font-size:12px;margin-top:8px;}@media print{body{padding:20px;}}</style></head><body>';
  reportHTML += '<h1>Interview Preparation Report</h1>';
  reportHTML += '<p style="text-align:center;color:#64748b;">Prepared for: <strong>' + (rd.personal.fullName || 'Candidate') + '</strong></p>';
  if (App.jobTarget?.title) reportHTML += '<p style="text-align:center;color:#64748b;">Target Role: <strong>' + App.jobTarget.title + '</strong></p>';
  reportHTML += '<p style="text-align:center;color:#94a3b8;font-size:12px;">Generated by Dokets Resume Builder</p>';
  
  // Key Strengths
  reportHTML += '<h2>Your Key Strengths</h2><ul>';
  if (rd.skills && rd.skills.length > 0) {
    rd.skills.slice(0,5).forEach(function(s) {
      reportHTML += '<li><strong>' + s + '</strong> — Be ready to give a specific example</li>';
    });
  }
  if (rd.experience && rd.experience.length > 0) {
    reportHTML += '<li><strong>' + rd.experience.length + ' roles</strong> — Prepare your career story arc</li>';
  }
  if (rd.summary && rd.summary.length > 50) {
    reportHTML += '<li><strong>Strong summary</strong> — Practice your 30-second elevator pitch</li>';
  }
  reportHTML += '</ul>';
  
  // Questions placeholder
  reportHTML += '<h2>Predicted Questions & Sample Answers</h2>';
  reportHTML += '<div id="report-questions-placeholder"></div>';
  reportHTML += '</body></html>';
  
  // Generate all answers
  var answerPromises = questions.map(function(q) {
    return generateSampleAnswer(q, rd);
  });
  
  Promise.all(answerPromises).then(function(answers) {
    var questionsHTML = '';
    questions.forEach(function(q, i) {
      questionsHTML += '<div class="question-block">';
      questionsHTML += '<h3>Q' + (i+1) + ': ' + q + '</h3>';
      questionsHTML += '<p class="answer-text">' + (answers[i] || 'Use the STAR method to structure your answer.') + '</p>';
      questionsHTML += '<p class="tip-text">💡 Tip: Personalize this with your own stories and metrics.</p>';
      questionsHTML += '</div>';
    });
    
    // Inject questions into report
    reportHTML = reportHTML.replace('<div id="report-questions-placeholder"></div>', questionsHTML);
    
    // Remove loading modal
    var loader = document.getElementById('prep-report-loading');
    if (loader) loader.remove();
    
    // Open in new window
    var w = window.open('', '_blank', 'width=900,height=700');
    w.document.write(reportHTML);
    w.document.close();
    
    // Add print button after window loads
    setTimeout(function() {
      w.document.body.insertAdjacentHTML('afterbegin', '<div style="text-align:center;padding:12px;background:#2563eb;color:white;margin-bottom:20px;border-radius:8px;"><button onclick="window.print()" style="padding:10px 24px;background:white;color:#2563eb;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:14px;">🖨️ Print / Save as PDF</button><span style="margin-left:12px;font-size:13px;">Or press Ctrl+P to save as PDF</span></div>');
    }, 500);
  }).catch(function(err) {
    console.log('Error generating report:', err);
    var loader = document.getElementById('prep-report-loading');
    if (loader) loader.remove();
    showError('Could not generate report. Please try again.');
  });
}

async function generateSampleAnswer(question, rd) {
  // Try AI first
  try {
    var prompt = 'You are an interview coach. Generate a personalized sample answer for this interview question: "' + question + '". Use the candidates actual resume data: ' + JSON.stringify(rd) + '. Keep it under 150 words. Use specific details from their experience. Write in first person.';
    
    var response = await fetch('/api/ai-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        jobDescription: question,
        resumeData: rd,
        type: 'interview-prep'
      })
    });
    
    var result = await response.json();
    if (result.success && result.data && !result.fallback) {
      var answer = result.data.summary || result.data.raw;
      if (answer && answer.length > 20) return answer;
    }
  } catch(e) {
    console.log('AI prep failed, using template');
  }
  
  // Fallback to templates
  var q = question.toLowerCase();
  var name = (rd.personal?.fullName || 'I').split(' ')[0];
  var recentRole = rd.experience?.[0]?.title || 'my previous role';
  var recentCompany = rd.experience?.[0]?.company || 'my previous company';
  var skills = (rd.skills || []).slice(0, 3).join(', ');
  
  if (q.includes('tell me about yourself')) {
    return name + ' have experience in this field, most recently as ' + recentRole + ' at ' + recentCompany + '. My key skills include ' + skills + '. I am looking for a role where I can apply these skills to drive results.';
  }
  if (q.includes('strength')) {
    return 'My greatest strength is my ability to ' + (rd.skills?.[0] || 'solve complex problems') + '. At ' + recentCompany + ', I used this to deliver measurable results.';
  }
  return 'Use the STAR method. Draw from your experience as ' + recentRole + ' at ' + recentCompany + '. Be specific with numbers and connect to the role.';
}

var codingQuestions = [];
var codingCurrentIndex = 0;
var codingAnswers = [];

function startCodingPractice() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }
  
  var jd = App.jobTarget?.description || '';
  var skills = App.resumeData?.skills || [];
  var languages = skills.filter(function(s) { 
    return ['python','java','javascript','c++','c#','typescript','go','rust','ruby','swift','kotlin'].includes(s.toLowerCase()); 
  });
  
  if (languages.length === 0) languages = ['Python', 'JavaScript'];
  
  showCodingModal();
  generateCodingQuestions(languages[0], jd);
}

function showCodingModal() {
  var existing = document.getElementById('coding-modal');
  if (existing) existing.remove();
  
  var modal = document.createElement('div');
  modal.id = 'coding-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;';
  
  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:650px;width:90%;max-height:85vh;overflow-y:auto;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.3rem;font-weight:700;">💻 Coding Practice</h2><button onclick="document.getElementById(\'coding-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">X</button></div><div id="coding-loading" style="text-align:center;padding:40px;"><p style="color:#64748b;">Generating coding challenges...</p><div style="width:40px;height:40px;border:3px solid #e5e7eb;border-top:3px solid #2563eb;border-radius:50%;margin:20px auto;animation:spin 1s linear infinite;"></div></div><div id="coding-content" style="display:none;"><div id="coding-question" style="background:#1e293b;color:#e2e8f0;padding:16px;border-radius:10px;margin-bottom:12px;font-family:monospace;font-size:0.85rem;line-height:1.6;"></div><div style="display:flex;gap:8px;margin-bottom:8px;"><select id="coding-language" onchange="switchCodingLanguage()" style="padding:6px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:0.8rem;"><option>Python</option><option>JavaScript</option><option>Java</option><option>C++</option></select><span id="coding-difficulty" style="padding:6px 10px;border-radius:6px;font-size:0.75rem;font-weight:600;"></span></div><textarea id="coding-solution" placeholder="Write your solution here..." style="width:100%;height:200px;padding:12px;border:1px solid #e5e7eb;border-radius:8px;font-family:monospace;font-size:0.85rem;resize:vertical;background:#1e293b;color:#e2e8f0;"></textarea><div style="display:flex;gap:8px;margin-top:8px;"><button onclick="showCodingHint()" style="flex:1;padding:8px;background:#f59e0b;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600;font-size:0.8rem;">💡 Hint</button><button onclick="checkCodingSolution()" style="flex:1;padding:8px;background:#10b981;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600;font-size:0.8rem;">✅ Check Solution</button></div><button onclick="nextCodingQuestion()" style="width:100%;margin-top:8px;padding:8px;background:#e5e7eb;color:#374151;border:none;border-radius:6px;cursor:pointer;font-weight:600;font-size:0.8rem;">Next Challenge →</button></div></div>';
  
  document.body.appendChild(modal);
  codingCurrentIndex = 0;
  codingAnswers = [];
}

async function generateCodingQuestions(language, jobDesc) {
  codingQuestions = [];
  
  var rd = App.resumeData || {};
  var allSkills = (rd.skills || []).join(', ');
  var experienceYears = 0;
  if (rd.experience && rd.experience.length > 0) {
    experienceYears = rd.experience.reduce(function(total, exp) {
      return total + (parseInt(exp.years) || 1);
    }, 0);
  }
  var recentTitle = rd.experience?.[0]?.title || '';
  var projects = (rd.projects || []).map(function(p) { return p.name + ': ' + (p.description || ''); }).join(' | ');
  
  var aiPrompt = 'Generate 5 coding interview questions for a ' + (recentTitle || language + ' developer') + 
    ' with ' + (experienceYears || 2) + ' years of experience' +
    (allSkills ? ' skilled in ' + allSkills : '') +
    (projects ? ' who has worked on: ' + projects : '') +
    '. Language: ' + language + 
    (jobDesc ? '. Job they are targeting: ' + jobDesc : '') +
    '. Match difficulty to their experience level. Return ONLY valid JSON array with fields: title, difficulty (Easy/Medium/Hard), description (under 300 words), example, constraints, hint.';
  
  try {
    var response = await fetch('/api/ai-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        jobDescription: aiPrompt,
        resumeData: rd,
        type: 'coding-prep'
      })
    });
    
    var result = await response.json();
    if (result.success && result.data && result.data.raw) {
      try {
        var rawText = result.data.raw;
        var match = rawText.match(/\[[\s\S]*\]/);
        var parsed = match ? JSON.parse(match[0]) : JSON.parse(rawText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          codingQuestions = parsed;
        }
      } catch(e) {
        console.log('Parse failed, using fallback');
      }
    }
  } catch(e) {
    console.log('AI coding questions failed, using defaults');
  }
  
  if (codingQuestions.length === 0) {
    codingQuestions = [
      { title: 'Two Sum', difficulty: 'Easy', description: 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.', example: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]', constraints: '2 ≤ nums.length ≤ 10⁴', hint: 'Consider using a hash map.' },
      { title: 'Valid Parentheses', difficulty: 'Easy', description: 'Given a string with (, ), {, }, [, ], determine if valid.', example: 'Input: "()"\nOutput: true', constraints: '1 ≤ s.length ≤ 10⁴', hint: 'Use a stack.' },
      { title: 'Merge Two Sorted Lists', difficulty: 'Easy', description: 'Merge two sorted linked lists into one sorted list.', example: 'Input: [1,2,4], [1,3,4]\nOutput: [1,1,2,3,4,4]', constraints: 'Lists can be empty', hint: 'Use a dummy head node.' },
      { title: 'Longest Substring Without Repeating', difficulty: 'Medium', description: 'Find length of longest substring without repeating characters.', example: 'Input: "abcabcbb"\nOutput: 3', constraints: '0 ≤ s.length ≤ 5×10⁴', hint: 'Sliding window with a set.' },
      { title: 'Binary Tree Level Order', difficulty: 'Medium', description: 'Return level order traversal of binary tree.', example: 'Input: [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]', constraints: 'Tree can be empty', hint: 'Use a queue.' }
    ];
  }
  
  document.getElementById('coding-loading').style.display = 'none';
  document.getElementById('coding-content').style.display = 'block';
  displayCodingQuestion();
}

function displayCodingQuestion() {
  var q = codingQuestions[codingCurrentIndex];
  var difficultyColor = q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
  
  var html = '<p style="font-size:1rem;font-weight:700;margin-bottom:8px;color:#38bdf8;">' + (codingCurrentIndex+1) + '. ' + q.title + '</p>';
  html += '<p style="margin-bottom:12px;">' + q.description + '</p>';
  if (q.example) html += '<p style="margin-bottom:4px;color:#94a3b8;">Example:</p><pre style="background:#0f172a;padding:8px;border-radius:4px;margin-bottom:8px;white-space:pre-wrap;">' + q.example + '</pre>';
  if (q.constraints) html += '<p style="margin-bottom:4px;color:#94a3b8;">Constraints:</p><pre style="background:#0f172a;padding:8px;border-radius:4px;white-space:pre-wrap;">' + q.constraints + '</pre>';
  
  document.getElementById('coding-question').innerHTML = html;
  document.getElementById('coding-difficulty').textContent = q.difficulty;
  document.getElementById('coding-difficulty').className = 'px-3 py-1 rounded-full text-xs font-bold ' + difficultyColor;
  document.getElementById('coding-solution').value = '';
}

function showCodingHint() {
  var q = codingQuestions[codingCurrentIndex];
  alert('💡 Hint: ' + (q.hint || 'Think about the data structure that fits this problem best.'));
}

async function checkCodingSolution() {
  var solution = document.getElementById('coding-solution').value.trim();
  if (!solution) { 
    showInlineFeedback('Please write some code before checking.', '#ef4444');
    return; 
  }
  
  var q = codingQuestions[codingCurrentIndex];
  var language = document.getElementById('coding-language')?.value || 'JavaScript';
  
  var checkBtn = document.querySelector('button[onclick="checkCodingSolution()"]');
  if (checkBtn) {
    checkBtn.textContent = '⏳ Analyzing...';
    checkBtn.disabled = true;
  }
  
  try {
    var aiPrompt = 'You are a technical interviewer evaluating a coding solution. ' +
      'Problem: "' + q.title + ' - ' + q.description + '" ' +
      'Constraints: ' + (q.constraints || 'None') + ' ' +
      'Example: ' + (q.example || 'None') + ' ' +
      'Language: ' + language + ' ' +
      'Candidate solution:\n```\n' + solution + '\n```\n' +
      'Evaluate and return ONLY valid JSON with: ' +
      '"score" (0-100), ' +
      '"correctness" ("correct", "partially correct", or "incorrect"), ' +
      '"feedback" (short praise or specific issue), ' +
      '"suggestions" (1-3 actionable improvements), ' +
      '"edgeCases" (edge cases they might have missed), ' +
      '"timeComplexity" (Big O if determinable, else "N/A"), ' +
      '"spaceComplexity" (Big O if determinable, else "N/A").';
    
    var response = await fetch('/api/ai-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription: aiPrompt, resumeData: {}, type: 'coding-review' })
    });
    
    var result = await response.json();
    if (result.success && result.data && !result.fallback) {
      var analysis;
      try {
        var raw = result.data.raw || '';
        var match = raw.match(/\{[\s\S]*\}/);
        analysis = match ? JSON.parse(match[0]) : null;
      } catch(e) { analysis = null; }
      
      if (analysis && typeof analysis.score === 'number') {
        codingAnswers.push({ 
          question: q.title, solution: solution, score: analysis.score,
          feedback: analysis.feedback || '', suggestions: analysis.suggestions || [],
          correctness: analysis.correctness || 'unknown', edgeCases: analysis.edgeCases || [],
          timeComplexity: analysis.timeComplexity || 'N/A', spaceComplexity: analysis.spaceComplexity || 'N/A'
        });
        showDetailedCodingFeedback(analysis);
        if (checkBtn) { checkBtn.textContent = '✅ Check Solution'; checkBtn.disabled = false; }
        return;
      }
    }
  } catch(e) { console.log('AI code review failed, using local analysis'); }
  
  var score = evaluateCodeLocally(solution, q, language);
  codingAnswers.push({ question: q.title, solution: solution, score: score.score, feedback: score.feedback, suggestions: score.suggestions });
  showDetailedCodingFeedback({ score: score.score, correctness: score.score >= 70 ? 'partially correct' : 'incorrect', feedback: score.feedback, suggestions: score.suggestions, edgeCases: [], timeComplexity: 'N/A', spaceComplexity: 'N/A' });
  if (checkBtn) { checkBtn.textContent = '✅ Check Solution'; checkBtn.disabled = false; }
}

function evaluateCodeLocally(solution, question, language) {
  var score = 0;
  var feedback = [];
  var suggestions = [];
  var hasStructure = /\b(function|def|class|public\s+static|public\s+class|fn\s|func\s)\b/i.test(solution);
  if (hasStructure) { score += 15; feedback.push('Good code structure'); } else { suggestions.push('Define a function or class to organize your solution'); }
  var hasOutput = /\b(return|print|console\.log|fmt\.Print|System\.out\.print|puts|cout)\b/i.test(solution);
  if (hasOutput) { score += 15; } else { suggestions.push('Add a return statement or output'); }
  var hasDataStructures = /\b(let|const|var|int|string|bool|float|double|char|vector|array|list|map|set|dict|hash|stack|queue|heap)\b/i.test(solution);
  if (hasDataStructures) { score += 10; }
  var codeLines = solution.split('\n').filter(function(l) { return l.trim() && !l.trim().startsWith('//') && !l.trim().startsWith('#') && !l.trim().startsWith('/*') && !l.trim().startsWith('*'); });
  if (codeLines.length >= 3) score += 10;
  if (codeLines.length >= 6) score += 5;
  var hasComments = /(\/\/|#|\/\*|\*\/|"""|'''|--)/.test(solution);
  if (hasComments) { score += 10; feedback.push('Good use of comments'); }
  var hasAlgorithm = /\b(for|while|do|forEach|map\.|filter\.|reduce\.|recursion|recursive)\b/i.test(solution);
  if (hasAlgorithm) { score += 15; feedback.push('Shows algorithmic approach'); } else { suggestions.push('Consider using a loop or recursion'); }
  var hasEdgeHandling = /\b(if|else|switch|case|try|catch|null|undefined|empty|len\s*[=<>]|\.length\s*[=<>]|\.size\s*[=<>])\b/i.test(solution);
  if (hasEdgeHandling) { score += 10; }
  score = Math.min(100, score);
  if (feedback.length === 0) { feedback.push('Solution submitted'); }
  if (suggestions.length === 0 && score < 70) { suggestions.push('Try implementing the full algorithm'); }
  return { score: score, feedback: feedback.join('. '), suggestions: suggestions };
}

function showDetailedCodingFeedback(analysis) {
  var existing = document.getElementById('coding-feedback-modal');
  if (existing) existing.remove();
  var scoreColor = analysis.score >= 70 ? '#10b981' : analysis.score >= 40 ? '#f59e0b' : '#ef4444';
  var correctnessIcon = analysis.correctness === 'correct' ? '✅' : analysis.correctness === 'partially correct' ? '⚠️' : '❌';
  var html = '<div id="coding-feedback-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;">';
  html += '<div style="background:white;border-radius:16px;padding:24px;max-width:550px;width:90%;max-height:85vh;overflow-y:auto;">';
  html += '<div style="text-align:center;margin-bottom:16px;">';
  html += '<div style="font-size:3rem;font-weight:800;color:' + scoreColor + ';">' + analysis.score + '%</div>';
  html += '<div style="font-size:1rem;font-weight:600;color:#374151;">' + correctnessIcon + ' ' + (analysis.correctness || 'Evaluated').charAt(0).toUpperCase() + (analysis.correctness || 'Evaluated').slice(1) + '</div>';
  html += '</div>';
  if (analysis.feedback) {
    html += '<div style="background:#f0fdf4;padding:12px;border-radius:8px;margin-bottom:12px;"><p style="font-weight:600;color:#166534;margin-bottom:4px;">💬 Feedback</p><p style="color:#166534;font-size:0.9rem;">' + analysis.feedback + '</p></div>';
  }
  if (analysis.suggestions && analysis.suggestions.length > 0) {
    html += '<div style="background:#fffbeb;padding:12px;border-radius:8px;margin-bottom:12px;"><p style="font-weight:600;color:#92400e;margin-bottom:4px;">💡 Suggestions</p>';
    analysis.suggestions.forEach(function(s) { html += '<p style="color:#92400e;font-size:0.85rem;margin-bottom:4px;">• ' + s + '</p>'; });
    html += '</div>';
  }
  if (analysis.timeComplexity && analysis.timeComplexity !== 'N/A') {
    html += '<div style="background:#f8fafc;padding:12px;border-radius:8px;margin-bottom:12px;display:flex;gap:16px;">';
    html += '<div><span style="font-weight:600;font-size:0.8rem;">Time:</span> <span style="font-family:monospace;font-size:0.85rem;">' + analysis.timeComplexity + '</span></div>';
    html += '<div><span style="font-weight:600;font-size:0.8rem;">Space:</span> <span style="font-family:monospace;font-size:0.85rem;">' + analysis.spaceComplexity + '</span></div>';
    html += '</div>';
  }
  if (analysis.edgeCases && analysis.edgeCases.length > 0) {
    html += '<div style="background:#fef2f2;padding:12px;border-radius:8px;margin-bottom:12px;"><p style="font-weight:600;color:#991b1b;margin-bottom:4px;">⚠️ Edge Cases to Consider</p>';
    analysis.edgeCases.forEach(function(e) { html += '<p style="color:#991b1b;font-size:0.85rem;margin-bottom:4px;">• ' + e + '</p>'; });
    html += '</div>';
  }
  html += '<button onclick="document.getElementById(\'coding-feedback-modal\').remove()" style="width:100%;padding:10px;background:#e5e7eb;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Got it</button>';
  html += '</div></div>';
  var modal = document.createElement('div');
  modal.innerHTML = html;
  document.body.appendChild(modal.firstElementChild);
}

function showInlineFeedback(message, color) {
  var feedbackDiv = document.createElement('div');
  feedbackDiv.style.cssText = 'padding:8px 12px;background:' + color + '15;color:' + color + ';border-radius:6px;font-size:0.85rem;margin-top:8px;text-align:center;';
  feedbackDiv.textContent = message;
  var solutionArea = document.getElementById('coding-solution');
  solutionArea.parentNode.insertBefore(feedbackDiv, solutionArea.nextSibling);
  setTimeout(function() { feedbackDiv.remove(); }, 3000);
}

function nextCodingQuestion() {
  codingCurrentIndex++;
  if (codingCurrentIndex >= codingQuestions.length) {
    document.getElementById('coding-modal').remove();
    showCodingResults();
    return;
  }
  displayCodingQuestion();
}

function switchCodingLanguage() {
  var lang = document.getElementById('coding-language').value;
  var jd = App.jobTarget?.description || '';
  generateCodingQuestions(lang, jd);
  document.getElementById('coding-loading').style.display = 'block';
  document.getElementById('coding-content').style.display = 'none';
}

function showCodingResults() {
  var modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;';
  
  var totalScore = codingAnswers.reduce(function(sum, a) { return sum + a.score; }, 0);
  var avgScore = codingAnswers.length > 0 ? Math.round(totalScore / codingAnswers.length) : 0;
  var gradeColor = avgScore >= 70 ? '#10b981' : avgScore >= 40 ? '#f59e0b' : '#ef4444';
  
  var html = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;"><h2 style="font-size:1.3rem;font-weight:700;margin-bottom:16px;">💻 Coding Practice Results</h2>';
  html += '<div style="text-align:center;padding:20px;background:#f0fdf4;border-radius:8px;margin-bottom:16px;">';
  html += '<p style="font-size:2.5rem;font-weight:800;color:' + gradeColor + ';">' + avgScore + '%</p>';
  html += '<p style="color:#64748b;">Average Score (' + codingAnswers.length + ' challenges)</p></div>';
  
  codingAnswers.forEach(function(a, i) {
    html += '<div style="background:#f8fafc;padding:8px 12px;border-radius:6px;margin-bottom:4px;display:flex;justify-content:space-between;"><span>' + (i+1) + '. ' + a.question + '</span><span style="font-weight:600;color:' + (a.score >= 70 ? '#10b981' : '#f59e0b') + ';">' + a.score + '%</span></div>';
  });
  
  html += '<button onclick="this.parentElement.parentElement.remove()" style="width:100%;margin-top:12px;padding:10px;background:#e5e7eb;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Close</button></div>';
  modal.innerHTML = html;
  document.body.appendChild(modal);
}    
var voiceInterviewActive = false;
var voiceRecognition = null;
var voiceQuestionIndex = 0;
var voiceQuestions = [];
var voiceAnswers = [];

function startVoiceMockInterview() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }
  if (!App.resumeData?.personal?.fullName) { showError('Add resume content first.'); return; }
  
  // Check browser support
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showError('Voice interviews require Chrome or Edge browser.');
    return;
  }
  
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  voiceRecognition = new SpeechRecognition();
  voiceRecognition.continuous = false;
  voiceRecognition.interimResults = false;
  voiceRecognition.lang = 'en-US';
  
  var jd = App.jobTarget?.description || '';
  voiceQuestions = InterviewCoach.generateQuestions(App.resumeData, jd);
  voiceQuestionIndex = 0;
  voiceAnswers = [];
  voiceInterviewActive = true;
  
  showVoiceInterviewModal();
  speakQuestion();
}

function showVoiceInterviewModal() {
  var existing = document.getElementById('voice-interview-modal');
  if (existing) existing.remove();
  
  var modal = document.createElement('div');
  modal.id = 'voice-interview-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;';
  
  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;text-align:center;"><h2 style="font-size:1.3rem;font-weight:700;margin-bottom:8px;">🎤 Voice Mock Interview</h2><p id="voice-counter" style="font-size:0.85rem;color:#6b7280;margin-bottom:16px;">Question ' + (voiceQuestionIndex+1) + ' of ' + voiceQuestions.length + '</p><div id="voice-question" style="background:#f0fdf4;padding:16px;border-radius:10px;margin-bottom:16px;font-weight:600;font-size:1rem;color:#166534;"></div><div id="voice-status" style="margin-bottom:12px;font-size:0.85rem;color:#64748b;">Click the mic and answer aloud</div><div id="voice-answer-display" style="background:#f8fafc;padding:12px;border-radius:8px;min-height:60px;font-size:0.85rem;color:#334155;margin-bottom:12px;display:none;"></div><button id="voice-mic-btn" onclick="toggleVoiceMic()" style="width:80px;height:80px;border-radius:50%;background:#2563eb;color:white;border:none;font-size:32px;cursor:pointer;margin-bottom:12px;">🎙️</button><p id="voice-hint" style="font-size:0.75rem;color:#94a3b8;">Tap to speak, tap again to stop</p><button onclick="nextVoiceQuestion()" style="margin-top:8px;padding:10px 20px;background:#10b981;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;margin-right:8px;">Next Question →</button><button onclick="stopVoiceInterview()" style="margin-top:12px;padding:10px 20px;background:#e5e7eb;border:none;border-radius:8px;cursor:pointer;font-weight:600;">End Interview</button></div>';
  
  document.body.appendChild(modal);
}

function speakQuestion() {
  if (!voiceInterviewActive || voiceQuestionIndex >= voiceQuestions.length) {
    finishVoiceInterview();
    return;
  }
  
  document.getElementById('voice-question').textContent = voiceQuestions[voiceQuestionIndex];
  document.getElementById('voice-status').textContent = '🔊 Listening... speak your answer';
  document.getElementById('voice-answer-display').style.display = 'none';
  
  // Speak the question using text-to-speech
  if ('speechSynthesis' in window) {
    var utterance = new SpeechSynthesisUtterance(voiceQuestions[voiceQuestionIndex]);
    utterance.rate = 0.9;
    utterance.onend = function() {
      document.getElementById('voice-status').textContent = '🎙️ Your turn — tap mic to answer';
    };
    window.speechSynthesis.speak(utterance);
  }
}

function toggleVoiceMic() {
  if (!voiceRecognition) return;
  
  var btn = document.getElementById('voice-mic-btn');
  var status = document.getElementById('voice-status');
  var answerDisplay = document.getElementById('voice-answer-display');
  
  if (btn.textContent === '🎙️') {
    // Start listening
    btn.textContent = '⏺️';
    btn.style.background = '#dc2626';
    status.textContent = '🔴 Recording...';
    answerDisplay.style.display = 'block';
    answerDisplay.textContent = '';
    
    voiceRecognition.onresult = function(event) {
      var transcript = event.results[0][0].transcript;
      answerDisplay.textContent = transcript;
    };
    
    voiceRecognition.onerror = function() {
      status.textContent = '⚠️ Could not hear. Try again.';
      btn.textContent = '🎙️';
      btn.style.background = '#2563eb';
    };
    
        voiceRecognition.onend = function() {
      btn.textContent = '🎙️';
      btn.style.background = '#2563eb';
      // Save the answer when recording stops naturally
      var ans = answerDisplay.textContent.trim();
      if (ans && voiceAnswers[voiceAnswers.length - 1] !== ans) {
        voiceAnswers.push(ans);
        status.textContent = '✅ Answer saved. Click Next or End Interview.';
      } else {
        status.textContent = '✅ Answer recorded. Click Next or tap mic to re-record.';
      }
    };
    
    voiceRecognition.start();
        } else {
    // Stop recording and save answer
    voiceRecognition.stop();
    var answer = answerDisplay.textContent.trim();
    if (answer) {
      voiceAnswers.push(answer);
      voiceQuestionIndex++;
      if (voiceQuestionIndex >= voiceQuestions.length) {
        finishVoiceInterview();
      } else {
        document.getElementById('voice-counter').textContent = 'Question ' + (voiceQuestionIndex+1) + ' of ' + voiceQuestions.length;
        document.getElementById('voice-answer-display').style.display = 'none';
        document.getElementById('voice-status').textContent = '🔊 Next question...';
        setTimeout(function() { speakQuestion(); }, 800);
      }
    }
  }
}

function nextVoiceQuestion() {
  if (voiceRecognition) voiceRecognition.abort();
  window.speechSynthesis.cancel();
  voiceQuestionIndex++;
  if (voiceQuestionIndex >= voiceQuestions.length) {
    finishVoiceInterview();
  } else {
    document.getElementById('voice-counter').textContent = 'Question ' + (voiceQuestionIndex+1) + ' of ' + voiceQuestions.length;
    document.getElementById('voice-status').textContent = '🔊 Listening... speak your answer';
    document.getElementById('voice-answer-display').style.display = 'none';
    document.getElementById('voice-mic-btn').textContent = '🎙️';
    document.getElementById('voice-mic-btn').style.background = '#2563eb';
    speakQuestion();
  }
}
function stopVoiceInterview() {
  voiceInterviewActive = false;
  if (voiceRecognition) {
    voiceRecognition.onend = null;
    voiceRecognition.abort();
  }
  window.speechSynthesis.cancel();
  
  // Save any answer still in the display that hasn't been saved yet
  var display = document.getElementById('voice-answer-display');
  if (display) {
    var ans = display.textContent.trim();
    if (ans && voiceAnswers[voiceAnswers.length - 1] !== ans) {
      voiceAnswers.push(ans);
    }
  }
  
  var modal = document.getElementById('voice-interview-modal');
  if (modal) modal.remove();
  if (voiceAnswers.length > 0) {
    showVoiceResults();
  }
}

function finishVoiceInterview() {
  voiceInterviewActive = false;
  if (voiceRecognition) {
    voiceRecognition.onend = null;
  }
  
  // Save any answer still in the display
  var display = document.getElementById('voice-answer-display');
  if (display) {
    var ans = display.textContent.trim();
    if (ans && voiceAnswers[voiceAnswers.length - 1] !== ans) {
      voiceAnswers.push(ans);
    }
  }
  
  var modal = document.getElementById('voice-interview-modal');
  if (modal) modal.remove();
  if (voiceAnswers.length > 0) {
    showVoiceResults();
  }
}

function showVoiceResults() {
  var modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;';
  
  var totalScore = 0;
  var resultsHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:600px;width:90%;max-height:85vh;overflow-y:auto;"><h2 style="font-size:1.3rem;font-weight:700;margin-bottom:16px;">🎤 Voice Interview Results</h2>';
  
  voiceQuestions.forEach(function(q, i) {
    var answer = voiceAnswers[i] || '';
    var result = InterviewCoach.analyze(q, answer, '');
    totalScore += result.score;
    var color = result.score >= 70 ? '#10b981' : result.score >= 40 ? '#f59e0b' : '#ef4444';
    
    resultsHTML += '<div style="background:#f8fafc;padding:12px;border-radius:8px;margin-bottom:8px;">';
    resultsHTML += '<p style="font-weight:600;font-size:0.85rem;">Q' + (i+1) + ': ' + q + '</p>';
    resultsHTML += '<p style="font-size:0.8rem;color:#64748b;">Your answer: "' + (answer || 'No answer') + '"</p>';
    resultsHTML += '<p style="font-weight:700;color:' + color + ';">Score: ' + result.score + '%</p>';
    resultsHTML += '</div>';
  });
  
  var avgScore = Math.round(totalScore / voiceQuestions.length);
  var gradeColor = avgScore >= 70 ? '#10b981' : avgScore >= 40 ? '#f59e0b' : '#ef4444';
  resultsHTML += '<div style="text-align:center;margin-top:16px;padding:16px;background:#f0fdf4;border-radius:8px;">';
  resultsHTML += '<p style="font-size:2rem;font-weight:800;color:' + gradeColor + ';">' + avgScore + '%</p>';
  resultsHTML += '<p style="font-size:0.85rem;color:#64748b;">Overall Interview Score</p>';
  resultsHTML += '</div>';
  resultsHTML += '<button onclick="this.parentElement.parentElement.remove()" style="width:100%;margin-top:12px;padding:10px;background:#e5e7eb;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Close</button></div>';
  
  modal.innerHTML = resultsHTML;
  document.body.appendChild(modal);
}
