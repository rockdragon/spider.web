/*
 房模型
 @opt:{
 sourceId       '35997962' or '20160857713541' or '53050553'
 province       '北京'
 city           '北京'
 zone           '北京 - 昌平 - 沙河镇'
 address        '东风北桥北，酒仙桥路甲12号'
 overview       '1室1厅2卫 76㎡ 商住两用 精装修 朝向西 2层/3层'
 furniture      '床 / 家具 / 煤气 / 暖气 / 宽带 / 电视 / 冰箱 / 洗衣机 / 热水器'
 phone          '15801429451'
 phonePic       图片<BLOB>
 title          '【21世纪官方推荐】3室2厅125平 出租,南北通透-整租'
 price          '15000元/月'
 payment        '押一付三' '季付' '半年付' '年付' '面议'
 publisher      '个人' '中介'
 contact        '郑小姐'
 housePics      图片<BLOB>数组
 href           'http://bj.58.com/hezu/19996422443272x.shtml'
 source         'ganji' '58' 'anjuke' 'soufun'
 publishDate    '2014/11/15'
 description    '...'
 longitude      '116.465118408203'   经度
 latitude       '39.9008178710938'   纬度
 cityId         '1'
 }
 */
function House(opt) {
    opt = opt || {};
    if (opt.sourceId)this.sourceId = opt.sourceId;
    if (opt.province)this.province = opt.province;
    if (opt.city)this.city = opt.city;
    if (opt.zone)this.zone = opt.zone;
    if (opt.address)this.address = opt.address;
    if (opt.overview)this.overview = opt.overview;
    if (opt.furniture)this.furniture = opt.furniture;
    if (opt.phone)this.phone = opt.phone;
    if (opt.phonePic)this.phonePic = opt.phonePic;
    if (opt.title)this.title = opt.title;
    if (opt.price)this.price = opt.price;
    if (opt.payment)this.payment = opt.payment;
    if (opt.publisher)this.publisher = opt.publisher;
    if (opt.contact)this.contact = opt.contact;
    if (opt.housePics)this.housePics = opt.housePics;
    if (opt.href)this.href = opt.href;
    if (opt.source)this.source = opt.source;
    if (opt.publishDate)this.publishDate = opt.publishDate;
    if (opt.description)this.description = opt.description;
    if (opt.longitude)this.longitude = opt.longitude;
    if (opt.latitude)this.latitude = opt.latitude;
    if (opt.cityId)this.cityId = opt.cityId;
}

/*
 列表模块
 @opt{
 url:       http://zu.fang.com/house/list/
 houses:    [house, house, ...]
 pages:     ['http://zu.fang.com/house/list/i32/', 'http://zu.fang.com/house/list/i33/', ...]
 }
 */
function listPage(opt) {
    opt = opt || {};
    if (opt.url)this.url = opt.url;
    if (opt.houses)this.houses = opt.houses;
    if (opt.pages)this.pages = opt.pages;
}

