<template>
  <Table :size='size' border :columns="columns" :data="editData" :height='height'></Table>
</template>

<script>

export default {
  name: 'EditableTable',
  props: {
        editMode : String,
        columns  : Array,
	height   : [String,Number],
        data : Array,
	size : String,
	dataBindable : Boolean
  },
  created () {
     this.init();
  },
  methods: {
     init() {

         // 解析columns中设置editor的字段
	 let me = this;
	 let columns = this.columns;

	 if(this.editMode == 'cell') {
	     this.cellEdit = true;
	 } else if(this.editMode == 'row') {
	     this.rowEdit = true;
	 } 

         this.rawData = JSON.parse(JSON.stringify(this.data));
	 this.tempData = JSON.parse(JSON.stringify(this.data));

         this.tempData.forEach(row => {
	     row.$state = 0;
	 });

         // forEach set column.render
	 columns.forEach(column => {
             if(column.editor) {
	         // 如果设置了可编辑
                 let componentType = 'Input';
		 let componentProps = {
		 };
		 let trigger = 'click';
                 if(typeof(column.editor) == 'string') {
		     componentType = column.editor;
		 } else if(typeof(column.editor) == 'object'){
		     componentType = column.editor.type;
		     componentProps = column.editor.props;
                     trigger = column.editor.trigger;
		 } else {
		 }
                 column.render = (h,param)=> {
                      
                      let record = param.row;
		      let key = column.key;
		      let columnValue = record[key];
		      let index = param.index;
		      let editRowIndex = column['editRowIndex'];
                      if((me.rowEdit || me.editColumnKey == key) && index == me.editRowIndex) {
		          
			  let elementId = record._rowKey + '_element-id_' + key + '_' + index;
			  let props = Object.assign({
				autofocus: true,
				value: columnValue,
				'element-id': elementId
			  }, componentProps); 
			  let render = h(componentType,{
			      props : props,
			      on : {
			          'on-blur' () {
				     // 延迟执行防止重绘造成点击事件失效
                                     setTimeout(function() {
				             // 判断editColumnKey和editRowIndex是否以改变，如果已改变pass
					     if(me.editColumnKey == key && index == me.editRowIndex) {
						 me.endEditing();
					     }
                                             me.afterEdit(column,index,key,record[key]);
				     },200);
				  },
				  'on-change' (argu) {
				     record[key] = me.getEventValue(componentType,argu);
				     if(componentType == 'Select' || componentType == 'ComboSelect') {
				        me.afterEdit(column,index,key,record[key]);
				     } 
				  }
			      }
			  },'');
			  setTimeout(function() {
			     // 解决下拉，数字组件触发blur问题
			     document.getElementById(elementId) && document.getElementById(elementId).focus();
			  },200);
                          return render;

		      } else {
		          // domProps 和 attrs ，ie下面domProps暂时有问题
			  columnValue = column.formatter ? column.formatter(columnValue) : columnValue;
		          return h('div',{
			      attrs : {
			          style : 'min-width:22px;min-height:18px;'+ (columnValue ? '' : ';width:100%;height:100%;')
			      },
			      on : {
			          click : function (e) {
				      // 更新数据，会触发render进行重渲染
				      // data[index].editInfo = record.editInfo;
				      // editColumnKey控制哪一列启用编辑
				      me.editColumnKey = key;
				      // editRowIndex控制哪一行启用编辑
				      me.editRowIndex = index;
				  }
			      }
			  } ,columnValue);
		      }
		 }       
	    } 
	 });
     },
     afterEdit(column,index,key,value) {
         this.update(index,key,value);
	 if(column.afterEdit && typeof(column.afterEdit) == 'function') {
	     column.afterEdit(index,key,value);
	 }
     },
     update(index,key,value) {
         let record =  this.tempData[index];
	 record[key] = value;

         // if bind data
         if(this.dataBindable) {
	     this.bindData[index][key] = value;
	     this.changeBySelfEdit = true;
	 }

         let modifyKeyInfo = record.modifyKeyInfo || (record.modifyKeyInfo = {});
	 let rawValue = this.rawData[index][key];
         if(value != rawValue) {
	     if(!(key in modifyKeyInfo)) {
	         modifyKeyInfo[key] = true;
	     }
	 } else {
	     delete modifyKeyInfo[key];
	 }
         if(Object.getOwnPropertyNames(modifyKeyInfo).length == 0) {
	      // 状态还原
              record.$state = 0;
	 } else {
	      record.$state = 2;
	 }
     },
     getModifyRecords() {
         // 获取修改的记录
         let modifyRecords = this.tempData.filter(record => {
	      if(!!record.$state) {
	          return record;
	      }
	 });

         modifyRecords.push(...this.deleteRecords);
         for(let insertKey in this.insertRecords) {
	     modifyRecords.push(this.insertRecords[insertKey]);
	 }

         return modifyRecords;
     },
     commitChanges() {
         let modifyRecords = this.getModifyRecords();
         if(modifyRecords.length > 0) {
	     this.clearModifyState(modifyRecords);
	     // 提交
             this.rawData = JSON.parse(JSON.stringify(this.tempData));
	 }
	 this.endEditing();

	 if(this.dataBindable) {
	        // update bindData
		JSON.parse(JSON.stringify(this.rawData)).forEach((row,i)=>{
		    this.bindData.splice(0,1);
                    this.bindData.push(row);
		});
                this.changeBySelfEdit = true;
	 }
     },
     rejectChanges() {
        let modifyRecords = this.getModifyRecords();
	this.endEditing();
        if(modifyRecords.length > 0) {
	     // 还原
	    this.tempData = JSON.parse(JSON.stringify(this.rawData));
	}

	if(this.dataBindable) {
	        // update bindData
		JSON.parse(JSON.stringify(this.rawData)).forEach((row,i)=>{
		    this.bindData.splice(0,1);
                    this.bindData.push(row);
		});
                this.changeBySelfEdit = true;
	}
     },
     clearModifyState(modifyRecords) {
        modifyRecords.forEach(record => {
	    record.$state = 0;
	});
     },
     endEditing() {
        this.editColumnKey = null;
        this.editRowIndex = -1;
     },
     getEventValue(componentType,argu) {
        if(componentType == 'Input') {
	    return argu.target.value;
	} else if(componentType == 'InputNumber'){
            return argu;
	} else {
	    if(argu.target) {
	        return argu.target.value;
	    } else {
	        return argu;
	    }
	}
     },
     loadData(data) {
        this.rawData = JSON.parse(JSON.stringify(data));
	this.tempData = JSON.parse(JSON.stringify(data));
     },
     getData(isBindData) {
        return isBindData === true ? this.tempData : JSON.parse(JSON.stringify(this.tempData));
     },
     add(row) {
        row = row || {};
        row.$state = 1;
        let insertKey = new Date().getTime() + '';
        row.$insertKey = insertKey;

        this.tempData.push(row);
	this.insertRecords[insertKey] = row;

        if(this.dataBindable) {
	    this.bindData.push(row);
	    this.changeBySelfEdit = true;
	}
     },
     delete(index,row) {
        let deleteRecords = this.tempData.splice(index,index + 1);
        if(this.dataBindable) {
	    this.bindData.splice(index,index + 1);
	    this.changeBySelfEdit = true;
	}

        let deleteRecord = deleteRows[0];
	if(deleteRecord.$state != 1) {
	    deleteRecord.$state = 3;
	    this.deleteRecords.push(deleteRow);
	} else {
	    // delete reocrd from insertRecords
	    let insetKey = row.$insertKey;
            delete this.insertRecords[insetKey];
	}
     }
  },
  computed : {
       editData () {
           return this.tempData;
       }
  },
  data () {
    return {

       rawData : [],
       bindData : this.data,
       tempData  : [],

       insertRecords : {},
       deleteRecords : [],

       editRowIndex : -1,
       editColumnKey : '',
       changeBySelfEdit  : false,

       cellEdit  : true,
       rowEdit   : false
    }
  },
  watch: {
           data: {
		handler (newData,oldData) {
		    // 如果原始数据变化了？是否需要更新?
		    if(!this.changeBySelfEdit) {
		        if(this.dataBindable) {
		            // 直接持久化表格
			    this.loadData(newData);
		        }	
		    } 
		    this.changeBySelfEdit = false;
		},
		deep: true
	   }
  }
}
</script>