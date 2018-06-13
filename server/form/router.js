var models = require('../db/db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('./sql');
var uuid = require('node-uuid');

// 连接池
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

// 加载表单树
router.get('/formTree', (req, res) => {
    var params = req.body;
	var id = params.id;
    var dirSql = "select uid as id,name,parent_uid as pid,'dir' as type from form_dir_info dir where 1 = 1 ";
	var formSql = "select f.id,f.name,f.dir_uid as pid,'node' as type  from form_info f";
    let list = [];
    pool.getConnection(function(err,conn) {
        if(err) {
                console.log(' get connect error ');
        } else {
            conn.query(dirSql, [], function(err, result) {
                if (err) {
                    console.log(err);
                }
                list.push(...result);
                conn.query(formSql, [], function(e, forms) {
                    if (e) {
                        console.log(e);
                    }
                    list.push(...forms);
                    jsonWrite(res, list);
                    conn.release();
                });
            });
        }
    });


});



// 保存表单接口
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
                params.version,
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
			jsonWrite(res, "error");
        } else {
            conn.query(sql, sqlParams, function(err, result) {
                if (err) {
                    console.log(err);
                    jsonWrite(res, "error");
                } else {
                    var currentState = params.currentState;
					console.log(' save currentState ' + (currentState != null));
                    if(currentState) {
					     // 保存视图
						 var stateSql = $sql.state.update;
						 var stateParams = [
							  currentState.name,
							  currentState.code,
							  currentState.description,
							  currentState.stateSource,
							  new Date(),
							  '',
							  currentState.id
						 ]
                         conn.query(stateSql, stateParams, function(err, result) {
							if (err) {
								console.log(err);
								jsonWrite(res, "error");
							} else {
								jsonWrite(res, "success");
							}
							conn.release();
						});
					} else {
						jsonWrite(res, "success");
					    conn.release();
					}
				}
            });
        }
    });


});

// 加载表单接口
router.get('/loadForm', (req, res) => {
      var params = req.query;
	  var id = params.id;
      var sql = $sql.form.select;
      
	  if(!id) {
		  console.log(' id is null ');
		  jsonWrite(res, "error");
		  return ;
	  }

      pool.getConnection(function(err,conn) {
          if(err) {
              console.log(' get connect error ');
			  jsonWrite(res, "error");
          } else {
              conn.query(sql, [id], function(err, result) {
                  if (err) {
                      console.log(err);
					  jsonWrite(res, "error");
					  return ;
                  }
				  var form = result[0];
                  if(!form) {
				      console.log(' form[id=' + id + '] is not exist');
					  jsonWrite(res, "error");
					  return ;
				  }

                  conn.query($sql.state.queryList,[form.uid],function(e, stateList) {
					  if (e) {
						  console.log(e);
						  jsonWrite(res, "error");
						  return ;
					  }
					  form.stateList = stateList;
                      jsonWrite(res, form);
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

// 加载状态接口
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

// 删除状态接口
router.get('/delState', (req, res) => {
    var params = req.query;
	var id = params.id;
    var sql = $sql.state.deleteById;
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
                    jsonWrite(res, "success");
                }
                conn.release();
            });
        }
    });


});

// 保存状态接口
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


// 提交表单
router.post('/submitForm', (req, res) => {
    var params = req.body;
	var id = params.id;
    var sql = id ? $sql.model.update : $sql.model.insert;
	var sqlParams = [];
	console.log(' sql : ' + sql);
    if(id) {
	   // update
	   sqlParams.push(...[
    		   	  params.model_source,
                  'admin',
                  new Date(),
    			  id
    		]);
	} else {
	   // insert 
	   sqlParams.push(...[
    		   	  'model_' + uuid.v1(),
                  params.form_uid,
		          params.model_source,
                  new Date().getTime(),
		          'admin',
                  new Date()
    		]);
	}

    pool.getConnection(function(err,conn) {
        if(err) {
            console.log(' get connect error ');
        } else {
            conn.query(sql, sqlParams, function(err, result) {
                if (err) {
                    console.log(err);
					return ;
                }
				console.log(result[0]);
                if (result) {
                    jsonWrite(res, result[0]);
                }
                conn.release();
            });
        }
    });

});

module.exports = router;
