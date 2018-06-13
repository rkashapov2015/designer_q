
var designerQ = {
    selector: '',
    parentTag: null,
    parentClass: 'parent-elements',
    childClass: 'element',
    dataTemplate: null,
    dataAnswers: null,
    mode: 'default',
    urlGet: null,
    urlSet: null,
    currentIndexQuestion: 1,
    types: [
        { name: 'one', title: 'Одинарный выбор', options: {'variants': 1} },
        { name: 'multi', title: 'Множественный выбор', options: {'variants': 1} },
        { name: 'text', title: 'Текстовое поле', options: {} },
        { name: 'big-text', title: 'Абзац', options: {} },
        { name: 'description', title: 'Описание', options: {} } 
    ],
    textAnswer: 'Текст вопроса',
    init: function(args) {
        if (typeof args === 'object') {
            if (args.hasOwnProperty('mode')) {
                designerQ.mode = args.mode;
            }
            if (args.hasOwnProperty('selector')) {
                designerQ.selector = args.selector;
            }
            if (args.hasOwnProperty('dataTemplate')) {
                this.dataTemplate = args.dataTemplate;
            }
        }
        if (designerQ.selector === '') {
            console.log('selector is not set');
            return false;
        }
        designerQ.parentTag = document.querySelector(designerQ.selector);
        if (!designerQ.parentTag) {
            return false;
        }

        if (designerQ.mode === 'default') {
            designerQ.draw();
        } else if (designerQ.mode === 'constructor') {
            designerQ.drawConstructor();
        } else {
            return false;
        }
    },
    drawTypes: function (selectedType) {
        var fragment = designerQ.types.reduce(
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
    },
    draw: function (rootTag) {
        if (typeof rootTag === 'undefined') {
            rootTag = designerQ.parentTag;
        }
        if (!designerQ.dataTemplate) {
            console.log('data not exist');
        }
        
    },
    drawConstructor: function () {
        if (!designerQ.parentTag) {
            console.log('parent not exist');
            return false;
        }
        var fragment = document.createDocumentFragment();
        fragment.appendChild(el ('div', {class: 'col-xs-12 form-group'}, [
            el ('div', {class: 'row'}, [
                el ('div', {class: 'design-q-controls-top'}, [
                    el ('button', {class: 'btn btn-info', 'data-action': 'demo'}, 'Демо')
                ])
            ])
        ]));
        
        var fragmentExistedQuestions = document.createDocumentFragment();

        if (designerQ.dataTemplate) {
            var data = JSON.parse(designerQ.dataTemplate);
            var maxId = 1;
            Array.from(data).forEach( function (value) {
                fragmentExistedQuestions.appendChild(designerQ._drawTemplate(value.type, {id: value.id, variants: value.variants?value.variants:[], questionText: value.text}));
                if (value.id > parseInt(maxId)) {
                    maxId = parseInt(value.id);
                }
            });
            designerQ.currentIndexQuestion = parseInt(maxId) + 1;
        }

        fragment.appendChild( el ('div', {class: 'col-xs-12 demo', 'style': 'display: none;'}, []) );

        fragment.appendChild(
            el ('div', {class: 'constructor-block'}, [
                el ('div', {class: 'col-xs-12'}, [
                    el ('div', {class: 'row'}, [
                        el ('div', {class: designerQ.parentClass + ' designer-construct'}, [fragmentExistedQuestions])
                    ])
                ]),
                el('div', {class: 'col-xs-12'}, [
                    el ('div', {class: 'row'}, [
                        el ('div', {class: 'design-q-controls'})
                    ])
                ])
            ])
        );

        designerQ.parentTag.appendChild(fragment);

        var parentElements = designerQ.parentTag.querySelector('.' + designerQ.parentClass);
        var controlBlock = designerQ.parentTag.querySelector('.design-q-controls');

        designerQ.parentTag.addEventListener('change', function (e) {
            if (e.target.tagName === 'SELECT' && e.target.classList.contains('type-question')) {
                e.preventDefault();
                var type = e.target.value;
                //console.log(type);
                var parent = getParentByClassname(e.target, 'question-element');
                var id = parent.dataset.id;
                var afterElement = parent.nextElementSibling;
                var text = parent.querySelector('.question-text > input').value;
                parentElements.removeChild(parent);
                parentElements.insertBefore(designerQ.drawQuestionTemplate(type, {id: id, questionText: text}), afterElement);
            }
        });

        designerQ.parentTag.addEventListener('click', function (e) {
            var action = e.target.getAttribute('data-action');
            if (action) {
                e.preventDefault();
                switch (action) {
                    case 'designer-new-question':
                        var typeQuestion = document.querySelector('select[name="typeQuestion"]');
                        parentElements.appendChild(designerQ.drawQuestionTemplate(typeQuestion.value, {id: designerQ.currentIndexQuestion}));
                        designerQ.currentIndexQuestion++;
                    break;
                    case 'delete-question':
                        var parent = getParentByClassname(e.target, 'question-element');
                        if (parent) {
                            parentElements.removeChild(parent);
                        }
                    break;
                    case 'add-variant':
                        var parent = getParentByClassname(e.target, 'question-element');
                        if (parent) {
                            var variants = parent.querySelector('.variants');
                            variants.insertBefore( designerQ._drawQuestionVariant(parent.dataset.id), e.target );
                        }
                    break;
                    case 'delete-variant': 
                        var parent = getParentByClassname(e.target, 'variant-tool');
                        if (parent) { parent.parentNode.removeChild(parent); }
                    break;
                    case 'save-template':
                        var inputs = parentElements.querySelectorAll('input, select');
                        var arrayData = {};
                        Array.from(inputs).forEach( function (value, index) {
                            var nameArr = value.name.split('_');
                            var name = nameArr[0];
                            var id = nameArr[1];
                            //console.log(nameArr);
                            var type = '';
                            if (!arrayData.hasOwnProperty(id)) {
                                arrayData[id] = {id: parseInt(id)};
                            }
                            if (name === 'typeQuestion') {
                                arrayData[id]['type'] = value.value;
                            }
                            if (name === 'questionName') {
                                arrayData[id]['text'] = value.value;
                            }
                            if (name === 'qvar') {
                                if (arrayData[id].hasOwnProperty('variants')) {
                                    arrayData[id]['variants'].push(value.value);
                                } else {
                                    arrayData[id]['variants'] = [value.value];
                                }
                            }
  
                        });
                        //console.log(arrayData);
                        var data = Object.values(arrayData);
                        console.log(data);
                        console.log(JSON.stringify(data));
                        
                    break;
                    case 'demo':
                        showBlock(document.querySelector('.constructor-block'));
                    break;
                }
            }
        });
        controlBlock.appendChild(
            el ('div', {class: 'form-group'}, [
                el ('label', {}, 'Создать элемент анкеты'),
                el ('div', {class: 'input-group'}, [
                    el ('select', {class: 'form-control', name: 'typeQuestion'}, [designerQ.drawTypes()]),
                    el ('span', {class: 'input-group-btn'}, [
                        el ('button', {class: 'btn btn-success', 'data-action': 'designer-new-question'}, 'Создать')
                    ])
                ])
            ])
        );
        controlBlock.appendChild(
            el ('div', {class: 'form-group text-center'}, [
                el ('button', {class: 'btn btn-success', 'data-action': 'save-template'}, 'Сохранить')
            ])
        );
        dragElement.init({parentClass: designerQ.parentClass, childClass: designerQ.childClass});
    },
    drawQuestionTemplate: function (type, options) {
        return designerQ._drawTemplate(type, options);
    },
    _drawQuestionVariant: function(id, value) {
        return el ('div', {class: 'variant-tool'}, [
            el ('div', {class: 'input-group'},[
                el ('input', {class: 'form-control', name: 'qvar_' + id , 'placeholder': 'Текст варианта', value: value?value:''}),
                el ('span', {class: 'input-group-btn'}, [
                    el ('button', {class: 'btn btn-danger', 'data-action': 'delete-variant'}, 'X')
                ])
            ])
        ])
    },
    _drawTemplate: function (type, options) {
        var id = null;
        var questionText = '';
        var variants = [];
        if (typeof options === 'object') {
            if (options.hasOwnProperty('id')) {
                id = options.id;
            }
            if (options.hasOwnProperty('questionText')) {
                questionText = options.questionText;
            }
            if (options.hasOwnProperty('variants')) {
                variants = options.variants;
            }
        }
        var common = el ('div', {class: 'element question-element', 'data-id': id}, [
            el ('div', {class: 'question-type'}, [
                el ('select', {class: 'form-control type-question', name: 'typeQuestion_' + id}, [designerQ.drawTypes(type)])
            ]),
            el ('div', {class: 'question-close'}, [
                el ('button', {class: 'btn btn-danger btn-sm', 'data-action': 'delete-question'}, 'X')
            ]),
            el ('div', {class: 'question-text'}, [
                el ('input', {class: 'form-control', name: 'questionName_' + id, placeholder: designerQ.textAnswer, type: 'text', value: questionText})
            ])
        ]);
        
        var fragmentVariants = document.createDocumentFragment();
        if (variants) {
            variants.forEach(function (value) {
                fragmentVariants.appendChild(designerQ._drawQuestionVariant(id, value));
            })
        } else {
            fragmentVariants.appendChild(designerQ._drawQuestionVariant(id));
        }
        

        designerQ.types.forEach( function (data) {
            if (type === data.name) {
                if (data.options.hasOwnProperty('variants')) {
                    common.appendChild(el ('div', {class: 'col-xs-12 col-sm-2'}, 'Варианты:'))
                    common.appendChild(
                        el ('div', {class: 'col-xs-12 col-sm-10'}, [
                            el ('div', {class: 'variants'}, [
                                fragmentVariants,
                                el ('button', {class: 'btn btn-success btn-sm', 'data-action': 'add-variant'}, '+')
                            ])
                        ])
                    );
                }
            }
        });

        return common;
    }
};


