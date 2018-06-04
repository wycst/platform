// sql”Ôæ‰
var formSql = {
	form : {
		select : 'select * from form_info where id = ? ',
	    insert : 'insert into form_info(name,code,description,uid,create_time,status,form_source,dir_uid) values (?,?,?,?,?,?,?,?)',
		update : 'update form_info set name = ?,code = ?,description = ?, update_time = ? ,form_source = ? where id = ?'
	}
}
module.exports = formSql;