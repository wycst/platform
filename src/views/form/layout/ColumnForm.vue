<template>
 <div class="columnContainer">

      <template v-if='form.operationRow.align == "top"'>
	  <Row class='form-row form-operation-row' :class="{'operation-row-selected' : form.operationRow.selected}" type="flex" :justify="form.operationRow.rowConfig.justify" @click.native='clickOperationRow' @dblclick.native='dblClickOperationRow'>

		<Col>
		    <Button type="dashed" icon="arrow-down-c" @click='form.operationRow.align = "bottom";$event.stopPropagation();'></Button>
		</Col>
		<Col>
		    <draggable v-model="form.operationRow.fixedButtons" :options="{group:'group-fixedButtons',animation:200}">
		       <template v-for='button in form.operationRow.fixedButtons'>
			    <Button :type="button.type" :icon="button.icon">
				 {{button.text}}
				 <i class="ivu-icon ivu-icon-ios-close-empty"></i>
			    </Button>
		       </template>
		    </draggable>
		</Col>
		<Col>
		    <draggable v-model="form.operationRow.buttons" :options="{group:'group-buttons',animation:200}">
		       <template v-for='(button,index) in form.operationRow.buttons'>
			    <Button :type="button.type" :icon="button.icon" @click='buttonEdit(button,$event)'>
				 {{button.text}}
				 <span class="ivu-icon ivu-icon-ios-close-empty" @click='delButton(index,$event)'></span>
			    </Button>
		       </template>
		    </draggable>
		</Col>

		<Col>
		    <Button type="dashed" icon="plus" @click='addButton($event)'></Button>
		</Col>
	  </Row>

	  <div style='border:0;height:15px;margin-bottom:20px;border-bottom:1px solid #e9eaec;'>
	        <!--split-->
	  </div>

      </template> 

      <draggable v-if='form.rows.length > 0' v-model="form.rows" :options="{group:'group-row',animation:200}">
	  <template v-for='(row,index) in form.rows'>
		  <Row :id='row.rowId' class='form-row form-item-row' :gutter='row.rowConfig.gutter' @click.native='clickFormRow($event,row)' @dblclick.native='dblClickFormRow($event,row)' :key="row.rowId">
			<draggable v-model="row.columns" :options="{group:'group-column',animation:200,handle : '.sort-column'}">
				<template v-for='(column,j) in row.columns'>
					<Col :id='column.columnId' class='sort-column' :class="{'form-item-selected' : column.selected}" :span="getSpan(row.columns.length)" :style='{height: row.rowConfig.rowHeight + "px"}' @click.native='clickColumn($event,column,row)'>
					    <FormItem v-if='column.columnConfig.showLabel' :style='{"margin-right" : column.selected ? "36px" : null}' :label="column.columnConfig.label">
						<DynamicRender v-if='column.model' :model='column.model'/>
						<div class='item-mask'></div>
					    </FormItem>
					    <template v-else>
						<DynamicRender v-if='column.model' :model='column.model'/>
						<div class='item-mask'></div>
					    </template>

					    <div v-show='column.selected' style='position: absolute;right: 10px;top: 50%; transform: translateY(-50%);width:24px;'>
						<Button type="text" size='small' style='height:31px;' icon="minus" @click='deleteColumn(row,index,$event)'></Button>
					    </div>
					</Col>
				</template>
				<template v-if='row.columns.length == 0'>
				       <Col :span='4' style="height: 35px;" draggable="true">
				            <div style='position: absolute;left: 10px;top: 50%; transform: translateY(-50%);width:24px;'>
						<Button type="text" size='small' style='height:31px;' icon="minus" @click='deleteColumn(row,index,$event)'></Button>
					    </div>
				       </Col>
				</template>
			</draggable>

		  </Row>
	  </template>
      </draggable>

      <template v-if='form.operationRow.align == "bottom"'>
	  
          <div style='border:0;height:20px;margin-bottom:15px;border-bottom:1px solid #e9eaec;'>
	        <!--split-->
	  </div>

	  <Row class='form-row form-operation-row' :class="{'operation-row-selected' : form.operationRow.selected}" type="flex" :align='form.operationRow.rowConfig.align' :justify="form.operationRow.rowConfig.justify" @click.native='clickOperationRow' @dblclick.native='dblClickOperationRow'>

		<Col>
		     <Button type="dashed" icon="arrow-up-c" @click='form.operationRow.align = "top";$event.stopPropagation();'></Button>
		</Col>
		<Col>
		    <draggable v-model="form.operationRow.fixedButtons" :options="{group:'group-fixedButtons',animation:200}">
		       <template v-for='button in form.operationRow.fixedButtons'>
			    <Button :type="button.type" :icon="button.icon">
				<span>{{button.text}}</span>
				<span class="ivu-icon ivu-icon-ios-close-empty"></span>
			    </Button>
		       </template>
		    </draggable>
		</Col>
		<Col>
		    <draggable v-model="form.operationRow.buttons" :options="{group:'group-buttons',animation:200}">
		       <template v-for='(button,index) in form.operationRow.buttons'>
			    <Button :type="button.type" :icon="button.icon" @click='buttonEdit(button,$event)'>
				<span>{{button.text}}</span>
				<span class="ivu-icon ivu-icon-ios-close-empty" @click='delButton(index,$event)'></span>
			    </Button>
		       </template>
		    </draggable>
		</Col>

		<Col>
		    <Button type="dashed" icon="plus" @click='addButton($event)'></Button>
		</Col>
	  </Row>
      </template> 
