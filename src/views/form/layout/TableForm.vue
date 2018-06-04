<template>
<table ref='tab' class="tableContainer" width="90%">
    
    <template v-if='form.operationRow.align == "top"'>

        <tr class='sortable' :class="{'operation-row-selected' : form.operationRow.selected}"
        type="flex" :justify="form.operationRow.rowConfig.justify" @click.native='clickOperationRow'
        @dblclick.native='dblClickOperationRow'>
            <td>
                <Button type="dashed" icon="arrow-down-c" @click='form.operationRow.align = "bottom";$event.stopPropagation();'>
                </Button>
            </td>
            <td> 
                
                    <template v-for='button in form.operationRow.fixedButtons'>
                        <Button :type="button.type" :icon="button.icon">
                            {{button.text}}
                            <i class="ivu-icon ivu-icon-ios-close-empty">
                            </i>
                        </Button>
                    </template>
            </td>
            <td>
                
                    <template v-for='(button,index) in form.operationRow.buttons'>
                        <Button :type="button.type" :icon="button.icon" @click='buttonEdit(button,$event)'>
                            {{button.text}}
                            <span class="ivu-icon ivu-icon-ios-close-empty" @click='delButton(index,$event)'>
                            </span>
                        </Button>
                    </template>
            </td>
            <td>
                <Button type="dashed" icon="plus" @click='addButton($event)'>
                </Button>
            </td>
        </tr>
    </template>



   
	<template v-for='(row,index) in form.rows'>
	    <tr :id='row.rowId' class='sortable row-form-item' :gutter='row.rowConfig.gutter' @click.native='clickFormRow($event,row)'
	    @dblclick.native='dblClickFormRow($event,row)' :key="row.rowId">
		    <template v-for='(column,j) in row.columns'>
			<td :id='column.columnId' :class="{'form-item-selected' : column.selected}"
			:style='{height: row.rowConfig.rowHeight + "px"}'
			@click.native='clickColumn($event,column,row)'>
			    <FormItem v-if='column.columnConfig.showLabel' :label="column.columnConfig.label">
				<DynamicRender id='aaaaaa' v-if='column.model' :model='column.model' />
				<div class='item-mask'>
				</div>
			    </FormItem>
			    <template v-else>
				<DynamicRender v-if='column.model' :model='column.model' />
				<div class='item-mask'>
				</div>
			    </template>
			</td>
		    </template>
		    <td v-if='row.columns.length == 0'>
			<td :span='4' style="height: 40px;" draggable="true">
			</td>
		    </td>
	    </tr>
	</template>

    <template v-if='form.operationRow.align == "bottom"'>
        <tr class='sortable' :class="{'operation-row-selected' : form.operationRow.selected}"
        type="flex" :align='form.operationRow.rowConfig.align' :justify="form.operationRow.rowConfig.justify"
        @click.native='clickOperationRow' @dblclick.native='dblClickOperationRow'>
            <td>
                <Tooltip placement="left" content="移至头部">
                    <Button type="dashed" icon="arrow-up-c" @click='form.operationRow.align = "top";$event.stopPropagation();'>
                    </Button>
                </Tooltip>
            </td>
            <td>
                    <template v-for='button in form.operationRow.fixedButtons'>
                        <Button :type="button.type" :icon="button.icon">
                            {{button.text}}
                            <span class="ivu-icon ivu-icon-ios-close-empty">
                            </span>
                        </Button>
                    </template>
            </td>
            <td>
                
                    <template v-for='(button,index) in form.operationRow.buttons'>
                        <Button :type="button.type" :icon="button.icon" @click='buttonEdit(button,$event)'>
                            {{button.text}}
                            <span class="ivu-icon ivu-icon-ios-close-empty" @click='delButton(index,$event)'>
                            </span>
                        </Button>
                    </template>
            </td>
            <td>
                <Button type="dashed" icon="plus" @click='addButton($event)'>
                </Button>
            </td>
        </tr>
    </template>

</table>
</template>
<script>
import draggable from 'vuedraggable'
import Sortable from 'sortablejs'
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
        console.log('=== updated1 auto ');
	this.sortable();
    },
    methods : {
        sortable() {
		let me = this;
		Sortable.create(this.$refs.tab, {
		    handle : '.row-form-item',
		    animation:200,
		    onEnd (e) {
		       let movedRow = me.form.rows[e.oldIndex];
		       me.form.rows.splice(e.oldIndex, 1);
		       me.form.rows.splice(e.newIndex, 0, movedRow);
		    }
		});

		let rowEls = this.$refs.tab.querySelectorAll('.row-form-item');
		rowEls.forEach(el => {
		     Sortable.create(el, {
			    handle : 'td',
			    animation:200,
			    group : 'group-column',
			    onEnd (e) {
                               let oldIndex = e.oldIndex;
			       let newIndex = e.newIndex;

			       let fromEl = e.from;
			       let to = e.to; 

                               let fromId = fromEl.getAttribute('id');
			       let toId = to.getAttribute('id');

                               let fromRow = me.form.elements[fromId];
                               let movedCol = fromRow.columns[e.oldIndex];
                               if(fromId == toId) {
                                   fromRow.columns.splice(e.oldIndex, 1);
				   fromRow.columns.splice(e.newIndex, 0, movedCol);
			       } else {
			           let toRow = me.form.elements[toId];
				   fromRow.columns.splice(e.oldIndex, 1);
                                   toRow.columns.splice(e.newIndex, 0, movedCol);
			       }
			    }
			});
		});
	}
    },
    mounted() {
        console.log('=== mounted auto ');
	this.sortable();
    }

}
</script>

<style scoped>
.tableContainer {
    border-collapse: collapse;
    font-size: 13px;
    line-height: 24px;
    text-align: center;
}
.tableContainer tr td,.parameterMappingTable tr th {
    border: solid 1px #ccc;
    border-style: dotted;
    height: 40px;
}
.tableContainer .ivu-form-item {
    margin-bottom: 0px;
} 
.tableContainer tr {
    margin: 0px; 
    padding: 5px;
    padding-right: 20px;
    padding-left: 20px;
}


</style>