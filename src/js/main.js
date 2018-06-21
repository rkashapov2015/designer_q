var designerQ = {
    selector: '',
    parentTag: null,
    parentClass: 'parent-elements',
    childClass: 'element',
    dataTemplate: null,
    dataAnswers: null,
    tagView: null,
    mode: 'default',
    saveFunc: function (data) {},
    currentIndexQuestion: 1,
    currentIndexVariant: 1,
    types: [
        { name: 'one', title: 'Одинарный выбор', options: {'variants': 1}, draw: function (options) { return designerQ._drawRadioBlock(options) } },
        { name: 'multi', title: 'Множественный выбор', options: {'variants': 1}, draw: function (options) { return designerQ._drawCheckboxBlock(options) } },
        { name: 'text', title: 'Текстовое поле', options: {}, draw: function (options) { return designerQ._drawTextBox(options) } },
        { name: 'big-text', title: 'Абзац', options: {}, draw: function (options) { return designerQ._drawTextArea(options)} },
        { name: 'description', title: 'Описание', options: {}, draw: function (options) { return designerQ._drawDescription(options) } }  
    ],
    textAnswer: 'Текст вопроса',
    init: function(args) {
        if (typeof args === 'object') {
            if (args.hasOwnProperty('mode')) { designerQ.mode = args.mode; }

            if (args.hasOwnProperty('selector')) { designerQ.selector = args.selector; }

            if (args.hasOwnProperty('dataTemplate')) { designerQ.dataTemplate = jsonParse(args.dataTemplate); }
            if (args.hasOwnProperty('dataAnswers')) { designerQ.dataAnswers = jsonParse(args.dataAnswers); }
            if (args.hasOwnProperty('saveFunc')) { designerQ.saveFunc = args.saveFunc; }
        }
        if (designerQ.selector === '') {
            console.log('selector is not set');
            return false;
        }
        designerQ.parentTag = document.querySelector(designerQ.selector);
        if (!designerQ.parentTag) {
            return false;
        }
        if (designerQ.dataTemplate) {
            var maxId = 1;
            var maxVarId = 1;
            Array.from(designerQ.dataTemplate).forEach( function (element) {
                if (parseInt(element.id) > maxId ) {
                    maxId = parseInt(element.id);
                }

                if (element.hasOwnProperty('variants')) {
                    Array.from(element.variants).forEach (function (variant) {
                        if (parseInt(variant.id) > maxVarId) {
                            maxVarId = parseInt(variant.id);
                        }
                    });
                }
            });
            designerQ.currentIndexQuestion = maxId++;
            designerQ.currentIndexVariant = maxVarId++;
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
        var formTag = document.createElement('form');
        
        if (!designerQ.dataTemplate) {
            console.log('data not exist');
            return false;
        }
        var data = designerQ.dataTemplate;
        Array.from(data).forEach(function (value) {
            formTag.appendChild(designerQ.drawQuestionProd(value.type, value));
        });
        var buttonSave = el ('button', {class: 'btn btn-success'}, 'Сохранить');
        
        formTag.appendChild(el ('div', {class: 'col-xs-12 text-center'}, [
            buttonSave
        ]));
        buttonSave.addEventListener('click', function (e) {
            e.preventDefault();
            designerQ._saveAnswers();
        });
        rootTag.appendChild(formTag);
        rootTag.addEventListener('change', function (e) {
            if (e.target.tagName === 'INPUT' && (e.target.type === 'checkbox' || e.target.type === 'radio')) {
                var name = e.target.name;
                
                if (e.target.nextElementSibling) {
                    var addInput  = e.target.nextElementSibling;
                    if (e.target.checked) {
                        addInput.removeAttribute('disabled');
                    } else {
                        addInput.value = '';
                        addInput.setAttribute('disabled', '1');
                    }
                    
                }
                if (e.target.type == "radio") {
                    Array.from(rootTag.querySelectorAll('input[name="'+ e.target.name +'"]')).forEach( function (element) {
                        if (element.nextElementSibling) {
                            var addInput  = element.nextElementSibling;
                            if (element.checked) {
                                addInput.removeAttribute('disabled');
                            } else {
                                addInput.value = '';
                                addInput.setAttribute('disabled', '1');
                            }
                        }
                    });
                }
            }
        });

        designerQ.tagView = rootTag;
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
            var data = designerQ.dataTemplate;
            var maxId = 1;
            Array.from(data).forEach( function (value) {
                fragmentExistedQuestions.appendChild(designerQ._drawTemplate(value.type, {id: value.id, variants: value.variants?value.variants:[], questionText: value.text}));
                if (value.id > parseInt(maxId)) {
                    maxId = parseInt(value.id);
                }
            });
            designerQ.currentIndexQuestion = parseInt(maxId) + 1;
        }

        fragment.appendChild( el ('div', {class: 'demo', 'style': 'display: none;'}, []) );

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
                            var idIndex = 'q_' + id;
                            
                            var typeInput = value.getAttribute('type');
                            if ((typeInput === 'checkbox' || typeInput === 'radio') && !value.checked) {
                                return false;
                            }

                            var type = '';
                            if (!arrayData.hasOwnProperty(idIndex)) {
                                arrayData[idIndex] = {id: parseInt(id)};
                            }
                            if (name === 'typeQuestion') {
                                arrayData[idIndex]['type'] = value.value;
                            }
                            if (name === 'questionName') {
                                arrayData[idIndex]['text'] = value.value;
                            }
                            if (name === 'qvar') {
                                if (arrayData[idIndex].hasOwnProperty('variants')) {
                                    
                                    if (nameArr.length > 2 && arrayData[idIndex]['variants'].length > 0 ) {
                                        //var old = arrayData[idIndex]['variants'][arrayData[idIndex]['variants'].length-1];
                                        arrayData[idIndex]['variants'][arrayData[idIndex]['variants'].length-1]['checked'] = 1;
                                    } else {
                                        arrayData[idIndex]['variants'].push({id: value.dataset.varId, text: value.value});
                                    }
                                    
                                } else {
                                    arrayData[idIndex]['variants'] = [{id: value.dataset.varId, text: value.value}];
                                }
                            }
                        });
                        //console.log(arrayData);
                        var data = Object.values(arrayData);
                        //console.log(data);
                        console.log(JSON.stringify(data));
                        //designerQ.dataTemplate = JSON.stringify(data);
                        designerQ.dataTemplate = data;
                        
                    break;
                    case 'demo':
                        showBlock(designerQ.parentTag.querySelector('.constructor-block'));
                        var demoBlock = designerQ.parentTag.querySelector('.demo');

                        showBlock(demoBlock);
                        clearNode(demoBlock);
                        if (isHidden(demoBlock)) {
                            return false;
                        }
                        designerQ.draw(demoBlock);
                    break;
                }
            }
        });
        designerQ.parentTag.addEventListener('change', function (e) {
            if (e.target.tagName === 'INPUT' && (e.target.getAttribute('type') === 'checkbox' || e.target.getAttribute('type') === 'radio' )) {
                
            }
        });
        /*designerQ.parentTag.addEventListener('input', function (e) {
            if (e.target.classList.contains('additional-textbox')) {
                //console.log(e.target.value);
                var checkbox = e.target.previousElementSibling;
                if (checkbox && checkbox.tagName === 'INPUT') {
                    if (e.target.value) {
                        checkbox.checked = true;
                    } else {
                        checkbox.checked = false;
                    }
                }
            }
        });*/
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
        name = value;
        var optionVarCheck = {type: "checkbox", name: 'qvar_' + id + '_text', value: 1, tabindex: -1};
        if (typeof value === 'undefined') {
            name = '';
        }
        if (typeof value === 'object') {
            name = value.text;
            if (value.checked) {
                optionVarCheck['checked'] = 1;
            }
        }

        return el ('div', {class: 'variant-tool'}, [
            el ('div', {class: 'input-group'},[
                el ('input', {class: 'form-control', name: 'qvar_' + id , 'placeholder': 'Текст варианта', value: name?name:'', 'data-var-id': designerQ.currentIndexVariant++}),
                el ('span', {class: 'input-group-addon'}, [
                    el ('input', optionVarCheck, 'Текст')
                ]),
                el ('span', {class: 'input-group-btn'}, [
                    el ('button', {class: 'btn btn-danger', 'data-action': 'delete-variant', tabindex: -1}, 'X')
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
                    common.appendChild(el ('div', {class: 'col-xs-12 col-sm-2'}, [
                        el ('div', {class: 'row'}, 'Варианты:')
                    ]))
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
    },
    drawQuestionProd: function (type, options) {
        var id = null;
        var questionText = null;
        var variants = [];
        //console.log(options);
        if (typeof options === 'object') {
            if (options.hasOwnProperty('id')) {
                id = options.id;
            }
            if (options.hasOwnProperty('text')) {
                questionText = options.text;
            }
            if (options.hasOwnProperty('questionText')) {
                questionText = options.questionText;
            }
            if (options.hasOwnProperty('variants')) {
                variants = options.variants;
            }
        }
        
        var commonQuestion = null;
        var className = 'question-view';
        Array.from(designerQ.types).forEach(function(element) {
            if (type === element.name) {
                commonQuestion = element.draw({id: id, questionText: questionText, variants: variants});
            }
        });
        if (type === 'description') {
            className += ' description';
        }

        var common = el ('div', {class: className, 'data-id': id?id:''}, [
            el ('div', {class: 'text-description'}, questionText),
            commonQuestion
        ]);
        return common;
    },
    _drawTextBox: function (options) {
        return designerQ._drawTexts('input', options);
    },
    _drawTextArea: function (options) {
        return designerQ._drawTexts('textarea', options);
    },
    _drawTexts: function (type, options) {
        var name = 'q_' + options.id;
        var tagOptions = {class: 'form-control', name: name};
        /*if (options.hasOwnProperty('value')) {
            tagOptions['value'] = options.value;
        }*/
        if (designerQ.dataAnswers && designerQ.dataAnswers.hasOwnProperty(name)) {
            tagOptions['value'] = designerQ.dataAnswers[name];
        }
        return el (type, tagOptions);
    },
    _drawRadioBlock: function (options) {
        return designerQ._drawCheckboxRadioBlock('radio', options);
    },
    _drawCheckboxBlock: function (options) {
        return designerQ._drawCheckboxRadioBlock('checkbox', options);
    },
    _drawCheckboxRadioBlock: function (type, options) {
        var common = document.createDocumentFragment();
        
        Array.from(options.variants).forEach( function (element, index) {
            var text = element.text;
            var additionalField = false;
            var name = 'q_' + options.id;
            if (element.hasOwnProperty('checked') && element.checked) {
                additionalField = true;
            }
            
            var textNode = document.createDocumentFragment();
            textNode.appendChild(document.createTextNode(text));

            if (additionalField) {
                var optionAddText = {type: 'text', class: 'additional-textbox', name: name + '_' + index,  placeholder: 'Напишите свой вариант', 'data-parent': name};

                if (designerQ.dataAnswers) {
                    if (designerQ.dataAnswers.hasOwnProperty(name + '_' + index)) {
                        optionAddText['value'] = designerQ.dataAnswers[name + '_' + index];
                    }
                    if (
                        (
                            designerQ.dataAnswers.hasOwnProperty(name) && 
                            //designerQ.dataAnswers[name].indexOf(text) == -1
                            findInObjects(designerQ.dataAnswers[name], 'id', element.id) != -1
                        ) || 
                        !designerQ.dataAnswers.hasOwnProperty(name)
                    ) {
                        optionAddText.disabled = '1';
                    }
                } else {
                    optionAddText.disabled = '1';
                }
                textNode.appendChild(el ('input', optionAddText));
            }

            var optionsTag = {type: type, name: name, value: element.id};
            if (
                designerQ.dataAnswers &&
                designerQ.dataAnswers.hasOwnProperty(name) && 
                //designerQ.dataAnswers[name].indexOf(text) != -1
                findInObjects(designerQ.dataAnswers[name], 'id', element.id) != -1
            ) {
                optionsTag['checked'] = 1;
            }
            common.appendChild(
                el ('div', {class: 'variant'}, [
                    el ('label', {}, [
                        el ('input', optionsTag),
                        textNode
                    ])
                ])
            );
        });
        return common;
    },
    _drawDescription: function (options) {
        return document.createTextNode('');
    },
    _saveAnswers: function () {
        var answers = {};
        var frmTag = designerQ.tagView.querySelector('form');
        if (!frmTag) {
            return false;
        }
        var frm = new FormData(frmTag);
        for ( var [k, v] of frm) { 
            //console.log (k, v);
            if (!answers.hasOwnProperty(k)) {
                answers[k] = v;
            } else {
                answers[k] = [answers[k]];
                answers[k].push(v);
            }
        }
        designerQ.dataAnswers = answers;
        //console.log(answers);
        if (typeof designerQ.saveFunc === 'function') {
            designerQ.saveFunc(answers);
        }

        //console.log(JSON.stringify(answers));
        return true;
    }
};