</div>
</template>
<script>
import draggable from 'vuedraggable'
import DynamicRender from '@/components/DynamicRender.vue'
export default {
    name : 'TableForm',
    components : {
	   DynamicRender,
	   draggable
    },
    computed : {
		form() {
		   return this.$store.state.form.form;
		}
    },
    updated() {
      
    },
    methods : {
		getFormHtml() {
		   console.log(document.body.querySelector('.columnContainer'));
		},
		addColumn(row,e) {
		   e.stopPropagation();
		},
		deleteColumn(row,index,e) {
		   e.stopPropagation();
		   let columns = row.columns;
		   if(columns.length > 0) {
				columns.pop();
		   } else {
				this.form.rows.splice(index,1);
		   }
		},
		addButton(e) {
		   let buttons = this.$store.state.form.form.operationRow.buttons;
		   this.$store.state.form.form.operationRow.buttons.push({
					type : 'ghost',
					text : '自定义按钮 ' + (buttons.length + 1),
					icon :  '' 
				});
		   e.stopPropagation();
		},
		delButton(index,e) {
		   let buttons = this.$store.state.form.form.operationRow.buttons;
		   buttons.splice(index,1);
		   e.stopPropagation();
		},
		buttonEdit(button,e) {
		   this.$store.commit('setSelection', {
			   selectType : 3,
			   selectButton :button 
		   });
		   e.stopPropagation();
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
		deleteRow() {
		   this.form.rows.pop();
		},
		preview() {
		   this.$router.push('/formpreview') 
		},
		clickOperationRow() {
		   this.$store.commit('setSelection', {
			   selectType : 1,
			   selectRow :this.form.operationRow 
		   });
		   this.form.operationRow.selected = !this.form.operationRow.selected;
		},
		dblClickOperationRow() {
		   this.$layouts.formdesign.eastCollapse(false);
		   this.$store.commit('setSelection', {
				selectRow :this.form.operationRow 
		   });
		},
		clickFormRow(e,row) {
		   e.stopPropagation();
		   this.$store.commit('setSelection', {
			   selectType : 1,
			   selectRow :row 
		   });
		},
		dblClickFormRow(e,row) {
		   e.stopPropagation();
		   // 显示右侧配置
		   this.$layouts.formdesign.eastCollapse(false);
		   this.$store.commit('setSelection', {
				selectRow :row 
		   });
		},
		clickColumn(e,column,row) {
		   column.selected = !column.selected;
		   e.stopPropagation();
		   this.$store.commit('setSelection', {
			   selectType : 2,
			   selectColumn :column,
			   selectRow :row
		   });

		}
    },
    mounted() {
       
    }

}
</script>

<style scoped>
  .form-item-row { 
      margin: 0; 
      padding: 0;
      min-height : 32px;
  }
  .columnContainer .form-item-row { 
      margin: 0px; 
     // padding: 5px;
      overflow:hidden;
      border : 1px #ccc dotted;
      border-top : 0px;
      background-color : #fafafa;
  }
  .columnContainer div.form-item-row:nth-child(1) {
      border-top: 1px #ccc dotted;
  }
  .columnContainer .form-item-row .ivu-col {
      transition: all .2s;
      padding-left : 10px;
      padding-right : 10px;
      border-left : 1px #ccc dotted;
  }

  .columnContainer .ivu-col:first-child {
      border-left : 0px;
  }

  .columnContainer .ivu-form-item {
      margin-bottom: 0px;
  } 
  .columnContainer .form-item-selected {
      background: #ebf7ff;
  }
  .columnContainer .operation-row-selected {
      background: #ebf7ff;
  }

  .sortable-ghost {
      opacity: 0.9;
      border: #ebf7ff dotted 1px;
  }

</style>
<style>
  .columnContainer .ivu-col .ivu-input,.columnContainer .ivu-col .ivu-select-selection {
      border-radius: 0px;
  }
</style>