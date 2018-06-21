<style scoped>

.form-item-row {
    margin: 0;
    padding: 0;
}

.form-layout-default .form-item-row {
    margin: 2px;
    padding: 2px;
    padding-right: 20px;
    padding-left: 20px;
    overflow: hidden;
}

.form-layout-grid .ivu-select-disabled .ivu-select-input[disabled] {
    color: red !important;
}

.form-layout-grid .form-item-row {
    margin: 0px;
    padding-top: 1px;
    overflow: hidden;
    border: 1px #ccc solid;
    border-top: 0px;
    background-color: #fafafa;
}

.form-layout-grid .form-item-row-first {
    border-top: 1px #ccc solid;
}

.form-layout-grid .form-item-row .ivu-col {
    transition: all .2s;
    padding-left: 10px;
    padding-right: 10px;
    border-left: 1px #ccc solid;
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

</style> <style> .form-layout-grid .ivu-col .ivu-input,
.form-layout-grid .ivu-col .ivu-select-selection {
    border-radius: 0px;
}

</style>

<template>

<Form ref='form' :model='model' :label-width='labelWidth'>

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
                        <FormItem :prop='column.columnId' v-if='column.columnConfig.showLabel' :label="column.columnConfig.label">
                            <FormDynamicRender v-if='column.model' :formModel='model' v-model='model[column.columnId].value' :model='column.model' />
                        </FormItem>
                        <template v-else>
                            <FormDynamicRender v-if='column.model' :formModel='model' v-model='model[column.columnId].value' :model='column.model' />
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
                <div :id='column.columnId'>
                    <FormItem v-if='column.columnConfig.showLabel' :label="column.columnConfig.label">
                        <FormDynamicRender v-if='column.model' :formModel='model' v-model='model[column.columnId].value' :model='column.model' />
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
    name: 'FormDisplay',
    props: {
        formId: [String, Number],
        stateId: [String, Number],
        modelId: [String, Number]
    },
    components: {},
    created() {
        // load form
        this.loadForm();
    },
    data() {
        return {
            form_uid: null,
            form : {},
            state : null,
            hideColumns: [],
	    initialFormData : {},
            formData: {}
        }
    },
    mounted() {
        console.log('============= formId = ' + this.formId);
    },
    computed: {
        labelWidth() {
                if (!this.form.common_cfg) {
                    return 100;
                }
                return this.form.common_cfg.labelWidth;
            },
            layout() {
                if (!this.form.common_cfg) {
                    return 'default';
                }
                return this.form.common_cfg.layout;
            },
            operationRow() {
                if (!this.form.operationRow) {
                    return {
                        rowConfig: {}
                    };
                }
                return this.form.operationRow;
            },
	    model() {
	        return this.formData;
	    }
    },
    methods: {
        loadForm() {
                this.$store.commit('loadFullform', {
                    formId: this.formId,
		    stateId : this.stateId,
		    modelId : this.modelId,
                    callback: formModel => {

                        if(!formModel.form) {
			    alert("form[id=" + this.formId + '] is not exist !');
			    return ;
			}
			this.form_uid = formModel.form.uid;
                        let form = JSON.parse(formModel.form.form_source);
			// init model
                        this.initModel(form);

			if(formModel.state) {
		           this.state = JSON.parse(formModel.state.state_source);
			}
			this.applyState(form);

                        // alert(btoa);
			if(formModel.model) {
			    // timer 下一个帧执行
			    setTimeout(()=> {
				Object.assign(this.formData,JSON.parse(formModel.model.model_source));
			        this.initialFormData = JSON.parse(formModel.model.model_source);
			    },0);
			}
			this.form = form;
                    }
                });
            },
            applyState(form) {

                let initStateOption = {
                    render: true,
                    hide: false,
                    readonly: false
                };

		let formState = this.state;
                Vue.set(form, 'state', (formState && formState.global) || {...initStateOption});

		// 初始化state
                form.rows.forEach(row => {
                    row.columns.forEach(column => {
                        let columnState = formState && formState.elementsState[column.columnId];
                        Vue.set(column, 'state', columnState || {...initStateOption
                        });
                    });
                    let rowState = formState && formState.elementsState[row.rowId];
		    Vue.set(row, 'state', rowState || {...initStateOption
                    });
                });

                // hide字段集合记录为hideColumns，
		// show的字段集合覆盖原来的rows属性
                let hideColumns = [];
                let rows = form.rows.filter(row => {
                    let renderRow = row.state.render;
                    let hideRow = row.state.hide;
                    let readonlyRow = row.state.readonlyRow;
                    if (renderRow) {
                        let columns = row.columns.filter(column => {
                            let filter = column.state.render && !column.state.hide;
                            if (hideRow) {
                                hideColumns.push(column);
                            } else {
                                if (column.state.render) {
                                    if (column.state.hide) {
                                        hideColumns.push(column);
                                    } else {
                                        if (readonlyRow || column.state.readonly) {
                                           Vue.set(column.model.props, 'readonly', true);
                                        }
                                    }
                                }
                            }
                            return !hideRow && filter;
                        });
                        row.columns = columns;
                        if (row.columns.length == 0) {
                            hideRow = true;
                        }
                    }
                    return renderRow && !hideRow;
                });
                form.rows = rows;
                this.hideColumns = hideColumns;
            },
	    initModel(form) {
		if (form.rows) {
		    form.rows.forEach(row => {
			if (row.type == 'formitem') {
			    row.columns.forEach(column => {
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
		this.initialFormData = JSON.parse(JSON.stringify(this.formData));
	    },
            applyModel(form,model) {
                Object.assign(this.formData,model);
		this.initialFormData = JSON.parse(JSON.stringify(this.formData));
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
            fn(f) {
                if (typeof(f) == 'function') {
                    f();
                } else {
                    this[f].call(this);
                }
            },
            saveForm() {
                if (!this.id) {
                    this.submitForm();
                }
            },
            submitForm() {

                let model_source = JSON.stringify(this.formData, 0, 4);
                console.log('========== this.formData ' + model_source);
		let options = {
                    form_uid: this.form_uid,
                    model_source: model_source,
                    callback: result => {
		        let query = Object.assign({},this.$router.currentRoute.query);
			if(result.insertId) {
                            query.modelId = result.insertId;
                        }
			// reflush
                        this.$router.push({
				    path: this.$router.currentRoute.path,
				    query: query
				});
                    }
                };
                if(this.modelId) {
                    options.id = this.modelId;
                }
                this.$store.commit('submitForm', options);
            },
            resetForm() {
		this.formData = JSON.parse(JSON.stringify(this.initialFormData));
            }
    },
    watch: {
        'formId' (id) {
            this.loadForm();
        },
	'stateId' () {
	    this.loadForm();
	},
	'modelId' () {
	    this.loadForm();
	}
    }
}

</script>
