// Quick Apply — Open job boards with pre-filled search
function quickApply(platform, title, company) {
    var searchQuery = encodeURIComponent((title || '') + ' ' + (company || ''));
    var urls = {
        linkedin: 'https://www.linkedin.com/jobs/search/?keywords=' + searchQuery,
        indeed: 'https://www.indeed.com/jobs?q=' + searchQuery,
        naukri: 'https://www.naukri.com/' + encodeURIComponent(title || '') + '-jobs',
        monster: 'https://www.monster.com/jobs/search?q=' + searchQuery
    };
    var url = urls[platform] || urls['linkedin'];
    window.open(url, '_blank');
}
