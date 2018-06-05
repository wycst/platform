var models = require('../db/db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('./sql');
var uuid = require('node-uuid');

var pool = mysql.createPool(models.mysql);

// 连接数据库
// var conn = mysql.createConnection(models.mysql);
// conn.connect();

/*conn.on('close',function(err) {
    if(err) {
         conn = mysql.createConnection(conn.config());
    } else {
         console.log(' conn is closed ! ');
    }
});*/



var jsonWrite = function(res, ret) {
    if(!ret) {
        res.json('');
    } else {
        res.json(ret);
    }
};

// 增加表单接口
router.post('/saveForm', (req, res) => {
    var params = req.body;
	var id = params.id;
    var sql = id ? $sql.form.update:$sql.form.insert;
	var sqlParams = [];
    if(id) {
  	    sqlParams.push(...[
    		   	      params.name,
                  params.code,
                  params.description,
                  new Date(),
                  params.formSource,
    			        id
    		]);
  	} else {
  	    sqlParams.push(...[
  		   	      params.name,
                params.code,
                params.description,
                uuid.v1(),
    			      new Date(),
    			      0,
                params.formSource,
    			      'form_01'
    		]);
  	}
    pool.getConnection(function(err,conn) {
        if(err) {
                console.log(' get connect error ');
        } else {
            conn.query(sql, sqlParams, function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
                conn.release();
            });
        }
    });


});

// 增加用户接口
router.get('/loadForm', (req, res) => {
      var params = req.query;
	  var id = params.id;
      var sql = $sql.form.select;

      pool.getConnection(function(err,conn) {
          if(err) {
                  console.log(' get connect error ');
          } else {
              conn.query(sql, [id], function(err, result) {
                  if (err) {
                      console.log(err);
					  return ;
                  }
				  var form = result[0];
                  conn.query($sql.state.queryList,[form.uid],function(e, stateList) {
					  if (e) {
						  console.log(e);
						  return ;
					  }
					  form.stateList = stateList;
                      jsonWrite(res, result);
					  conn.release();
				  });
                  
              });
          }
      });
});

// 增加状态接口
router.post('/addState', (req, res) => {
    var params = req.body;
    var sql = $sql.state.insert;
	var sqlParams = [];
	sqlParams.push(...[
			params.name,
			params.code,
			params.description,
			uuid.v1(),
			new Date(),
			params.form_uid,
            params.state_source,
		    params.order_index
		]);
    pool.getConnection(function(err,conn) {
        if(err) {
            console.log(' get connect error ');
        } else {
            conn.query(sql, sqlParams, function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
                conn.release();
            });
        }
    });


});

// 加载接口
router.get('/loadState', (req, res) => {
    var params = req.query;
	var id = params.id;
    var sql = $sql.state.select;
	var sqlParams = [];
	
    console.log(' sql : ' + sql);
	console.log(' params : ' + [id]);

    pool.getConnection(function(err,conn) {
        if(err) {
            console.log(' get connect error ');
        } else {
            conn.query(sql, [id], function(err, result) {
                if (err) {
                    console.log(err);
					return ;
                }
                if (result) {
                    jsonWrite(res, result[0]);
                }
                conn.release();
            });
        }
    });


});

// 加载接口
router.post('/saveState', (req, res) => {
    var params = req.body;
	var id = params.id;
    var sql = $sql.state.update;
	var sqlParams = [];
	
	sqlParams.push(...[
    		   	  params.name,
                  params.code,
                  params.description,
		          params.stateSource,
                  new Date(),
                  '',
    			  id
    		]);
	console.log(' sql : ' + sql);
    console.log(' sqlParams : ' + sqlParams);

    pool.getConnection(function(err,conn) {
        if(err) {
            console.log(' get connect error ');
        } else {
            conn.query(sql, sqlParams, function(err, result) {
                if (err) {
                    console.log(err);
					return ;
                }
                if (result) {
                    jsonWrite(res, result[0]);
                }
                conn.release();
            });
        }
    });


});


module.exports = router;
