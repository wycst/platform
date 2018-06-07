// sql”Ôæ‰
var formSql = {
	form : {
		select : 'select * from form_info where id = ? ',
	    insert : 'insert into form_info(name,code,description,version,uid,create_time,status,form_source,dir_uid) values (?,?,?,?,?,?,?,?,?)',
		update : 'update form_info set name = ?,code = ?,description = ?, update_time = ? ,form_source = ? where id = ?'
	},
	state : {
	    insert : 'insert into form_state_info(name,code,description,uid,create_time,form_uid,state_source,order_index) values (?,?,?,?,?,?,?,?)',
	    select : 'select * from form_state_info where id = ? ',
		update : 'update form_state_info set name = ? ,code = ? ,description = ? ,state_source = ? ,update_time = ?,effect_text = ? where id = ? ',
        queryList : 'select id,name from form_state_info where form_uid = ? order by order_index '
	}
}
module.exports = formSql;