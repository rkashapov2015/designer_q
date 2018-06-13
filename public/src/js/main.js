
dragElement.init();


var parentElements = document.querySelector('.parent-elements');
var controlBlock = document.querySelector('.design-q-controls');
var currentIndexQuestion = 1;

document.addEventListener('click', function (e) {
    var action = e.target.getAttribute('data-action');
    if (action) {
        e.preventDefault();
        console.log(action);
        if (action == 'designer-new-question') {
            parentElements.appendChild(drawQuestionTemplate('one', currentIndexQuestion));
            currentIndexQuestion++;
        }
    }
})

var types = [
    { name: 'one', title: 'Одинарный выбор', options: [] },
    { name: 'multi', title: 'Множественный выбор', options: [] },
    { name: 'text', title: 'Текстовое поле', options: [] },
    { name: 'big-text', title: 'Абзац', options: [] },
    { name: 'description', title: 'Описание', options: [] } 
];
var textAnswer = 'Текст вопроса';

function drawTypes(selectedType) {
    var fragment = types.reduce(
        function (fragment, cur) {
            var option = {value: cur.name};
            if (selectedType && selectedType == cur.name) {
                option['selected'] = '';
            }
            fragment.appendChild( el('option', option, cur.title) );
            return fragment;
        }, 
        document.createDocumentFragment()
    );
    return fragment;
}

function drawQuestionTemplate(type, id) {
    /*switch (data.type) {
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
    }*/
    return _drawQuestionTemplateOne(id);
}

function _drawQuestionTemplateOne(id) {
    return el ('div', {class: 'element question-element', 'data-id': id}, [
        el ('div', {class: 'question-type'}, [
            el ('select', {class: 'form-control', name: 'typeQuestion' + id}, [drawTypes('one')])
        ]),
        el ('div', {class: 'question-close'}, [
            el ('button', {class: 'btn btn-danger btn-sm', 'data-action': 'delete'}, 'X')
        ]),
        el ('div', {class: 'question-text'}, [
            el ('input', {class: 'form-control', name: 'questionName' + id, placeholder: textAnswer, type: 'text'})
        ])
    ]);
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

