var Router = require('koa-router'),
    router = new Router();
var getAbsolutePath = require('../../modules/other/pathUtils').getAbsolutePath;
var model = require(getAbsolutePath('spiders/model'));

router.get('/', function *() {
    yield this.render('index', {module: 'Statistic'});
});

router.post('/stat', function *() {
    this.type = 'application/json';
    this.body = yield model.countBySource(['soufun', '58', 'anjuke']);
});

router.get('/source/:source', function*() {
    var source = this.params.source;
    yield this.render('source', {module: source})
});

router.post('/source/:source/:pageSize/:pageIndex', function*() {
    var source = this.params.source;
    var pageSize = this.params.pageSize || 10;
    var pageIndex = this.params.pageIndex || 1;

    this.type = 'application/json';
    this.body = yield model.pagination(source, pageSize, pageIndex);
});

module.exports = router;