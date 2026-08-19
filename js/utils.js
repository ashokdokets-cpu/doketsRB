// Toast + Loader utilities
function showLoader(){var e=document.getElementById('global-loader');if(!e){e=document.createElement('div');e.id='global-loader';e.className='loader-overlay';e.innerHTML='<div class="loader-spinner"></div>';document.body.appendChild(e)}}
function hideLoader(){var e=document.getElementById('global-loader');if(e)e.remove()}
function showSuccess(m){var t=document.createElement('div');t.className='toast success';t.textContent=m;document.body.appendChild(t);setTimeout(function(){t.remove()},4000)}
function openReviewFromPage() { if (!currentUser) { showError('Please log in to leave a review.'); return; } localStorage.removeItem('dokets_review_asked'); showReviewPrompt(); }
function showReviewPrompt() {
    var overlay = document.createElement('div');
    overlay.id = 'review-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML = '<div style="background:white;border-radius:16px;padding:32px;max-width:440px;width:90%;text-align:center;"><h2>Enjoying Dokets?</h2><p style="color:#64748b;">Your feedback helps other job seekers.</p><div id="star-rating" style="margin:12px 0;font-size:32px;cursor:pointer;">' + [1,2,3,4,5].map(function(s) { return '<span onclick="selectStar(' + s + ')" onmouseover="highlightStars(' + s + ')" onmouseout="resetStars()" style="color:#d1d5db;padding:0 3px;" data-star="' + s + '">★</span>'; }).join('') + '</div><textarea id="review-text" placeholder="Share your experience..." style="width:100%;height:80px;margin:12px 0;padding:12px;border-radius:8px;"></textarea><button onclick="submitReview()" style="padding:10px 24px;background:#2563eb;color:white;border:none;border-radius:8px;margin-right:8px;">Submit</button><button onclick="skipReview()" style="padding:10px 24px;background:#f1f5f9;border:none;border-radius:8px;">Skip</button></div>';
window._reviewRating = 0;
    document.body.appendChild(overlay);
}
function selectStar(rating) { window._reviewRating = rating; var stars = document.querySelectorAll('#star-rating span'); stars.forEach(function(s, i) { s.style.color = i < rating ? '#f59e0b' : '#d1d5db'; }); }
function highlightStars(rating) { var stars = document.querySelectorAll('#star-rating span'); stars.forEach(function(s, i) { s.style.color = i < rating ? '#f59e0b' : '#d1d5db'; }); }
function resetStars() { var stars = document.querySelectorAll('#star-rating span'); stars.forEach(function(s, i) { s.style.color = i < (window._reviewRating || 0) ? '#f59e0b' : '#d1d5db'; }); }
function skipReview() { localStorage.setItem('dokets_review_asked','true'); document.getElementById('review-overlay').remove(); logOut(); }
async function submitReview() {
    var text = document.getElementById('review-text').value.trim();
    if (!text) { alert('Please write a short review.'); return; }
    try { await sbClient.from('reviews').insert({user_id:currentUser.id, user_name:App.resumeData.personal.fullName||'User', rating:window._reviewRating || 5, review_text:text, status:'pending'}); } catch(e) {}
    localStorage.setItem('dokets_review_asked','true'); document.getElementById('review-overlay').remove(); logOut();
}
function showError(m){var t=document.createElement('div');t.className='toast error';t.textContent=m;document.body.appendChild(t);setTimeout(function(){t.remove()},5000)}
function execCmd(c,v){document.execCommand(c,false,v||null)}
function getProATSScore(){var rd=App.resumeData;var s={contact:rd.personal.fullName&&rd.personal.email&&rd.personal.phone?100:rd.personal.fullName&&rd.personal.email?85:rd.personal.fullName?50:15,headline:rd.summary&&rd.summary.length>50?90:rd.summary?50:10,experience:rd.experience.length>=3?95:rd.experience.length>=2?80:rd.experience.length>=1?50:10,achievements:rd.experience.some(function(e){return e.bullets&&e.bullets.length>30})?85:20,education:rd.education.length>=2?90:rd.education.length>=1?70:15,skills:rd.skills.length>=10?95:rd.skills.length>=8?85:rd.skills.length>=5?65:rd.skills.length>0?40:10,certifications:rd.certifications&&rd.certifications.length>0?80:10,keywords:function(){var t=JSON.stringify(rd).toLowerCase();var k=['managed','developed','created','improved','increased','reduced','achieved','delivered','implemented','designed'];var m=0;k.forEach(function(w){if(t.includes(w))m++});return m>=6?90:m>=3?60:m>=1?30:10}(),readability:rd.summary&&rd.summary.split('.').length>=3?85:rd.summary?50:10,formatting:rd.personal.fullName&&rd.personal.email&&rd.skills.length>0?90:50,consistency:function(){var hasExp=rd.experience.length>0;var hasEdu=rd.education.length>0;var hasSkills=rd.skills.length>0;var count=(hasExp?1:0)+(hasEdu?1:0)+(hasSkills?1:0);return count>=3?95:count>=2?70:count>=1?40:10}()};var total=Object.values(s).reduce(function(a,b){return a+b},0);return{total:Math.round(total/11),breakdown:s}}
