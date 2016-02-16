var chai           = require('chai'),
    expect         = chai.expect,
    chaiAsPromised = require('chai-as-promised'),
    sqt            = require('../index'),
    sinon          = require('sinon'),
    mysql          = require('mysql');

chai.use(chaiAsPromised);

var connection          = mysql.createConnection({
      host    : 'localhost',
      user    : 'root',
      password: '',
      database: 'test'
    }),

    singleFile          = './example/q/add',
    multipleFile        = ['./example/q/add', './example/q/multiply'],
    singleQueryParams   = {x: 5, y: 10},
    multipleQueryParams = [{x: 5, y: 10}, {x: 5, y: 10}];

before(function(){
  connection.connect();
});

after(function(){
  connection.end();
});

beforeEach(function () {
  sinon.spy(connection, 'query');
});

afterEach(function () {
  connection.query.restore();
});

describe('happy path tests', function () {
  it('should do single query', function (done) {
    var cb = function (result) {
      expect(result.data).to.have.length(1);
      expect(connection.query.calledOnce);
      done();
    };
    sqt(connection, singleFile, singleQueryParams, cb);
  });
  it('should do two query', function (done) {
    var cb = function (result) {
      expect(result).to.have.length(2);
      expect(connection.query.calledTwice).to.be.true;
      done();
    };
    sqt(connection, multipleFile, multipleQueryParams, cb);
  });
});






