<template>
  <Table :size='size' border :columns="columns" :data="editData" :height='height'></Table>
</template>

<script>

export  default 
{
    name: 'PropertyTable',
    props: {
        height:[Number,String],
        alwaysEdit : Boolean,
        propertyColumns: Array,
        propertyValues: Array,
        size: String,
	dataBindable : Boolean
    },
    created() {
        this.init();
    },
    mounted() {
    },
    methods: {
        init() {
            // 属性表格固定2列 第一列设置不可编辑，第二列可编辑
            // 第一列设置背景色
            // 默认列头默认居中
            // 编辑类型设置在value中

            let me = this;
            let columns = this.propertyColumns.slice(0, 2);

            this.columns = columns;

	    this.initEdit(this.propertyValues || []);

            this.rawData = JSON.parse(JSON.stringify(this.propertyValues || []));
            this.tempData = JSON.parse(JSON.stringify(this.rawData));

            this.tempData.forEach(row => {
                row.$state = 0;
            });

            columns.forEach((column, i) => {
                column.align = column.align || 'center';
		if (i == 0) {
		    // 设置名称列样式
		} else {
		   //  设置
                   this.valueKey = column.key;
		   column.render = (h, param) => {

		    let record = param.row;
		    let key = column.key;
		    let propertyKey = record.propertyKey;
		    
		    let index = param.index;
		    let editRowIndex = column['editRowIndex'];

		    let componentType = 'Input';
		    let componentProps = {};
		    let trigger = 'click';

                    let columnValue = record[key];
		    let editor = me.editors[propertyKey];
    
		    if(!editor) {
			return h('div',columnValue);
		    }

		    if (typeof(editor) == 'string') {
			componentType = editor;
		    } else if (typeof(editor) == 'object') {
			componentType = editor.type;
                        componentProps = editor.props;
			trigger = editor.trigger;
		    } else {
		    }
		    if (me.alwaysEdit || (me.editColumnKey == key && index == me.editRowIndex)) {
                        
			let elementId = record._rowKey + '_element-id_' + key + '_' + index;
			
			let props = Object.assign({
				autofocus: true,
				value: columnValue,
				'element-id': elementId
			}, componentProps); 
			
			let render = h(componentType, {
			    props: props,
			    on: {
				'on-blur' () {
                                    
                                    if(me.forceEndEditing) {
				        me.endEditing();
				        me.forceEndEditing = false;
				        return ;
				    }

				    // 延迟执行防止重绘造成点击事件失效
				    setTimeout(function() {
					// 判断editColumnKey和editRowIndex是否以改变，如果已改变pass
					if (me.editColumnKey == key && index == me.editRowIndex) {
					    me.endEditing();
					}
					me.afterEdit(column,index,key,record[key],propertyKey);
				    },
				    200);
				},
				'on-change' (argu) {
				    record[key] = me.getEventValue(componentType, argu);
				    // 如果是下拉组件可能没有焦点事件
				    if(componentType == 'Select' || componentType == 'ComboSelect') {
					me.afterEdit(column,index,key,record[key],propertyKey);
				    } 
				}
			    }
			},
			'');
			setTimeout(function() {
			    // 解决下拉，数字组件触发blur问题
			    document.getElementById(elementId) && document.getElementById(elementId).focus();
			},
			200);
			return render;

		    } else {
                        if(me.formatters[propertyKey]) {
			    try {
			        columnValue = me.formatters[propertyKey](columnValue) ;
			    } catch(error) {
			        console.trace(error);
			    }
			}
			// domProps 和 attrs ，ie下面domProps暂时有问题
			return h('div', {
			    attrs: {
				style: 'min-width:22px;min-height:18px;' + (columnValue ? '': ';width:100%;height:100%;')
			    },
			    on: {
				click: function(e) {
				    // 更新数据，会触发render进行重渲染
				    // data[index].editInfo = record.editInfo;
				    // editColumnKey控制哪一列启用编辑
				    me.editColumnKey = key;
				    // editRowIndex控制哪一行启用编辑
				    me.editRowIndex = index;
				}
			    }
			},
			columnValue);
		    }
		}
		}
                
            });
        },
	initEdit(data) {

	    let editors = {};
	    let formatters = {};
	    let callbacks = {};
	    data.forEach((row, index) => {
		let readOnly = row.readOnly;
		let propertyKey = row.propertyKey;
		if (readOnly) {
		    editors[propertyKey] = null;
		} else {
		    editors[propertyKey] = row.editor || 'Input';
		}

		let formatter = row.formatter;
		if(formatter && typeof(formatter) == 'function') {
		    formatters[propertyKey] = formatter;
		}
                if(propertyKey && typeof(row.callback) == 'function') {
		    callbacks[propertyKey] = row.callback;
		}

	    });
	    this.editors = editors;
	    this.formatters = formatters;
	    this.callbacks = callbacks;
	},
	afterEdit(column,index,key,value,propertyKey) {
            this.update(index,key,value);
	    if(column.afterEdit && typeof(column.afterEdit) == 'function') {
		 column.afterEdit(index,key,value);
            }
            if(this.callbacks[propertyKey]) {
		 this.callbacks[propertyKey](propertyKey,value);
            }
	},
        update(index, key, value) { 
            let record = this.tempData[index];
            record[key] = value;
 
             // if bind data
	    if(this.dataBindable) {
		 this.bindData[index][key] = value;
		 this.changeBySelfEdit = true;
	    }
            let modifyKeyInfo = record.modifyKeyInfo || (record.modifyKeyInfo = {});
            let rawValue = this.rawData[index][key];

            if (value != rawValue) {
                if (! (key in modifyKeyInfo)) {
                    modifyKeyInfo[key] = true;
                }
            } else {
                delete modifyKeyInfo[key];
            }
            if (Object.getOwnPropertyNames(modifyKeyInfo).length == 0) {
                // 状态还原
                record.$state = 0;
            } else {
                record.$state = 2;
            }
        },
        getModifyRecords() {
            // 获取修改的记录
            let modifyRecords = this.tempData.filter(record => {
                if (!!record.$state) {
                    return record;
                }
            });
            return modifyRecords;
        },
        commitChanges() {
            let modifyRecords = this.getModifyRecords();
            if (modifyRecords.length > 0) {
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
            if (modifyRecords.length > 0) {
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
        getEventValue(componentType, argu) {
            if (componentType == 'Input') {
                return argu.target.value;
            } else if (componentType == 'InputNumber') {
                return argu;
            } else if(componentType == 'ComboSelect') {
	        return argu;
	    } else {
                if (argu.target) {
                    return argu.target.value;
                } else {
                    return argu;
                }
            }
        },
	getProperties() {
	    let properties = {};
	    this.tempData.forEach(row => {
	        properties[row.propertyKey] = row[this.valueKey];
	    });
	    return properties;
	},
	loadData(data) {
 
            // force to end editing before loading
	    this.endEditing()
            this.forceEndEditing = true;

            this.initEdit(data);
	    this.bindData = data;
	    this.rawData = JSON.parse(JSON.stringify(data));
	    this.tempData = JSON.parse(JSON.stringify(data));
            
	    // setting  forceEndEditing false when table is rendered 
            setTimeout(()=> { 
               this.forceEndEditing = false;
	    },50);
	}
    },
    computed: {
        editData() {
            return this.tempData;
        }
    },
    data() {
        return {
            //  tableDomId : new Date().getTime(),
            rawData: [],
            tempData: [],
	    bindData : this.propertyValues,
            editRowIndex: -1,
            editColumnKey: '',
	    valueKey : '',
	    changeBySelfEdit  : false,
	    forceEndEditing : false,

            callbacks : {},
            editors : {},
            formatters : {}
        }
    },
    watch: {
           propertyValues: {
		handler (newPropertyValues,oldPropertyValues) {
		   if(!this.changeBySelfEdit) {
		        if(this.dataBindable) {
		            // 直接持久化表格
			    this.loadData(newPropertyValues);
		        }	
		   } 
		   this.changeBySelfEdit = false;
		},
		deep: true // 深度变化
	   }
    }
}
</script>