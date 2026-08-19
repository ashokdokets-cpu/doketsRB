// Drag-and-Drop Section Reordering
// Allows reordering resume sections in Builder
// Does NOT replace existing builder functionality

(function() {
  var dragState = {
    dragging: null,
    ghost: null,
    startY: 0
  };

  function initDragDrop() {
    // Add drag handles to sections
    var container = document.querySelector('.lg\\:col-span-2.space-y-3');
    if (!container) return;

    var sections = container.querySelectorAll('.bg-white.rounded-xl.p-4.border');
    sections.forEach(function(section, index) {
      // Add drag handle
      if (!section.querySelector('.drag-handle')) {
        var handle = document.createElement('span');
        handle.className = 'drag-handle';
        handle.innerHTML = '⋮⋮';
        handle.title = 'Drag to reorder';
        handle.style.cssText = 'cursor:grab;padding:2px 8px;color:#9ca3af;font-size:1.2rem;letter-spacing:-2px;user-select:none;float:right;';
        handle.setAttribute('draggable', 'true');
        
        handle.addEventListener('dragstart', function(e) {
          dragState.dragging = section;
          section.style.opacity = '0.5';
          e.dataTransfer.effectAllowed = 'move';
        });

        handle.addEventListener('dragend', function(e) {
          section.style.opacity = '1';
          dragState.dragging = null;
        });

        section.addEventListener('dragover', function(e) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          section.style.borderTop = '3px solid #6366f1';
        });

        section.addEventListener('dragleave', function(e) {
          section.style.borderTop = '';
        });

        section.addEventListener('drop', function(e) {
          e.preventDefault();
          section.style.borderTop = '';
          
          if (dragState.dragging && dragState.dragging !== section) {
            container.insertBefore(dragState.dragging, section);
            saveSectionOrder();
            showSuccess('Section moved!');
          }
        });

        section.querySelector('h3').prepend(handle);
      }
    });
  }

  function saveSectionOrder() {
    var sections = document.querySelectorAll('.lg\\:col-span-2.space-y-3 > .bg-white.rounded-xl.p-4.border');
    var order = [];
    sections.forEach(function(section) {
      var heading = section.querySelector('h3');
      if (heading) order.push(heading.textContent.trim());
    });
    localStorage.setItem('resume_section_order', JSON.stringify(order));
  }

  function restoreSectionOrder() {
    var saved = localStorage.getItem('resume_section_order');
    if (!saved) return;
    
    try {
      var order = JSON.parse(saved);
      var container = document.querySelector('.lg\\:col-span-2.space-y-3');
      if (!container) return;

      order.forEach(function(name) {
        var sections = container.querySelectorAll('.bg-white.rounded-xl.p-4.border');
        sections.forEach(function(section) {
          var heading = section.querySelector('h3');
          if (heading && heading.textContent.trim() === name) {
            container.appendChild(section);
          }
        });
      });
    } catch(e) {}
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initDragDrop, 1500);
      setTimeout(restoreSectionOrder, 1600);
    });
  } else {
    setTimeout(initDragDrop, 1500);
    setTimeout(restoreSectionOrder, 1600);
  }
})();

  