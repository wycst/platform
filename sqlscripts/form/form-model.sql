// 字段映射表
1 form_keycolumn_mapping_info 表结构修改：
DROP TABLE IF EXISTS `workflowinter`.`form_column_mapping_info`;
CREATE TABLE  `workflowinter`.`form_column_mapping_info` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `form_uid` varchar(100) NOT NULL,
  `table_name` varchar(100) NOT NULL,
  `column_uid` varchar(100) NOT NULL,
  `column_name` varchar(100) NOT NULL,
  `column_label` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

表单与物理表的映射关系如何一对多？
2 设计关联表 form_table_rel_info
DROP TABLE IF EXISTS `workflowinter`.`form_table_rel_info`;
CREATE TABLE  `workflowinter`.`form_table_rel_info` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `form_uid` varchar(100) NOT NULL,
  `table_name` varchar(100) NOT NULL,
  `model_uid_column` varchar(100) NOT NULL,
  `description` varchar(45) DEFAULT NULL,
  `uid` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Index_2` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

数据模型表 form_model_info
id bigint,
uid varchar(100),
form_uid varchar(100),  
model_source longtext,     
indb_time datetime,
version bigint (timestamp) 

1 提交数据到后台后，转化为json，key为columnId(uuid串)根据form_uid加载关联的物理表

  model_source的格式：
 
  key ： columnId(uuid串)
  value ： 
        value的结构如下： 
         {
	     label : '流程名称',
             key   : 'processName',
	     value : 'xxxx流程'
	 }

  一，如果没有物理表，以json格式保存数据，默认每次提交生成一个model_info，model_uid保持不变
  二，如果存在物理表，判断是否已生成了实例
          如果没有，创建一个model_info，通过form_uid查询form_table_rel_info中的table列表（一个或多个）
	     遍历tablelist，取出每个table_name和model_uid_column字段名称
             再根据form_uid和table_name查询form_column_mapping_info表中的字段的集合columns
             组装对应的sql进行插入或者更新字段值
	  如果有，查询更新
      整个过程model_info唯一，每次操作更新model_source

DROP TABLE IF EXISTS `workflowinter`.`form_model_info`;
CREATE TABLE  `workflowinter`.`form_model_info` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(100) NOT NULL,
  `form_uid` varchar(100) NOT NULL,
  `model_source` longtext NOT NULL,
  `version` bigint(20) unsigned NOT NULL,
  `submitter` varchar(100) DEFAULT NULL,
  `submit_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Index_2` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;