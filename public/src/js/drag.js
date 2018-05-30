var dragTask = {
    movedElement: null,
    parentElements: null,
    parentClass: 'parent-elements',
    childClass: 'element',
    init: function () {
        dragTask.parentElements = document.querySelector('.' + dragTask.parentClass);
        dragTask.parentElements.addEventListener('mousedown', function (e) {
            if (!e.target.classList.contains(dragTask.childClass)) { console.log('not'); return false; }
            dragTask.movedElement = e.target;
        });
        
        dragTask.parentElements.addEventListener('mousemove', function (e) {
            if (dragTask.movedElement) {
                e.preventDefault();
                dragTask.movedElement.style.left = `${e.pageX}px`;
                dragTask.movedElement.style.top = `${e.pageY}px`;
                dragTask.movedElement.classList.add('moving');
            }
        });
        
        document.addEventListener('mouseup', function (e) {
            if (dragTask.movedElement) {
                dragTask.movedElement.style.visibility = 'hidden';
                var check = document.elementFromPoint(e.clientX, e.clientY).closest('.' + dragTask.childClass);
                dragTask.movedElement.style.visibility = 'visible';
                
                if (check) {
                    check.parentNode.insertBefore(dragTask.movedElement, check);
                }

                dragTask.movedElement.classList.remove('moving');
                dragTask.movedElement.removeAttribute('style');
                dragTask.movedElement = null;
            } 
        });        
    },
};