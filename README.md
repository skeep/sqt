# sqt (SQL Query Template)

[![Coverage Status](https://coveralls.io/repos/github/skeep/sqt/badge.svg?branch=master)](https://coveralls.io/github/skeep/sqt?branch=master)
[![Build Status](https://travis-ci.org/skeep/sqt.svg?branch=master)](https://travis-ci.org/skeep/sqt)

SQT do not intend to replace ORM. But stay along with an ORM and provide facility to use hand-crafted queries. eg. complex reporting.
But problem with handcrafted queries are that the query generally lies inside a `.rb` or `.js` or `.java` etc. file and possibly and within lot of other business logic code.
But wouldn't it be nice if these queries can be stored in separate template `.sql` files and each parameter can be replaced using handlebar.

And if u need multiple queries , get the result and then do some data manipulation (which is a common scenario in any serious app) 
that facility is also there.
So intention of SQT is not to replace ORM but encourage hand crafted queries when needed and providing a sane way to do it not hiding the query within a file

Given you have one sql files:
 
### add.sql
```sql
SELECT {{x}}+{{y}} as solution;
```


You could run the query as follows : 

```javascript
var mysql      = require('mysql'),
    sqt        = require('sqt'),
    connection = mysql.createConnection({
      host    : 'localhost',
      user    : 'root',
      password: '',
      database: 'test'
    });

connection.connect();

var files       = 'q/add',
    queryParams = {x: 5, y: 10},
    cb          = function (result) {
      console.log(result);    // {solution : 15}
    };
try {
  sqt(connection, files, queryParams, cb);
} catch (e) {
  console.log(e);
}
connection.end();
```

Multiple queries can also be provided as below.

Lets say you have another sql file.

### multiply.sql
```sql
SELECT {{x}}*{{y}} as solution;
```

```javascript
var mysql      = require('mysql'),
    sqt        = require('sqt'),
    connection = mysql.createConnection({
      host    : 'localhost',
      user    : 'root',
      password: '',
      database: 'test'
    });

connection.connect();

var files       = ['q/add', 'q/multiply.sql'],
    queryParams = [{x: 5, y: 10}, {x: 5, y: 10}],
    cb          = function (result) {
      console.log(result);    // [{solution : 15}, {solution : 50}]
    };
try {
  sqt(connection, files, queryParams, cb);
} catch (e) {
  console.log(e);
}
connection.end();
```
