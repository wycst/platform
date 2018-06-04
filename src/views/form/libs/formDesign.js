import $ from 'jquery'
import uuid from 'node-uuid'

class FormDesign {
    // 构造器
	constructor(form) {
		this.classId = 'FormDesign[' + this.uuid() + '@1.1.1]';
		if(form) {
		    this.form = form;
		} else {
		    this.initForm();
		}
    };
	uuid() {
		return uuid.v1();
	};
	initForm() {
		this.form = {
			type : "form",
		    baseProps  : {
			    name : '【表单名称】',
				code : 'testForm',
			    description : '表单描述信息',
				version     : '1.0'
			},
            /*表单通用配置*/
            common_cfg : {
				labelWidth : 120,
				initColCountPerRow : 2,
				layout : 'default'
			},
			rows : [],
			operationRow : {
				align:'bottom',
                type : 'buttons',
				selected : false,
				/*按钮行配置*/
				rowConfig : {
					gutter : 0,
					rowHeight : 40,
					layout : 'flex',
					align  : 'top',
					justify : 'end'
				},
				/*固定按钮*/
				fixedButtons : [{
				    type : 'ghost',
				    text : '保存',
				    icon :  'ios-flower',
					clickFn : 'saveForm'
				},{
				    type : 'ghost',
				    text : '提交',
				    icon :  'ios-flower',
					clickFn : 'submitForm'
				},{
				    type : 'ghost',
				    text : '重置',
				    icon :  'ios-flower',
					clickFn : 'resetForm'
				}],
				/*自定义按钮*/
			    buttons : []
			}
		};
	};
	init () {

	};
	destroyed() {
        this.form = null;
	};
    addFormItemRow() {
		let rows = this.form.rows;
		let rowId = this.uuid();

    let initState = {
       render : true,
			 hide : false,
			 readonly : false
		};

		let row = {
			rowId:rowId,
            type:'formitem',
						state : {...initState},
			rowConfig : {
				gutter : 0,
				rowHeight : 35,
				layout : 'flex',
				align  : 'top',
				justify : 'end'
			},
			columns : []
		};
        rows.push(row);

        let initColCountPerRow = this.form.common_cfg.initColCountPerRow;
        if(initColCountPerRow < 1) {
             initColCountPerRow = 2;
		}

        for(let columnIndex = 0 ; columnIndex < initColCountPerRow ; columnIndex++) {
		    let columnId = this.uuid();
			let column = {
				 columnId : columnId,
				 state : {...initState},
				 selected : false,
				 columnConfig : {
					 showLabel : 1,
					 label     : 'label ' + (columnIndex + 1),
					 key       :  null,
					 type      : 'FormInput'
				 },
				 model :  {
					 type : 'FormInput',
					 props : {
						size  : 'default',
						type : 'text'
					 }
				 }
			}
			row.columns.push(column);
			// this.form.elements[columnId] = column;
		}

        return row;
	};

	/**交换索引*/
    exchangeRowIndex () {

	};

    /**获取表单数据*/
    getFormData() {
	};

    /**设置表单数据 */
    setFormData(data,editable) {
	};

	validate() {
		let props = this.form.baseProps;
		if (!props.code) {
			alert("表单编码不能为空！");
			return false;
		}
		if (!props.name) {
			alert("表单名称不能为空！");
			return false;
		}
		if (!props.version) {
			alert("表单版本不能为空！");
			return false;
		}
		return true;
	};
	clear() {
		this.initForm();
	};
}

// 导出类
export default FormDesign;
