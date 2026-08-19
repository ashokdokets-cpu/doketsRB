// Email Verification & Auth Enhancements

// FEATURE FLAG: Set to false to revert to old behavior instantly
var GUEST_MODE = true;

// Check email verification - only called on save/download, not on login
async function checkEmailVerification(){
    if(GUEST_MODE){
        // Guest mode ON: Only show banner on save actions, not on login
        return; // Do nothing on login - let users explore first
    }
    // Old behavior: show banner immediately after login
    if(!currentUser||!sbClient)return;
    try{
        var r=await sbClient.auth.getUser();
        if(r.data.user&&!r.data.user.email_confirmed_at){
            var b=document.getElementById('email-verify-banner');
            if(b)b.style.display='block';
        }
    }catch(e){}
}

// New function: Show verification only when saving
async function requireVerificationForSave(){
    if(!currentUser||!sbClient)return false;
    try{
        var r=await sbClient.auth.getUser();
        if(r.data.user&&!r.data.user.email_confirmed_at){
            var b=document.getElementById('email-verify-banner');
            if(b)b.style.display='block';
            return false; // Not verified yet
        }
        return true; // Verified
    }catch(e){return true}
}

// Resend verification email (unchanged)
async function resendVerificationEmail(){
    if(!sbClient||!currentUser){showError('Not logged in');return}
    showLoader();
    try{
        var r=await sbClient.auth.resend({type:'signup',email:currentUser.email});
        hideLoader();
        if(r.error)showError(r.error.message);
        else showSuccess('Verification email resent!')
    }catch(e){hideLoader();showError('Error resending.')}
}
