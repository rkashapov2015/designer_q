
designerQ.init({
    selector: '#main',
    mode: 'constructor',
    saveFunc: function (data) {console.log(data);}
});

/*sendData('http://rest_al/v1/questions/template?id=1', null, function (data) {
    designerQ.init({
            selector: '#main',
            mode: 'default',
            dataTemplate: data,
            saveFunc: function (data) {
                console.log(data);
            }
        }
    );
});*/