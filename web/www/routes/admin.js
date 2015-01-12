var Router = require('koa-router'),
    router = new Router();
var getAbsolutePath = require('../../../modules/other/pathUtils').getAbsolutePath;
var model = require(getAbsolutePath('spiders/model'));
var util = require('util');

router.get('/', function *() {
    yield this.render('../www/views/index', {module: 'Statistic'});
});

router.post('/stat', function *() {
    this.type = 'application/json';
    this.body = yield model.countBySource(['soufun', '58', 'anjuke']);
});

router.get('/source/:source', function*() {
    var source = this.params.source;
    var total = yield model.countBySource(source);
    yield this.render('../www/views/source', {module: source, total: total})
});

router.post('/source/:source/:pageSize/:pageIndex', function*() {
    var source = this.params.source;
    var pageSize = this.params.pageSize || 10;
    var pageIndex = this.params.pageIndex || 1;

    this.type = 'application/json';
    this.body = yield model.pagination(source, pageIndex, pageSize);
});

router.get('/house/:houseId', function*() {
    var houseId = this.params.houseId;
    var houseData = yield model.getHouseDetail(houseId);
    houseData = houseData[0] || null;
    console.log(houseData);
    yield this.render('../www/views/house', {
        module: houseData ? houseData.title : '房情不存在', 
        houseData: houseData ? JSON.stringify(houseData) : '{}'
    });
});

module.exports = router;