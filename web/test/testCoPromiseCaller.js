var testCoPromise = require('./testCoPromise');

testCoPromise.read('config.cfg')
    .then(function (res) {
        console.log(res);
    }, onError);

function onError(e){
    console.log(e.stack);
}

