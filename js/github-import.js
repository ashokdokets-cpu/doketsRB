// GitHub Profile Import - Fetches public repos and fills Projects section

async function importGitHubProfile() {
    var username = prompt('Enter your GitHub username:');
    if (!username) return;
    
    showLoader();
    try {
        var response = await fetch('https://api.github.com/users/' + encodeURIComponent(username) + '/repos?sort=updated&per_page=20');
        if (!response.ok) { hideLoader(); showError('GitHub user not found. Check the username.'); return; }
        
        var repos = await response.json();
        if (!repos.length) { hideLoader(); showError('No public repositories found.'); return; }
        
        var projects = repos.slice(0, 10).map(function(repo) {
            return {
                name: repo.name,
                description: repo.description || '',
                url: repo.html_url,
                tech: (repo.language || '') + (repo.topics ? ', ' + repo.topics.slice(0, 4).join(', ') : '')
            };
        });
        
        var rd = { ...App.resumeData };
        if (!rd.projects) rd.projects = [];
        rd.projects = rd.projects.concat(projects);
        updateState({ resumeData: rd });
        
        hideLoader();
        showSuccess('Imported ' + projects.length + ' GitHub repos to Projects section!');
        navigate('builder');
    } catch(e) {
        hideLoader();
        showError('Error fetching GitHub profile. Try again.');
    }
}