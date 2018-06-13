<template>

    <Form ref='form' :model='formData' :label-width='labelWidth'>

	<div :class='{"form-layout-default" : layout == "default","form-layout-grid" : layout == "grid"}'>

	    <template v-if='operationRow.align == "top"'>
                <Row class='form-row form-operation-row' type="flex" :align='operationRow.rowConfig.align' :justify="operationRow.rowConfig.justify">
                    <Col>
                        <template v-for='button in form.operationRow.fixedButtons'>
                            <Button :type="button.type" :icon="button.icon" @click='fn(button.clickFn)'>
                                {{button.text}}
                            </Button>
                        </template>
                    </Col>
                    <Col>
                        <template v-for='button in form.operationRow.buttons'>
                            <Button :type="button.type" :icon="button.icon">
                                {{button.text}}
                            </Button>
                        </template>
                    </Col>
                </Row>

		<div style='border:0;height:15px;margin-bottom:20px;border-bottom:1px solid #e9eaec;'>
		   <!--split-->
		</div>

            </template>

            <template v-for='(row,index) in form.rows'>
                <Row :id='row.rowId' v-if='row.columns[0]' class='form-row form-item-row' :class='{"form-item-row-first" : index == 0}' :gutter='row.rowConfig.gutter' :key="row.rowId">
                    <template v-for='(column,j) in row.columns'>
                        <Col :id='column.columnId' :span="getSpan(row.columns.length)" :style='{height: row.rowConfig.rowHeight + "px",width:getWidthPercent(row.columns.length) + "%"}'>
                            <FormItem :prop='column.columnConfig.key || column.columnId' v-if='column.columnConfig.showLabel' :label="column.columnConfig.label">
				<FormDynamicRender v-if='column.model' :formModel='formData' v-model='formData[column.columnId].value' :model='column.model' />
			    </FormItem>
                            <template v-else>
                                <FormDynamicRender v-if='column.model' :model='column.model' />
                            </template>
                            <div v-if='column.state.readonly' class='item-mask' :style="{width:'calc(100% - ' + (labelWidth + 12) + 'px)'}"></div>
                        </Col>
                    </template>
                </Row>
            </template>

            <template v-if='operationRow.align == "bottom"'>

		<div style='border:0;height:20px;margin-bottom:15px;border-bottom:1px solid #e9eaec;'>
			<!--split-->
		</div>

		<Row class='form-row form-operation-row' type="flex" :align='operationRow.rowConfig.align' :justify="operationRow.rowConfig.justify">
                    <Col>
                        <template v-for='button in form.operationRow.fixedButtons'>
                            <Button :type="button.type" :icon="button.icon" @click='fn(button.clickFn)'>
                                {{button.text}}
                            </Button>
                        </template>
                    </Col>
                    <Col>
                        <template v-for='(button,index) in form.operationRow.buttons'>
                            <Button :type="button.type" :icon="button.icon" @click='buttonEdit(button,$event)'>
                                {{button.text}}
                            </Button>
                        </template>
                    </Col>
                </Row>
            </template>

            <div class="form-hidden" style='display:none;'>
		    <template v-for='(column,index) in hideColumns'>
			 <div :id='column.columnId' >
			    <FormItem :prop='column.columnConfig.key || column.columnId' v-if='column.columnConfig.showLabel' :label="column.columnConfig.label">
				<FormDynamicRender v-if='column.model' :formModel='formData' v-model='formData[column.columnId].value' :model='column.model' />
			    </FormItem>
			    <template v-else>
				<FormDynamicRender v-if='column.model' :model='column.model' />
			    </template>
			 </div>
		    </template>
	    </div>

        </div>
    </Form>
</template>

