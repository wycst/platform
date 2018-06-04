目录表：dir_info
   ①基本信息：     id,name,code,description,
   ②业务关联使用： uid(唯一),parent_uid
   ③目录类型    ： dir_type      流程类/表单类/流程表单类/其他
DROP TABLE IF EXISTS `workflowinter`.`form_dir_info`;
CREATE TABLE  `workflowinter`.`form_dir_info` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(100) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `uid` varchar(100) NOT NULL,
  `dir_type` int(10) unsigned DEFAULT NULL,
  `parent_uid` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Index_2` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


1 表单信息表：form_info
   字段描述如下
   ①基本信息：     id,name,code,description,
   ②业务关联使用： uid(唯一)
   ③操作时间记录： create_time,creator = admin,update_time,publish_time
   ④发布状态：     status
   ⑤关联物理表：   association_table (关联物理表名，如果为空不关联表),
   ⑥JSON源代码：   form_source(表单源代码，json格式,longtext格式),
   ⑦表单html：     form_html(渲染生成的html暂时不用，先创建)
   ⑧存储目录UID    dir_uid
   ⑨表单类型       form_type
   
DROP TABLE IF EXISTS `workflowinter`.`form_info`;
CREATE TABLE  `workflowinter`.`form_info` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `uid` varchar(100) NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `creator` varchar(50) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `publish_time` datetime DEFAULT NULL,
  `status` int(10) unsigned NOT NULL,
  `association_table` varchar(50) DEFAULT NULL,
  `form_source` longtext,
  `form_html` longtext,
  `dir_uid` varchar(100) DEFAULT NULL,
  `form_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Index_2` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



2 表单视图: form_view_info 
视图的作用仅仅是复用的功能，替换有可能的重复操作。(可复用子表单，可看做一个rows的容器)
视图没有数据储存，也没有业务字段，无需发布，视图可预览，无按钮
   字段描述如下
   ①基本信息：           id,name,code,description,
   ②操作时间记录 ：      create_time,creator,update_time
   ③JSON源代码           view_source,view_html
   ④存储目录             dir_uid

DROP TABLE IF EXISTS `workflowinter`.`form_view_info`;
CREATE TABLE  `workflowinter`.`form_view_info` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `creator` varchar(50) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `view_source` longtext,
  `view_html` longtext,
  `dir_uid` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

 关系：（视图内部的元素可在表单编辑时进行任意拖动，
   视图与表单，视图和视图之间也可以灵活交换元素）
   视图默认占位表单的一行一列（span=24）
   表单通过编辑选择添加一个视图后，表单与该视图的关系解除，表单与视图没有物理关联
   视图添加到表单后优先使用表单的布局样式
   视图可以从已有视图中添加通过编辑保存为新的视图，新旧视图没有逻辑和物理关系

3 表单状态：form_state_info 

场景： 一般情况下一个工作流从开始建单到结束，应该只使用了其中一个表单。
       工作流过程中每个环节的表单元素可能都不一样，比如组件的只读，必填等信息。
      （非工作流使用的表单可能无此需求）

作用： 同一个表单，不同状态呈现不同的控制结果
一个表单状态必然只属于一个表单，状态的创建入口在表单
状态的设置不会修改表单行列的增多和减少，一般情况下状态只能控制组件：
   显示，隐藏，只读，必填等信息

   状态影响内容：
隐藏：
   如果表单一行原来2个列，每个列占50%宽，其中一个列隐藏，另一个列占100%；
   （widthPercent = 100 / columns.length - hideCounts %）
   列上面添加v-if='isShow'

   如果columns.length - hideCounts = 0 ,不渲染当前行
   在当前行添加 v-if='columns.length - hideCounts = 0'
   当前行信息中如果 hide ，也不渲染， v-if='调用一个函数，传递row对象，state对象'

只读： 
   针对列上面的组件
   通过Object.assign合并属性到column.model.props

必填：
   针对列上面的form输入组件，其他组件无效
   必填的项在formitem组件中加入required属性

按钮的隐藏
   v-if='show'

数据同步问题？
   如果表单的组件删除了，状态表中对应的信息怎么办？
   通过下次保存自动删除。（状态表不删除也不影响）

   设计出的字段描述如下：
   ①基本信息：     id,name,code,description,
   ②关联关系：     ref_uid        （所属表单的唯一标示）
   ③操作时间记录 ：create_time,update_time
   ④JSON源代码     state_source
   ⑤业务唯一标示   uid             (比如工作流某个环节)
   ⑥其他信息       index(排序)
   ⑦视图影响的结果，通过代码翻译成文本字符串，供查看使用

DROP TABLE IF EXISTS `workflowinter`.`form_state_info`;
CREATE TABLE  `workflowinter`.`form_state_info` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `form_uid` varchar(100) NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `creator` varchar(50) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `state_source` longtext,
  `uid` varchar(100) NOT NULL,
  `order_index` int(10) unsigned NOT NULL,
  `effect_text` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Index_uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


   如果表单没有状态，表单按默认的设计显示
   状态的json如何设计？
   
   按如上分析，state的json应该如下：
       {
            id : '',
            stateBaseInfo : {
	         name : '',
		 code : '',
		 description : ''
	    },
            stateElements : {
	         'asdsdsdsd-sdsdsdsd-id' : {
		      readonly : true,
		      hide     : true
		 },
                 'asdsdsdsd-sdsdsdsd-id' : {
		      readonly : true,
		      hide     : true
		 }
	    }
       }
 
      编辑表单状态时，如何获取状态，保存状态信息？
      
      设计模型树，树结构按行（index）,列
 

      布局： 
          west：表单树===》选择一个表单=== 加载所有的状态列表

          center：选择一个表单时（无状态），内容区为设计
	  east  ：右侧为各种设置
	  
          如果选择了表单状态，内容区不变，右则为状态的设计
          根据选择的不同组件，行，列，直接显示不同的状态控制；
          

4 字段映射表 form_keycolumn_mapping_info

   id ,form_uid,comp_key,column_name,description

   如果表单关联物理表时，表单组件的key与物理表的关联关系记录

DROP TABLE IF EXISTS `workflowinter`.`form_keycolumn_mapping_info`;
CREATE TABLE  `workflowinter`.`form_keycolumn_mapping_info` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `form_uid` varchar(100) NOT NULL,
  `comp_key` varchar(100) NOT NULL,
  `column_name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



