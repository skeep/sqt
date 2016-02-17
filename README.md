# sqt (SQL Query Template)

[![Coverage Status](https://coveralls.io/repos/github/skeep/sqt/badge.svg?branch=master)](https://coveralls.io/github/skeep/sqt?branch=master)

Given you have two sql files:
 
### add.sql
```sql
SELECT {{x}}+{{y}} as solution;
```

### multiply.sql
```sql
SELECT {{x}}*{{y}} as solution;
```


You could run the query as follows : 

```javascript
const mysql      = require('mysql'),
      connection = mysql.createConnection({
        host    : 'localhost',
        user    : 'root',
        password: '',
        database: 'test'
      });

connection.connect();
const sqt         = require('sqt');
var files         = 'q/add',
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

```javascript
const mysql      = require('mysql'),
      connection = mysql.createConnection({
        host    : 'localhost',
        user    : 'root',
        password: '',
        database: 'test'
      });

connection.connect();
const sqt         = require('sqt');
var files         = ['q/add', 'q/multiply.sql'],
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
