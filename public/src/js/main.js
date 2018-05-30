
dragTask.init();

var parentElements = document.querySelector('.parent-elements');
var controlBlock = document.querySelector('.design-q-controls');

document.addEventListener('click', function (e) {
    
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

if (controlBlock) {
    controlBlock.appendChild(
        el ('div', {class: 'form-group'}, [
            el ('label', {}, 'Создать элемент анкеты'),
            el ('div', {class: 'input-group'}, [
                el ('select', {class: 'form-control', name: 'typeQuestion'}, [drawTypes()]),
                el ('span', {class: 'input-group-btn'}, [
                    el ('button', {class: 'btn btn-success', 'data-action': 'add-new-question'}, 'Создать')
                ])
            ])
        ])
    );
}

