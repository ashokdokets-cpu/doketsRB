// Visitor Tracking — sends visit data to Supabase
(function() {
    var sessionId = localStorage.getItem('visitor_session');
    if (!sessionId) {
        sessionId = 'vis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('visitor_session', sessionId);
    }

    function getDevice() {
        var w = window.innerWidth;
        if (w < 640) return 'mobile';
        if (w < 1024) return 'tablet';
        return 'desktop';
    }

    function trackVisit() {
        if (!sbClient) { setTimeout(trackVisit, 1000); return; }
        
        fetch('https://arszgttojohsmzjiemgh.supabase.co/rest/v1/visitors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyc3pndHRvam9oc216amllbWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MTYwNTksImV4cCI6MjA5MzI5MjA1OX0.0Y6kM8cg0fERxlM0xTZu6AFzenfVY-USoNm6mJeg-dM',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyc3pndHRvam9oc216amllbWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MTYwNTksImV4cCI6MjA5MzI5MjA1OX0.0Y6kM8cg0fERxlM0xTZu6AFzenfVY-USoNm6mJeg-dM'
            },
            body: JSON.stringify({
                session_id: sessionId,
                page: window.location.hash || '/',
                device: getDevice()
            })
        }).catch(function(){});
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function(){ setTimeout(trackVisit, 500); });
    } else {
        setTimeout(trackVisit, 500);
    }
})();