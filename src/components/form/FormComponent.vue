<template>
    <Form ref='form' :model='formData' :label-width='form.common_cfg.labelWidth'>
        <div :class='{"form-layout-default" : form.common_cfg.layout == "default","form-layout-grid" : form.common_cfg.layout == "grid"}'>
            
	    <template v-if='form.operationRow.align == "top"'>
                <Row class='form-row form-operation-row' type="flex" :align='form.operationRow.rowConfig.align' :justify="form.operationRow.rowConfig.justify">
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
				<FormDynamicRender v-if='column.model' :formModel='formData' v-model='formData[column.columnConfig.key || column.columnId]' :model='column.model' />
			    </FormItem>
                            <template v-else>
                                <FormDynamicRender v-if='column.model' :model='column.model' />
                            </template>
                        </Col>
                    </template>
                </Row>
            </template>

            <template v-if='form.operationRow.align == "bottom"'>
                
		<div style='border:0;height:20px;margin-bottom:15px;border-bottom:1px solid #e9eaec;'>
			<!--split-->
		</div>

		<Row class='form-row form-operation-row' type="flex" :align='form.operationRow.rowConfig.align' :justify="form.operationRow.rowConfig.justify">
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
        </div>
    </Form>
</template>

<script>

     export default {
        name  : 'FormComponent',
	props : {
	    formId : [String,Number]
	},
	components : {
	},
	created() {
	    // 解析form对象，加载所有的formitem列，取出key，添加到this.formData
            if(this.form.rows) {
                // this.formData = {};
	        this.form.rows.forEach(row => {
		    if(row.type == 'formitem') {
		         row.columns.forEach(column => {
			     let key = column.columnConfig.key;
			     if(key) {
			        this.$set(this.formData,key,null);
			     } else {
			        this.$set(this.formData,column.columnId,null);
			     }
			 });
		    }
		});
	    }
	},
	data () {
		 return {
		    formData: {}
		 }  
	},
	mounted () {
	   console.log('============= formId = ' + this.formId);
	},
	computed : {
	   rows() {
	       return this.$store.state.form.form.rows;
	   },
	   form() {
	       // 正常操作 通过formId查询后台,这里写死form
	      return this.$store.state.form.form;
	   }
	},
	methods : {
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
	       console.log('========== saveForm call');
               this.formData.name = new Date().getTime();
	   },
	   submitForm() {
	       console.log('========== submitForm call');
	       console.log('========== this.formData ：  ' + JSON.stringify(this.formData));
	   },
	   resetForm() {
	       this.$refs.form.resetFields();
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

  .form-layout-grid .form-item-row { 
      margin: 0px; 
      // min-height : 32px;
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

</style>
<style>
  .form-layout-grid .ivu-col .ivu-input,.form-layout-grid .ivu-col .ivu-select-selection {
      border-radius: 0px;
  }
</style>