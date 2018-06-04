Ŀ¼��dir_info
   �ٻ�����Ϣ��     id,name,code,description,
   ��ҵ�����ʹ�ã� uid(Ψһ),parent_uid
   ��Ŀ¼����    �� dir_type      ������/����/���̱���/����
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


1 ����Ϣ��form_info
   �ֶ���������
   �ٻ�����Ϣ��     id,name,code,description,
   ��ҵ�����ʹ�ã� uid(Ψһ)
   �۲���ʱ���¼�� create_time,creator = admin,update_time,publish_time
   �ܷ���״̬��     status
   �ݹ��������   association_table (����������������Ϊ�ղ�������),
   ��JSONԴ���룺   form_source(��Դ���룬json��ʽ,longtext��ʽ),
   �߱�html��     form_html(��Ⱦ���ɵ�html��ʱ���ã��ȴ���)
   ��洢Ŀ¼UID    dir_uid
   �������       form_type
   
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



2 ����ͼ: form_view_info 
��ͼ�����ý����Ǹ��õĹ��ܣ��滻�п��ܵ��ظ�������(�ɸ����ӱ����ɿ���һ��rows������)
��ͼû�����ݴ��棬Ҳû��ҵ���ֶΣ����跢������ͼ��Ԥ�����ް�ť
   �ֶ���������
   �ٻ�����Ϣ��           id,name,code,description,
   �ڲ���ʱ���¼ ��      create_time,creator,update_time
   ��JSONԴ����           view_source,view_html
   �ܴ洢Ŀ¼             dir_uid

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

 ��ϵ������ͼ�ڲ���Ԫ�ؿ��ڱ��༭ʱ���������϶���
   ��ͼ�������ͼ����ͼ֮��Ҳ��������Ԫ�أ�
   ��ͼĬ��ռλ����һ��һ�У�span=24��
   ��ͨ���༭ѡ�����һ����ͼ�󣬱������ͼ�Ĺ�ϵ�����������ͼû���������
   ��ͼ��ӵ���������ʹ�ñ��Ĳ�����ʽ
   ��ͼ���Դ�������ͼ�����ͨ���༭����Ϊ�µ���ͼ���¾���ͼû���߼��������ϵ

3 ��״̬��form_state_info 

������ һ�������һ���������ӿ�ʼ������������Ӧ��ֻʹ��������һ������
       ������������ÿ�����ڵı�Ԫ�ؿ��ܶ���һ�������������ֻ�����������Ϣ��
      ���ǹ�����ʹ�õı������޴�����

���ã� ͬһ��������ͬ״̬���ֲ�ͬ�Ŀ��ƽ��
һ����״̬��Ȼֻ����һ������״̬�Ĵ�������ڱ�
״̬�����ò����޸ı����е�����ͼ��٣�һ�������״ֻ̬�ܿ��������
   ��ʾ�����أ�ֻ�����������Ϣ

   ״̬Ӱ�����ݣ�
���أ�
   �����һ��ԭ��2���У�ÿ����ռ50%������һ�������أ���һ����ռ100%��
   ��widthPercent = 100 / columns.length - hideCounts %��
   ���������v-if='isShow'

   ���columns.length - hideCounts = 0 ,����Ⱦ��ǰ��
   �ڵ�ǰ����� v-if='columns.length - hideCounts = 0'
   ��ǰ����Ϣ����� hide ��Ҳ����Ⱦ�� v-if='����һ������������row����state����'

ֻ���� 
   �������������
   ͨ��Object.assign�ϲ����Ե�column.model.props

���
   ����������form������������������Ч
   ���������formitem����м���required����

��ť������
   v-if='show'

����ͬ�����⣿
   ����������ɾ���ˣ�״̬���ж�Ӧ����Ϣ��ô�죿
   ͨ���´α����Զ�ɾ������״̬��ɾ��Ҳ��Ӱ�죩

   ��Ƴ����ֶ��������£�
   �ٻ�����Ϣ��     id,name,code,description,
   �ڹ�����ϵ��     ref_uid        ����������Ψһ��ʾ��
   �۲���ʱ���¼ ��create_time,update_time
   ��JSONԴ����     state_source
   ��ҵ��Ψһ��ʾ   uid             (���繤����ĳ������)
   ��������Ϣ       index(����)
   ����ͼӰ��Ľ����ͨ�����뷭����ı��ַ��������鿴ʹ��

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


   �����û��״̬������Ĭ�ϵ������ʾ
   ״̬��json�����ƣ�
   
   �����Ϸ�����state��jsonӦ�����£�
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
 
      �༭��״̬ʱ����λ�ȡ״̬������״̬��Ϣ��
      
      ���ģ���������ṹ���У�index��,��
 

      ���֣� 
          west������===��ѡ��һ����=== �������е�״̬�б�

          center��ѡ��һ����ʱ����״̬����������Ϊ���
	  east  ���Ҳ�Ϊ��������
	  
          ���ѡ���˱�״̬�����������䣬����Ϊ״̬�����
          ����ѡ��Ĳ�ͬ������У��У�ֱ����ʾ��ͬ��״̬���ƣ�
          

4 �ֶ�ӳ��� form_keycolumn_mapping_info

   id ,form_uid,comp_key,column_name,description

   ��������������ʱ���������key�������Ĺ�����ϵ��¼

DROP TABLE IF EXISTS `workflowinter`.`form_keycolumn_mapping_info`;
CREATE TABLE  `workflowinter`.`form_keycolumn_mapping_info` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `form_uid` varchar(100) NOT NULL,
  `comp_key` varchar(100) NOT NULL,
  `column_name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



5 �����ݣ�ģ�ͣ���form_model_info


��ϵ��

����Ϣ��----------�����ݣ�ʵ��ģ�ͣ���
 һ�Զ�

����Ϣ��----------����ͼ
 һ�Զ�

�����ݣ�ʵ��ģ�ͣ���   ����ͼ


1 �������Ƿ��б�Ҫ��ƣ��������ֵ������������ôͶ��ʹ�ã�
2 ģ������ƣ�
3 �Ƿ�����ӱ�Ƕ�ף��ӱ�����һ��û�в�������ť�ı���ͼ
  ��ͼĬ�����ڱ��ĵ��е��У�span=24��
  ��ͼ���û��form��ǩ�������������ʵ��v-model

  ��ͼ������һ��viewKey �� form������������һ�£�
  ��ͼ�Ķ�����formData.viewKey
  �������� formData.viewKey.name


{
    "type": "form",
    "baseProps": {
        "name": "����һ�����Ա�",
        "code": "testForm",
        "description": "��������Ϣ",
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
                "text": "����",
                "icon": "ios-flower",
                "clickFn": "saveForm"
            },
            {
                "type": "ghost",
                "text": "�ύ",
                "icon": "ios-flower",
                "clickFn": "submitForm"
            },
            {
                "type": "ghost",
                "text": "����",
                "icon": "ios-flower",
                "clickFn": "resetForm"
            }
        ],
        "buttons": []
    }
}
