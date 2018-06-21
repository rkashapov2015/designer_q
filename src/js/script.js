
/*designerQ.init({
    selector: '#main',
    mode: 'constructor'
}
);*/

sendData('http://rest_al/v1/questions/template?id=1', null, function (data) {
    designerQ.init({
            selector: '#main',
            mode: 'constructor',
            dataTemplate: data,
            saveFunc: function (data) {
                console.log(data);
            }
        }
    );
});