5 表单数据（模型）表：form_model_info


关系：

表单信息表----------表单数据（实例模型）表
 一对多

表单信息表----------表单视图
 一对多

表单数据（实例模型）表   表单视图


1 隐藏域是否有必要设计？隐藏域的值从哪里来？怎么投入使用？
2 模型树设计？
3 是否设计子表单嵌套？子表单属于一个没有操作栏按钮的表单视图
  视图默认属于表单的单行单列（span=24）
  视图组件没有form标签，里面的组件如何实现v-model

  视图组件设计一个viewKey 和 form输出类组件功能一致，
  视图的对象是formData.viewKey
  下面的组件 formData.viewKey.name


{
    "type": "form",
    "baseProps": {
        "name": "这是一个测试表单",
        "code": "testForm",
        "description": "表单描述信息",
        "version": "1.0"
    },
    "common_cfg": {
        "labelWidth": 120,
        "initColCountPerRow": 2,
        "layout": "default"
    },
    "rows": [
        {
            "rowId": "a8bfcb40-6244-11e8-a340-1dbcb9bb68e5",
            "rowIndex": 0,
            "type": "formitem",
            "rowConfig": {
                "gutter": 0,
                "rowHeight": 35,
                "layout": "flex",
                "align": "top",
                "justify": "end"
            },
            "columns": [
                {
                    "columnId": "a8bff250-6244-11e8-a340-1dbcb9bb68e5",
                    "columnIndex": 0,
                    "rowId": "a8bfcb40-6244-11e8-a340-1dbcb9bb68e5",
                    "selected": false,
                    "columnConfig": {
                        "showLabel": 1,
                        "label": "label 1",
                        "key": null,
                        "type": "FormInput"
                    },
                    "model": {
                        "type": "FormInput",
                        "props": {
                            "size": "default",
                            "type": "text"
                        }
                    }
                }
            ]
        },
        {
            "rowId": "a90538b0-6244-11e8-a340-1dbcb9bb68e5",
            "rowIndex": 1,
            "type": "formitem",
            "rowConfig": {
                "gutter": 0,
                "rowHeight": 35,
                "layout": "flex",
                "align": "top",
                "justify": "end"
            },
            "columns": [
                {
                    "columnId": "a90538b1-6244-11e8-a340-1dbcb9bb68e5",
                    "columnIndex": 0,
                    "rowId": "a90538b0-6244-11e8-a340-1dbcb9bb68e5",
                    "selected": false,
                    "columnConfig": {
                        "showLabel": 1,
                        "label": "label 1",
                        "key": null,
                        "type": "FormInput"
                    },
                    "model": {
                        "type": "FormInput",
                        "props": {
                            "size": "default",
                            "type": "text"
                        }
                    }
                },
                {
                    "columnId": "a90538b2-6244-11e8-a340-1dbcb9bb68e5",
                    "columnIndex": 1,
                    "rowId": "a90538b0-6244-11e8-a340-1dbcb9bb68e5",
                    "selected": false,
                    "columnConfig": {
                        "showLabel": 1,
                        "label": "label 2",
                        "key": null,
                        "type": "FormInput"
                    },
                    "model": {
                        "type": "FormInput",
                        "props": {
                            "size": "default",
                            "type": "text"
                        }
                    }
                }
            ]
        },
        {
            "rowId": "f04b65b0-6257-11e8-a340-1dbcb9bb68e5",
            "rowIndex": 2,
            "type": "formitem",
            "rowConfig": {
                "gutter": 0,
                "rowHeight": 35,
                "layout": "flex",
                "align": "top",
                "justify": "end"
            },
            "columns": [
                {
                    "columnId": "f04b65b1-6257-11e8-a340-1dbcb9bb68e5",
                    "columnIndex": 0,
                    "rowId": "f04b65b0-6257-11e8-a340-1dbcb9bb68e5",
                    "selected": false,
                    "columnConfig": {
                        "showLabel": 1,
                        "label": "label 1",
                        "key": null,
                        "type": "FormInput"
                    },
                    "model": {
                        "type": "FormInput",
                        "props": {
                            "size": "default",
                            "type": "text"
                        }
                    }
                },
                {
                    "columnId": "f04b65b2-6257-11e8-a340-1dbcb9bb68e5",
                    "columnIndex": 1,
                    "rowId": "f04b65b0-6257-11e8-a340-1dbcb9bb68e5",
                    "selected": false,
                    "columnConfig": {
                        "showLabel": 1,
                        "label": "label 2",
                        "key": null,
                        "type": "FormInput"
                    },
                    "model": {
                        "type": "FormInput",
                        "props": {
                            "size": "default",
                            "type": "text"
                        }
                    }
                }
            ]
        },
        {
            "rowId": "f079efc0-6257-11e8-a340-1dbcb9bb68e5",
            "rowIndex": 3,
            "type": "formitem",
            "rowConfig": {
                "gutter": 0,
                "rowHeight": 35,
                "layout": "flex",
                "align": "top",
                "justify": "end"
            },
            "columns": [
                {
                    "columnId": "f07a16d0-6257-11e8-a340-1dbcb9bb68e5",
                    "columnIndex": 0,
                    "rowId": "f079efc0-6257-11e8-a340-1dbcb9bb68e5",
                    "selected": false,
                    "columnConfig": {
                        "showLabel": 1,
                        "label": "label 1",
                        "key": null,
                        "type": "FormInput"
                    },
                    "model": {
                        "type": "FormInput",
                        "props": {
                            "size": "default",
                            "type": "text"
                        }
                    }
                },
                {
                    "columnId": "f07a16d1-6257-11e8-a340-1dbcb9bb68e5",
                    "columnIndex": 1,
                    "rowId": "f079efc0-6257-11e8-a340-1dbcb9bb68e5",
                    "selected": false,
                    "columnConfig": {
                        "showLabel": 1,
                        "label": "label 2",
                        "key": null,
                        "type": "FormInput"
                    },
                    "model": {
                        "type": "FormInput",
                        "props": {
                            "size": "default",
                            "type": "text"
                        }
                    }
                }
            ]
        }
    ],
    "elements": {
        "a8bfcb40-6244-11e8-a340-1dbcb9bb68e5": {
            "rowId": "a8bfcb40-6244-11e8-a340-1dbcb9bb68e5",
            "rowIndex": 0,
            "type": "formitem",
            "rowConfig": {
                "gutter": 0,
                "rowHeight": 35,
                "layout": "flex",
                "align": "top",
                "justify": "end"
            },
            "columns": [
                {
                    "columnId": "a8bff250-6244-11e8-a340-1dbcb9bb68e5",
                    "columnIndex": 0,
                    "rowId": "a8bfcb40-6244-11e8-a340-1dbcb9bb68e5",
                    "selected": false,
                    "columnConfig": {
                        "showLabel": 1,
                        "label": "label 1",
                        "key": null,
                        "type": "FormInput"
                    },
                    "model": {
                        "type": "FormInput",
                        "props": {
                            "size": "default",
                            "type": "text"
                        }
                    }
                }
            ]
        },
        "a8bff250-6244-11e8-a340-1dbcb9bb68e5": {
            "columnId": "a8bff250-6244-11e8-a340-1dbcb9bb68e5",
            "columnIndex": 0,
            "rowId": "a8bfcb40-6244-11e8-a340-1dbcb9bb68e5",
            "selected": false,
            "columnConfig": {
                "showLabel": 1,
                "label": "label 1",
                "key": null,
                "type": "FormInput"
            },
            "model": {
                "type": "FormInput",
                "props": {
                    "size": "default",
                    "type": "text"
                }
            }
        },
        "a8c01960-6244-11e8-a340-1dbcb9bb68e5": {
            "columnId": "a8c01960-6244-11e8-a340-1dbcb9bb68e5",
            "columnIndex": 1,
            "rowId": "a8bfcb40-6244-11e8-a340-1dbcb9bb68e5",
            "selected": false,
            "columnConfig": {
                "showLabel": 1,
                "label": "label 2",
                "key": null,
                "type": "FormInput"
            },
            "model": {
                "type": "FormInput",
                "props": {
                    "size": "default",
                    "type": "text"
                }
            }
        },
        "a90538b0-6244-11e8-a340-1dbcb9bb68e5": {
            "rowId": "a90538b0-6244-11e8-a340-1dbcb9bb68e5",
            "rowIndex": 1,
            "type": "formitem",
            "rowConfig": {
                "gutter": 0,
                "rowHeight": 35,
                "layout": "flex",
                "align": "top",
                "justify": "end"
            },
            "columns": [
                {
                    "columnId": "a90538b1-6244-11e8-a340-1dbcb9bb68e5",
                    "columnIndex": 0,
                    "rowId": "a90538b0-6244-11e8-a340-1dbcb9bb68e5",
                    "selected": false,
                    "columnConfig": {
                        "showLabel": 1,
                        "label": "label 1",
                        "key": null,
                        "type": "FormInput"
                    },
                    "model": {
                        "type": "FormInput",
                        "props": {
                            "size": "default",
                            "type": "text"
                        }
                    }
                },
                {
                    "columnId": "a90538b2-6244-11e8-a340-1dbcb9bb68e5",
                    "columnIndex": 1,
                    "rowId": "a90538b0-6244-11e8-a340-1dbcb9bb68e5",
                    "selected": false,
                    "columnConfig": {
                        "showLabel": 1,
                        "label": "label 2",
                        "key": null,
                        "type": "FormInput"
                    },
                    "model": {
                        "type": "FormInput",
                        "props": {
                            "size": "default",
                            "type": "text"
                        }
                    }
                }
            ]
        },
        "a90538b1-6244-11e8-a340-1dbcb9bb68e5": {
            "columnId": "a90538b1-6244-11e8-a340-1dbcb9bb68e5",
            "columnIndex": 0,
            "rowId": "a90538b0-6244-11e8-a340-1dbcb9bb68e5",
            "selected": false,
            "columnConfig": {
                "showLabel": 1,
                "label": "label 1",
                "key": null,
                "type": "FormInput"
            },
            "model": {
                "type": "FormInput",
                "props": {
                    "size": "default",
                    "type": "text"
                }
            }
        },
        "a90538b2-6244-11e8-a340-1dbcb9bb68e5": {
            "columnId": "a90538b2-6244-11e8-a340-1dbcb9bb68e5",
            "columnIndex": 1,
            "rowId": "a90538b0-6244-11e8-a340-1dbcb9bb68e5",
            "selected": false,
            "columnConfig": {
                "showLabel": 1,
                "label": "label 2",
                "key": null,
                "type": "FormInput"
            },
            "model": {
                "type": "FormInput",
                "props": {
                    "size": "default",
                    "type": "text"
                }
            }
        },
        "f04b65b0-6257-11e8-a340-1dbcb9bb68e5": {
            "rowId": "f04b65b0-6257-11e8-a340-1dbcb9bb68e5",
            "rowIndex": 2,
            "type": "formitem",
            "rowConfig": {
                "gutter": 0,
                "rowHeight": 35,
                "layout": "flex",
                "align": "top",
                "justify": "end"
            },
            "columns": [
                {
                    "columnId": "f04b65b1-6257-11e8-a340-1dbcb9bb68e5",
                    "columnIndex": 0,
                    "rowId": "f04b65b0-6257-11e8-a340-1dbcb9bb68e5",
                    "selected": false,
                    "columnConfig": {
                        "showLabel": 1,
                        "label": "label 1",
                        "key": null,
                        "type": "FormInput"
                    },
                    "model": {
                        "type": "FormInput",
                        "props": {
                            "size": "default",
                            "type": "text"
                        }
                    }
                },
                {
                    "columnId": "f04b65b2-6257-11e8-a340-1dbcb9bb68e5",
                    "columnIndex": 1,
                    "rowId": "f04b65b0-6257-11e8-a340-1dbcb9bb68e5",
                    "selected": false,
                    "columnConfig": {
                        "showLabel": 1,
                        "label": "label 2",
                        "key": null,
                        "type": "FormInput"
                    },
                    "model": {
                        "type": "FormInput",
                        "props": {
                            "size": "default",
                            "type": "text"
                        }
                    }
                }
            ]
        },
        "f04b65b1-6257-11e8-a340-1dbcb9bb68e5": {
            "columnId": "f04b65b1-6257-11e8-a340-1dbcb9bb68e5",
            "columnIndex": 0,
            "rowId": "f04b65b0-6257-11e8-a340-1dbcb9bb68e5",
            "selected": false,
            "columnConfig": {
                "showLabel": 1,
                "label": "label 1",
                "key": null,
                "type": "FormInput"
            },
            "model": {
                "type": "FormInput",
                "props": {
                    "size": "default",
                    "type": "text"
                }
            }
        },
        "f04b65b2-6257-11e8-a340-1dbcb9bb68e5": {
            "columnId": "f04b65b2-6257-11e8-a340-1dbcb9bb68e5",
            "columnIndex": 1,
            "rowId": "f04b65b0-6257-11e8-a340-1dbcb9bb68e5",
            "selected": false,
            "columnConfig": {
                "showLabel": 1,
                "label": "label 2",
                "key": null,
                "type": "FormInput"
            },
            "model": {
                "type": "FormInput",
                "props": {
                    "size": "default",
                    "type": "text"
                }
            }
        },
        "f079efc0-6257-11e8-a340-1dbcb9bb68e5": {
            "rowId": "f079efc0-6257-11e8-a340-1dbcb9bb68e5",
            "rowIndex": 3,
            "type": "formitem",
            "rowConfig": {
                "gutter": 0,
                "rowHeight": 35,
                "layout": "flex",
                "align": "top",
                "justify": "end"
            },
            "columns": [
                {
                    "columnId": "f07a16d0-6257-11e8-a340-1dbcb9bb68e5",
                    "columnIndex": 0,
                    "rowId": "f079efc0-6257-11e8-a340-1dbcb9bb68e5",
                    "selected": false,
                    "columnConfig": {
                        "showLabel": 1,
                        "label": "label 1",
                        "key": null,
                        "type": "FormInput"
                    },
                    "model": {
                        "type": "FormInput",
                        "props": {
                            "size": "default",
                            "type": "text"
                        }
                    }
                },
                {
                    "columnId": "f07a16d1-6257-11e8-a340-1dbcb9bb68e5",
                    "columnIndex": 1,
                    "rowId": "f079efc0-6257-11e8-a340-1dbcb9bb68e5",
                    "selected": false,
                    "columnConfig": {
                        "showLabel": 1,
                        "label": "label 2",
                        "key": null,
                        "type": "FormInput"
                    },
                    "model": {
                        "type": "FormInput",
                        "props": {
                            "size": "default",
                            "type": "text"
                        }
                    }
                }
            ]
        },
        "f07a16d0-6257-11e8-a340-1dbcb9bb68e5": {
            "columnId": "f07a16d0-6257-11e8-a340-1dbcb9bb68e5",
            "columnIndex": 0,
            "rowId": "f079efc0-6257-11e8-a340-1dbcb9bb68e5",
            "selected": false,
            "columnConfig": {
                "showLabel": 1,
                "label": "label 1",
                "key": null,
                "type": "FormInput"
            },
            "model": {
                "type": "FormInput",
                "props": {
                    "size": "default",
                    "type": "text"
                }
            }
        },
        "f07a16d1-6257-11e8-a340-1dbcb9bb68e5": {
            "columnId": "f07a16d1-6257-11e8-a340-1dbcb9bb68e5",
            "columnIndex": 1,
            "rowId": "f079efc0-6257-11e8-a340-1dbcb9bb68e5",
            "selected": false,
            "columnConfig": {
                "showLabel": 1,
                "label": "label 2",
                "key": null,
                "type": "FormInput"
            },
            "model": {
                "type": "FormInput",
                "props": {
                    "size": "default",
                    "type": "text"
                }
            }
        }
    },
    "operationRow": {
        "align": "top",
        "type": "buttons",
        "selected": false,
        "rowConfig": {
            "gutter": 0,
            "rowHeight": 40,
            "layout": "flex",
            "align": "top",
            "justify": "end"
        },
        "fixedButtons": [
            {
                "type": "ghost",
                "text": "保存",
                "icon": "ios-flower",
                "clickFn": "saveForm"
            },
            {
                "type": "ghost",
                "text": "提交",
                "icon": "ios-flower",
                "clickFn": "submitForm"
            },
            {
                "type": "ghost",
                "text": "重置",
                "icon": "ios-flower",
                "clickFn": "resetForm"
            }
        ],
        "buttons": []
    }
}
