var dragElement = {
    movedElement: null,
    parentElements: null,
    parentClass: 'parent-elements',
    childClass: 'element',
    shiftX: 0,
    shiftY: 0,
    boundsX: 0,
    boundsY: 0,
    init: function (args) {
        if (typeof args === 'object') {
            if (args.hasOwnProperty('parentClass') && args.parentClass) {
                dragElement.parentClass = args.parentClass;
            }
            if (args.hasOwnProperty('childClass') && args.childClass) {
                dragElement.childCass = args.childClass;
            }
        }
        dragElement.parentElements = document.querySelector('.' + dragElement.parentClass);
        dragElement.parentElements.addEventListener('mousedown', function (e) {
            
            if (!e.target.classList.contains(dragElement.childClass) || e.button != 0) { return false; }
            dragElement.movedElement = e.target;
            var bounds = e.target.getBoundingClientRect();
            //console.log(bounds);
            //console.log(window.pageXOffset, window.pageYOffset);
            var boundsParent = e.target.parentNode.getBoundingClientRect();
            dragElement.boundsX = bounds.left;
            dragElement.boundsY = bounds.top;
            dragElement.shiftX = e.pageX - bounds.left;
            dragElement.shiftY = e.pageY - (bounds.top - boundsParent.top );
            //console.log('shift', dragElement.shiftX, dragElement.shiftY);
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

                var check = null;
                if (document.elementFromPoint(e.clientX, e.clientY)) {
                    check = document.elementFromPoint(e.clientX, e.clientY).closest('.' + dragElement.childClass);
                }
                
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