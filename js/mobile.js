// Mobile & Tablet Responsiveness
document.addEventListener('DOMContentLoaded', function() {
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
        var nav = document.getElementById('mobile-nav');
        var toggle = document.querySelector('.lg-hidden button') || document.querySelector('[aria-label]');
        if (nav && !nav.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
            nav.classList.add('hidden');
        }
    });

    // Smooth touch scrolling for builder sections
    var scrollAreas = document.querySelectorAll('[style*="overflow-y:auto"]');
    scrollAreas.forEach(function(el) {
        el.style.webkitOverflowScrolling = 'touch';
    });

    // Adjust viewport for mobile keyboards
    var inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(function(input) {
        input.addEventListener('focus', function() {
            setTimeout(function() {
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
});

// Responsive helper
function isMobile() { return window.innerWidth < 768; }
function isTablet() { return window.innerWidth >= 768 && window.innerWidth < 1024; }

document.addEventListener('click',function(e){var d=document.getElementById('more-dd');var b=e.target.closest('button');if(d&&!d.contains(e.target)&&(!b||!b.textContent.includes('More')))d.classList.add('hidden')});