<script>
     import Vue from 'vue'
     export default {
        name  : 'FormDisplay',
	props : {
	    formId  : [String,Number],
	    stateId : [String,Number],
	    dataId  : [String,Number]
	},
	components : {
	},
	created() {
            // load form
            this.loadForm();
	},
	data () {
		 return {
		    form_uid : null,
		    form : {},
		    state : {},
		    hideColumns : [],
		    formData: {}
		 }
	},
	mounted () {
	   console.log('============= formId = ' + this.formId);
	},
	computed : {
	   labelWidth() {
              if(!this.form.common_cfg) {
	          return 100;
	      }
	      return this.form.common_cfg.labelWidth;
	   },
	   layout() {
	      if(!this.form.common_cfg) {
	          return 'default';
	      }
	      return this.form.common_cfg.layout;
	   },
	   operationRow() {
	      if(!this.form.operationRow) {
	          return {
		      rowConfig : {}
		  };
	      }
	      return this.form.operationRow;
	   }
	},
	methods : {
           loadForm() {
		this.$store.commit('getForm', {
		    id: this.formId,
		    callback: formData =>{
			let form = JSON.parse(formData.form_source);
			this.form = form;
			// load state
			this.loadState();
			// load data
			this.loadModel();
		    }
		});
	   },
	   loadState() {
	        if(!this.stateId) {
		    return ;
		}
	        this.$store.commit('getState', {
		    id: this.stateId,
		    callback: stateData =>{
		        this.form_uid = stateData.uid;
                        let stateSource = stateData.state_source;
			if(stateSource) {
			     let formState = JSON.parse(stateSource);
			     this.state = formState;
			     this.applyState();
                        }
		    }
		});
	   },
	   applyState() {
		let form = this.form;
		let formState = this.state;
		Vue.set(form, 'state', formState.global);

		let initStateOption = {
		    render: true,
		    hide: false,
		    readonly: false
		};

		form.rows.forEach(row =>{
		    row.columns.forEach(column => {
			let columnState = formState.elementsState[column.columnId];
			Vue.set(column, 'state', columnState || {...initStateOption
			});
		    });
		    let rowState = formState.elementsState[row.rowId];
		    Vue.set(row, 'state', rowState || {...initStateOption
		    });
		});

		// state
                form.rows.forEach(row =>{
		    row.columns.forEach(column => {
			let columnState = formState.elementsState[column.columnId];
			Vue.set(column, 'state', columnState || {...initStateOption});
		    });
		    let rowState = formState.elementsState[row.rowId];
		    Vue.set(row, 'state', rowState || {...initStateOption});
		});

                let hideColumns = [];
                let rows = form.rows.filter( row => {
		      let renderRow = row.state.render;
		      let hideRow = row.state.hide;
		      let readonlyRow = row.state.readonlyRow;
		      if(renderRow) {
		          let columns = row.columns.filter(column => {
                                let filter = column.state.render && !column.state.hide;
				if(hideRow) {
				     hideColumns.push(column);
				} else {
				     if(column.state.render) {
				        if(column.state.hide) {
				            hideColumns.push(column);
				        } else {
					    if(readonlyRow || column.state.readonly) {
					        // Vue.set(column.model.props, 'readonly', true);
					    }
					}
				     }
				}
				return !hideRow && filter ;
			    });
			  row.columns = columns;
			  if(row.columns.length == 0) {
			      hideRow = true;
			  }
		      }
		      return renderRow && !hideRow;
		});
                form.rows = rows;
                this.hideColumns = hideColumns;
	   },
	   loadModel() {

		if (this.form.rows) {
		    // this.formData = {};
		    this.form.rows.forEach(row =>{
			if (row.type == 'formitem') {
			    row.columns.forEach(column =>{
				let key = column.columnConfig.key;
				let label = column.columnConfig.label;
				let columnValue = {
				    label: label,
				    key: key,
				    value: null
				};
				this.$set(this.formData, column.columnId, columnValue);
			    });
			}
		    });
		}
	   },
	   getSpan(columnCount) {
	       let gridCount = 24;
               if(gridCount % columnCount == 0) {
	           return gridCount / columnCount;
	       } else {
	           let n = gridCount % columnCount;
		   return (gridCount - n) / columnCount;
	       }
	   },
	   getWidthPercent(columnCount) {
	       return 100 / columnCount;
	   },
	   fn(f){
	       if(typeof(f) == 'function') {
	           f();
	       } else {
	           this[f].call(this);
	       }
	   },
	   saveForm() {
	       if(!this.id) {
	           this.submitForm();
	       }
	   },
	   submitForm() {
	       console.log('========== submitForm call');
	       console.log('========== this.formData ' + JSON.stringify(this.formData));
	       let model_source = JSON.stringify(this.formData,0,4)
	       this.$store.commit('submitForm',{
	           form_uid : this.form_uid,
                   model_source : model_source,
		   callback : res => {
		       console.log(res);
		   }
	       });
	   },
	   resetForm() {
	       this.$refs.form.resetFields();
	   }
	},
	watch : {
	    'formId'(id) {
	        this.loadForm();
	    }
	}
}

</script>

<style scoped>
  .form-item-row { margin: 0; padding: 0;}
  .form-layout-default .form-item-row {
      margin: 2px;
      padding: 2px;
      padding-right: 20px;
      padding-left: 20px;
      overflow:hidden;
   }

  .form-layout-grid .ivu-select-disabled  .ivu-select-input[disabled] {
       color: red !important;
  }

  .form-layout-grid .form-item-row {
      margin: 0px;
      overflow:hidden;
      border : 1px #ccc solid;
      border-top : 0px;
      background-color : #fafafa;
  }

  .form-layout-grid .form-item-row-first {
      border-top: 1px #ccc solid;
  }
  .form-layout-grid .form-item-row .ivu-col {
      transition: all .2s;
      padding-left : 10px;
      padding-right : 10px;
      border-left : 1px #ccc solid;
  }

  .form-layout-grid .ivu-col:first-child {
      border-left : 0px;
  }

  .form-layout-grid .ivu-form-item {
      margin-bottom: 0px;
  }
  .form-layout-grid .form-item-selected {
      background: #ebf7ff;
  }
  .form-layout-grid .operation-row-selected {
      background: #ebf7ff;
  }
  .item-mask {
      z-index: 100;
      background: #FFF;
      height: 100%;
      opacity: 0.1;
      filter: alpha(opacity=10);
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
  }


</style>
<style>
  .form-layout-grid .ivu-col .ivu-input,.form-layout-grid .ivu-col .ivu-select-selection {
      border-radius: 0px;
  }
</style>
