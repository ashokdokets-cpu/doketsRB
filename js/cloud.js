// Cloud Save/Load Functions
var lastCloudSave = 0;
async function saveToCloud(){
    if(!currentUser||!sbClient)return;
    var now = Date.now();
    if(now - lastCloudSave < 10000) return; // Only save every 10 seconds
    lastCloudSave = now;
    try{
        await sbClient.from('resumes').upsert({
            user_id:currentUser.id,
            title:(App.resumeData.personal.fullName||'Untitled')+' Resume',
            resume_data:App.resumeData,
            template:App.selectedTemplate,
            updated_at:new Date().toISOString()
        });
    }catch(e){}
}
async function loadFromCloud(){
    if(!currentUser||!sbClient)return false;
    try{
        var r=await sbClient.from('resumes').select('*').eq('user_id',currentUser.id).order('updated_at',{ascending:false}).limit(1).single();
        if(r.data&&r.data.resume_data){App.resumeData=r.data.resume_data;saveToStorage();return true}
    }catch(e){}
    return false;
}