var configs = require('../modules/config/configUtils').getConfigs();
if (configs && configs.DBConnection) {
    var Sequelize = require('sequelize')
        , sequelize = new Sequelize(configs.DBConnection);
    var cryptoUtils = require('../modules/other/cryptoUtils');
    var _ = require('underscore');
    var util = require('util');
    /*
     Data Model

     * 没有经纬度的不收录
     */
    var HouseModel = sequelize.define('House', {
        id: {type: Sequelize.STRING, primaryKey: true, unique: true},
        province: {type: Sequelize.STRING},
        city: {type: Sequelize.STRING},
        zone: {type: Sequelize.STRING},
        address: {type: Sequelize.STRING},
        overview: {type: Sequelize.STRING},
        furniture: {type: Sequelize.STRING},
        phone: {type: Sequelize.STRING},
        phonePic: {type: Sequelize.BLOB},
        title: {type: Sequelize.STRING, allowNull: false},
        price: {type: Sequelize.DECIMAL, allowNull: false},
        payment: {type: Sequelize.STRING},
        publisher: {type: Sequelize.STRING},
        contact: {type: Sequelize.STRING},
        href: {type: Sequelize.STRING, allowNull: false},
        source: {type: Sequelize.STRING},
        publishDate: {type: Sequelize.DATE, allowNull: false},
        description: {type: Sequelize.TEXT},
        longitude: {type: Sequelize.DECIMAL(18, 15)},
        latitude: {type: Sequelize.DECIMAL(18, 15)},
        cityId: {type: Sequelize.INTEGER}
    }, {
        // add the timestamp attributes (updatedAt, createdAt)
        timestamps: true,

        // don't delete database entries but set the newly added attribute deletedAt
        // to the current date (when deletion was done). paranoid will only work if
        // timestamps are enabled
        paranoid: true,

        // disable the modification of tablenames; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,

        // define the table's name
        tableName: 'House',

        //indexes
        indexes: [
            {
                name: 'pubdate',
                method: 'BTREE',
                fields: [{attribute: 'publishDate', order: 'DESC'}]
            }
        ]
    });

    var HousePicModel = sequelize.define('HousePic', {
        id: {type: Sequelize.BIGINT, primaryKey: true, unique: true, autoIncrement: true},
        housePic: {type: Sequelize.BLOB}
    }, {
        // add the timestamp attributes (updatedAt, createdAt)
        timestamps: true,

        // don't delete database entries but set the newly added attribute deletedAt
        // to the current date (when deletion was done). paranoid will only work if
        // timestamps are enabled
        paranoid: true,

        // disable the modification of tablenames; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,

        // define the table's name
        tableName: 'HousePic'
    });

    HouseModel.hasMany(HousePicModel, {as: 'HousePics'});
    HousePicModel.belongsTo(HouseModel, {as: 'House'});

    /*
     * synchronize DB
     * */
    function synchronize() {
        return sequelize.sync();
    }

    /*
     * bulk insert
     */
    function bulkCreate(house) {
        house.id = cryptoUtils.encrypt(configs.SECRET, house.source, house.sourceId);
        return HouseModel.count({where: ["id = ?", house.id]}).then(function (c) {
            if (c === 0) {
                return HouseModel.create(house).then(function (houseFromDB) {
                    if (house.housePics) {
                        var pics = [];
                        for (var i = 0, len = house.housePics.length; i < len; i++) {
                            house.housePics[i].HouseId = houseFromDB.id;
                            pics.push(house.housePics[i]);
                        }
                        return HousePicModel.bulkCreate(pics);
                    } else
                        return Promise.resolve(true);
                });
            } else {
                console.log('house %s already had been exists.', house.title);
                return Promise.resolve(true);
            }
        });
    }

    /*
     * find one
     */
    function findOne(opts) {
        opts.include = {
            model: HousePicModel,
            as: 'HousePics'
        };
        return HouseModel.findOne(opts);
    }

    /*
     * query a bundle of count, or single
     * */
    function countBySource(source) {
        if (_.isArray(source)) {
            var query = [];
            for (var i = 0, len = source.length; i < len; i++) {
                var q = util.format('SELECT count(1) ct FROM spider.House where source = "%s"', source[i]);
                query.push(q);
            }
            return sequelize.query(query.join(' UNION ALL ')).then(function (tb) {
                return tb;
            });
        }
        return sequelize.query('SELECT count(1) ct FROM spider.House where source = :source', null,
            {raw: true}, {source: source}).then(function (tb) {
                return tb[0].ct;
            });
    }

    function pageCount(source, number) {
        return sequelize.query('SELECT count(1) as ct FROM spider.House where source = :source'
            , null,
            {raw: true},
            {source: source}).then(function (tb) {
                var count = tb[0].ct;
                var pageCount = parseInt(count / number);
                if (count % number !== 0)
                    pageCount++;
                return pageCount;
            });
    }

    /*
     * pagination of house
     * */
    function pagination(source, page, number) {
        page = parseInt(page);
        number = parseInt(number);
        var offset = (page - 1) * number;
        return sequelize.query('SELECT title FROM spider.House where source = :source order by publishDate desc limit :offset, :number'
            , null,
            {raw: true},
            {source: source, offset: offset, number: number}).then(function (tb) {
                return tb;
            });
    }

    module.exports.HouseModel = HouseModel;
    module.exports.HousePicModel = HousePicModel;
    module.exports.sequelize = sequelize;
    module.exports.synchronize = synchronize;
    module.exports.bulkCreate = bulkCreate;
    module.exports.findOne = findOne;
    module.exports.countBySource = countBySource;
    module.exports.pagination = pagination;
    module.exports.pageCount = pageCount;
}

module.exports.House = House;
module.exports.listPage = listPage;

