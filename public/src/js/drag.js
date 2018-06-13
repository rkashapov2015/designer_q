var dragElement = {
    movedElement: null,
    parentElements: null,
    parentClass: 'parent-elements',
    childClass: 'element',
    shiftX: 0,
    shiftY: 0,
    boundsX: 0,
    boundsY: 0,
    init: function () {
        dragElement.parentElements = document.querySelector('.' + dragElement.parentClass);
        dragElement.parentElements.addEventListener('mousedown', function (e) {
            if (!e.target.classList.contains(dragElement.childClass)) { return false; }
            dragElement.movedElement = e.target;
            var bounds = e.target.getBoundingClientRect();

            dragElement.boundsX = bounds.left;
            dragElement.boundsY = bounds.top;
            dragElement.shiftX = e.pageX - bounds.left - window.pageXOffset;
            dragElement.shiftY = e.pageY - bounds.top - window.pageYOffset;
            console.log('shift', dragElement.shiftX, dragElement.shiftY);
        });
        
        dragElement.parentElements.addEventListener('mousemove', function (e) {
            if (dragElement.movedElement) {
                e.preventDefault();
                dragElement.movedElement.style.left = (e.pageX - dragElement.boundsX - dragElement.shiftX) + 'px';
                dragElement.movedElement.style.top = (e.pageY - dragElement.shiftY) + 'px';
                dragElement.movedElement.classList.add('moving');

            }
        });
        
        document.addEventListener('mouseup', function (e) {
            if (dragElement.movedElement) {
                dragElement.movedElement.style.visibility = 'hidden';
                var check = document.elementFromPoint(e.clientX, e.clientY).closest('.' + dragElement.childClass);
                dragElement.movedElement.style.visibility = 'visible';
                
                if (check) {
                    check.parentNode.insertBefore(dragElement.movedElement, check);
                }

                dragElement.movedElement.classList.remove('moving');
                dragElement.movedElement.removeAttribute('style');
                dragElement.movedElement = null;
            } 
        });        
    },
};