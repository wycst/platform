<style scoped>

.form-item-row {
    margin: 0;
    padding: 0;
    min-height: 33px;
}

.form-layout-default,.form-layout-grid,.form-layout-column {
    overflow: hidden;
}

.form-layout-default .form-item-row {
    margin: 0px;
    padding: 5px;
    padding-right: 20px;
    padding-left: 20px;
    overflow: hidden;
    border: 1px gray dotted;
    border-top: 0px;
}

.form-layout-default .form-item-row:first-child {
    border-top: 1px gray dotted;
}

.form-layout-default .ivu-form-item {
    margin-bottom: 0px;
}

.form-layout-default .form-item-selected {
    background: #ebf7ff;
}

.form-layout-default .operation-row-selected {
   // background: #ebf7ff;
}

.sortable-ghost {
    opacity: 0.9;
    border: #ebf7ff dotted 1px;
}


/*================ grid form  网格 */

.form-layout-grid .form-item-row {
    margin: 0px;
    overflow: hidden;
    border: 1px #ccc dotted;
    border-top: 0px;
    background-color: #fafafa;
}

.form-layout-grid div.form-item-row:nth-child(1) {
    border-top: 1px #ccc dotted;
}

.form-layout-grid .form-item-row .ivu-col {
    transition: all .2s;
    padding-left: 10px !important;
    padding-right: 10px !important;
    border-left: 1px #ccc dotted;
}

.form-layout-grid .ivu-col:first-child {
    border-left: 0px;
}

.form-layout-grid .ivu-form-item {
    margin-bottom: 0px;
}

.form-layout-grid .form-item-selected {
    background: #ebf7ff;
}

.form-layout-grid .operation-row-selected {
  //  background: #ebf7ff;
}

</style> <style> .placeholder {
    border: dotted lightblue 1px;
    //background: lightblue;
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

.form-layout-grid .ivu-col .ivu-input,
.form-layout-grid .ivu-col .ivu-select-selection {
    border-radius: 0px;
}

</style>

<template>

<Card ref="mainCard">

    <div :style="{width :'100%',background : 'white',overflow : 'auto'}">

        <Form :model="formData" :label-width='form.common_cfg.labelWidth'>

            <div :class='{"form-layout-default" : form.common_cfg.layout == "default","form-layout-grid" : form.common_cfg.layout == "grid","form-layout-column" : form.common_cfg.layout == "column"}'>

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
                                    <Col :id='column.columnId' class='sort-column' :class="{'form-item-selected' : column.selected}" :span="getSpan(row.columns.length)" :style='{height: row.rowConfig.rowHeight + "px",width : getWidthPercent(row.columns.length) + "%"}' @click.native='clickColumn($event,column,row)'>
                                        <FormItem v-if='column.columnConfig.showLabel' :style='{"margin-right" : column.selected ? "36px" : null}' :label="column.columnConfig.label">
                                            <FormDynamicRender :autoLoad='false' v-if='column.model' :model='column.model' />
                                            <div class='item-mask'></div>
                                        </FormItem>
                                        <template v-else>
                                            <FormDynamicRender v-if='column.model' :model='column.model' :style='{"padding-right" : column.selected ? "36px" : null}' />
                                            <div class='item-mask'></div>
                                        </template>
                                        <div v-show='column.selected' style='position: absolute;right: 10px;top: 50%; transform: translateY(-50%);width:24px;'>
                                            <Button type="text" size='small' style='height:31px;' icon="minus" @click='deleteColumn(row,index,$event)'></Button>
                                        </div>
                                    </Col>
                                </template>
                                <template v-if='row.columns.length == 0'>
                                    <Col :span='4' style="height: 33px;" draggable="true">
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

        </Form>

    </div>

</Card>

</template>

<script>

//import TableForm from '../form/layout/TableForm'
//import ColumnForm from '../form/layout/ColumnForm'

document.title = '表单编辑测试';
import draggable from 'vuedraggable'
export default {
    name: 'form-edit',
    components: {
        draggable
    },
    data() {
        return {
            offsetTop: 0,
            formData: {
            }
        }
    },
    mounted() {
        this.offsetTop = this.$refs.mainCard.$el.getBoundingClientRect().top;
    },
    computed: {
        clientHeight() {
            return this.$store.state.common.documentBodyClientHeight - 70 - this.offsetTop;
        },
        paperWidth() {
            return document.body.clientWidth - 270;
        },
        layoutHeight() {
            return this.$store.state.common.documentBodyClientHeight - this.offsetTop;
        },
        form() {
            return this.$store.state.form.form;
        }
    },
    methods: {
        getFormHtml() {
            console.log(document.body.querySelector('.form-layout-default'));
        },
        addColumn(row, e) {
            e.stopPropagation();
        },
        deleteColumn(row, index, e) {
            e.stopPropagation();
            let columns = row.columns;
            if (columns.length > 0) {
                columns.pop();
            } else {
                this.form.rows.splice(index, 1);
            }
        },
        addButton(e) {
            let buttons = this.$store.state.form.form.operationRow.buttons;
            this.$store.state.form.form.operationRow.buttons.push({
                type: 'ghost',
                text: '按钮 ' + (buttons.length + 1),
                icon: ''
            });
            e.stopPropagation();
        },
        delButton(index, e) {
            let buttons = this.$store.state.form.form.operationRow.buttons;
            buttons.splice(index, 1);
            e.stopPropagation();
        },
        buttonEdit(button, e) {
            console.log(e);
            this.$store.commit('setSelection', {
                selectType: 3,
                selectButton: button
            });
            e.stopPropagation();
        },
        getSpan(columnCount) {
            let gridCount = 24;
            if (gridCount % columnCount == 0) {
                return gridCount / columnCount;
            } else {
                let n = gridCount % columnCount;
                return (gridCount - n) / columnCount;
            }
        },
        getWidthPercent(columnCount) {
            return 100 / columnCount;
        },
        deleteRow() {
            this.form.rows.pop();
        },
        preview() {
            this.$router.push('/formpreview')
        },
        clickOperationRow() {
            this.$store.commit('setSelection', {
                selectType: 1,
                selectRow: this.form.operationRow
            });
            this.form.operationRow.selected = !this.form.operationRow.selected;
        },
        dblClickOperationRow() {
            this.$layouts.formdesign.eastCollapse(false);
            this.$store.commit('setSelection', {
                selectRow: this.form.operationRow
            });
        },
        clickFormRow(e, row) {
            e.stopPropagation();
            this.$store.commit('setSelection', {
                selectType: 1,
                selectRow: row
            });
        },
        dblClickFormRow(e, row) {
            e.stopPropagation();
            // 显示右侧配置
            this.$layouts.formdesign.eastCollapse(false);
            this.$store.commit('setSelection', {
                selectRow: row
            });
        },
        clickColumn(e, column, row) {
            column.selected = !column.selected;
            e.stopPropagation();
            this.$store.commit('setSelection', {
                selectType: 2,
                selectColumn: column,
                selectRow: row
            });

        }
    }
}

</script>
