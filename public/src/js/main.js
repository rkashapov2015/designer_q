
dragTask.init();


var parentElements = document.querySelector('.parent-elements');
var controlBlock = document.querySelector('.design-q-controls');


document.addEventListener('click', function (e) {
    var action = e.target.getAttribute('data-action');
    if (action) {
        event.preventDefault();
        console.log(action);
        if (action == 'designer-new-question') {
            
        }
    }
})

types = [
    { name: 'one', title: 'Одинарный выбор', options: [] },
    { name: 'multi', title: 'Множественный выбор', options: [] },
    { name: 'text', title: 'Текстовое поле', options: [] },
    { name: 'big-text', title: 'Абзац', options: [] },
    { name: 'description', title: 'Описание', options: [] } 
];

function drawTypes() {
    var fragment = types.reduce(
        function (fragment, cur) {
            fragment.appendChild( el('option', {value: cur.name}, cur.title) );
            return fragment;
        }, 
        document.createDocumentFragment()
    );
    return fragment;
}

function drawQuestionTemplate(data) {
    switch (data.type) {
        case 'one':
        break;
        case 'multi':
        break;
        case 'text':
        break;
        case 'big-text':
        break;
        case 'description':
        break;
    }
}

if (controlBlock) {
    controlBlock.appendChild(
        el ('form', {},[
            el ('div', {class: 'form-group'}, [
                el ('label', {}, 'Создать элемент анкеты'),
                el ('div', {class: 'input-group'}, [
                    el ('select', {class: 'form-control', name: 'typeQuestion'}, [drawTypes()]),
                    el ('span', {class: 'input-group-btn'}, [
                        el ('button', {class: 'btn btn-success', 'data-action': 'designer-new-question'}, 'Создать')
                    ])
                ])
            ])
        ])
        
    );
}

