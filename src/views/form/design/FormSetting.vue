<style>

.settingForm .ivu-form-item {
    margin-bottom: 5px;
}

</style>

<template>

  <Accordion fit @change='change' @item-click='itemClick'>
      <AccordionPanel title='表单信息' active>
          <Form class='settingForm' :model="baseProps" :label-width="100">
              <FormItem label="名称" prop="name">
                  <Input v-model='baseProps.name' />
              </FormItem>
              <FormItem label="编码" prop="code">
                  <Input v-model='baseProps.code' />
              </FormItem>
              <FormItem label="版本号" prop="version">
                  <Input v-model='baseProps.version' />
              </FormItem>
              <FormItem label="描述" prop="description">
                  <Input v-model='baseProps.description' />
              </FormItem>
          </Form>
      </AccordionPanel>
      <AccordionPanel title='公共配置'>
          <PropertyTable data-bindable size="small" ref="commonRef" border :propertyColumns="propertyColumns" :propertyValues="commonValues"></PropertyTable>
      </AccordionPanel>
      <AccordionPanel title='行属性' :active='current == 1'>
          <PropertyTable size="small" ref="rowRef" border :propertyColumns="propertyColumns" :propertyValues="rowValues"></PropertyTable>
      </AccordionPanel>
      <AccordionPanel title='列属性' :active='current == 2' :hide='current != 2'>
          <PropertyTable size="small" ref="columnRef" border :propertyColumns="propertyColumns" :propertyValues="columnValues"></PropertyTable>
      </AccordionPanel>
      <AccordionPanel title='组件设置' :hide='current != 2'>
          <ComponentPropsSetting v-if='selectColumn' :componentName='selectColumn.model.type' :componentProps='componentProps' />
      </AccordionPanel>
      <AccordionPanel title='按钮' :active='current == 3' :hide='current != 3'>
          <!--按钮配置-->
          <PropertyTable size="small" ref="buttonRef" border :propertyColumns="propertyColumns" :propertyValues="buttonValues"></PropertyTable>
      </AccordionPanel>
  </Accordion>
</template>

<script>

import ComponentPropsSetting from '../settings/ComponentPropsSetting'
export default {
    components: {
        ComponentPropsSetting
    },
    data() {
        return {
            currentType: 1, // 1 == 表单； 2 == 行， 3 == 列；4 = 组件
            propertyColumns: [{
                title: '名称',
                width: 120,
                key: 'propertyName'
            }, {
                title: '值',
                key: 'propertyValue'
            }],
            rowValues: [],
            columnValues: [],
            buttonValues: []
        }
    },
    methods: {
        change(v1) {},
            itemClick(index, panel) {

            },
            setColumnValues(column) {
                let columnConfig = column.columnConfig;
                let columnValues = this.columnValues;
                columnValues.length = 0;
                let showLabel = {
                    propertyName: '是否显示标签',
                    propertyKey: 'showLabel',
                    propertyValue: columnConfig.showLabel,
                    editor: {
                        type: 'ComboSelect',
                        props: {
                            data: [{
                                key: 1,
                                label: '是'
                            }, {
                                key: 0,
                                label: '否'
                            }]
                        }
                    },
                    callback: (k, v) => {
                        columnConfig.showLabel = v;
                    },
                    formatter: (v) => {
                        return v == 1 ? '是' : '否';
                    }
                }
                columnValues.push(showLabel);
                columnValues.push(...[{
                    propertyName: '标签',
                    propertyKey: 'label',
                    propertyValue: columnConfig.label,
                    callback: (k, v) => {
                        columnConfig.label = v;
                    }
                }, {
                    propertyName: '属性值',
                    propertyKey: 'key',
                    propertyValue: columnConfig.key,
                    callback: (k, v) => {
                        columnConfig.key = v;
                    }
                }, {
                    propertyName: '组件类型',
                    propertyKey: 'type',
                    editor: {
                        type: 'ComboSelect',
                        props: {
                            data: [{
                                key: '',
                                label: '请选择'
                            }, {
                                key: 'FormInput',
                                label: 'FormInput'
                            }, {
                                key: 'FormComboSelect',
                                label: 'FormComboSelect'
                            },{
                                key: 'FormComboTree',
                                label: 'FormComboTree'
                            }, {
                                key: 'FormNumberInput',
                                label: 'FormNumberInput'
                            },{
                                key: 'FormDatePicker',
                                label: 'FormDatePicker'
                            },{
                                key: 'FormSwitch',
                                label: 'FormSwitch'
                            }]
                        }
                    },
                    callback: (k, v) => {
                        columnConfig.type = v;
                        column.model.type = v;
                    },
                    propertyValue: columnConfig.type
                }]);
                // 如果要自动绑定，可以在组件中监控data,目前未处理，手动加载数据。
                this.$refs.columnRef.loadData(columnValues);
            },
            setRowValues(row) {
                let rowValues = this.rowValues;
                rowValues.length = 0;
                let rowConfig = row.rowConfig;

                let isButtonRow = row.type == 'buttons';
                rowValues.push(...[{
                    propertyName: '间距(px)',
                    propertyKey: 'gutter',
                    propertyValue: rowConfig.gutter,
                    editor: 'InputNumber',
                    callback: (k, v) => {
                        rowConfig.gutter = v;
                    }
                }, {
                    propertyName: '行高',
                    propertyKey: 'rowHeight',
                    propertyValue: isButtonRow ? '-' : rowConfig.rowHeight,
                    editor: 'InputNumber',
                    readOnly: isButtonRow,
                    callback: (k, v) => {
                        rowConfig.rowHeight = v;
                    }
                }, {
                    propertyName: '垂直对齐',
                    propertyKey: 'align',
                    propertyValue: 'top',
                    callback: (k, v) => {
                        rowConfig.align = v;
                    }
                }, {
                    propertyName: '水平位置',
                    propertyKey: 'justify',
                    propertyValue: !isButtonRow ? '-' : rowConfig.justify,
                    readOnly: !isButtonRow,
                    callback: (k, v) => {
                        rowConfig.justify = v;
                    },
                    editor: {
                        type: 'ComboSelect',
                        props: {
                            data: [{
                                key: 'start',
                                label: '左'
                            }, {
                                key: 'center',
                                label: '中'
                            }, {
                                key: 'end',
                                label: '右'
                            }]
                        }
                    },
                    formatter: (v) => {
                        return v == 'start' ? '左' : (v == 'center' ? '中' : '右');
                    }
                }]);
                this.$refs.rowRef.loadData(rowValues);
            },
            setButton(btn) {
                let buttonValues = this.buttonValues;
                buttonValues.splice(0, buttonValues.length);

                buttonValues.push(...[{
                    propertyName: '按钮名称',
                    propertyKey: 'text',
                    propertyValue: btn.text,
                    callback: (k, v) => {
                        btn.text = v;
                    }
                }, {
                    propertyName: '按钮样式',
                    propertyKey: 'type',
                    propertyValue: btn.type,
                    callback: (k, v) => {
                        btn.type = v;
                    }
                }, {
                    propertyName: '图标',
                    propertyKey: 'icon',
                    propertyValue: btn.icon,
                    callback: (k, v) => {
                        btn.icon = v;
                    }
                }, {
                    propertyName: '事件',
                    propertyKey: 'eventFn',
                    propertyValue: btn.eventFn,
                    callback: (k, v) => {
                        btn.eventFn = v;
                    }
                }]);

                this.$refs.buttonRef.loadData(buttonValues);
            }
    },
    computed: {
        designOption() {
            return this.$store.state.form.designOption;
        },
        current() {
                return this.$store.state.form.selection.selectType;
            },
            baseProps() {
                return this.$store.state.form.form.baseProps;
            },
            commonValues() {
                let commonCfg = this.$store.state.form.form.common_cfg;

                if (!commonCfg) {
                    return;
                }

                let commonValues = [];
                commonValues.push({
                    propertyName: '标签宽度',
                    propertyKey: 'labelWidth',
                    propertyValue: commonCfg.labelWidth,
                    editor: {
                        type: 'InputNumber',
                        props: {
                            step: 2
                        }
                    },
                    callback: (k, v) => {
                        commonCfg.labelWidth = v;
                    }
                }, {
                    propertyName: '每行初始化列数',
                    propertyKey: 'initColCountPerRow',
                    propertyValue: commonCfg.initColCountPerRow,
                    editor: {
                        type: 'InputNumber',
                        props: {
                            min: 1,
                            max: 4
                        }
                    },
                    callback: (k, v) => {
                        commonCfg.initColCountPerRow = v;
                    }
                }, {
                    propertyName: '表单布局',
                    propertyKey: 'layout',
                    propertyValue: commonCfg.layout,
                    editor: {
                        type: 'ComboSelect',
                        props: {
                            data: [{
                                key: 'default',
                                label: 'default'
                            }, {
                                key: 'grid',
                                label: 'grid'
                            }, {
                                key: 'column',
                                label: 'column'
                            }]
                        }
                    },
                    callback: (k, v) => {
                        commonCfg.layout = v;
                    }
                });
                return commonValues;
            },
            selectColumn() {
                return this.$store.state.form.selection.selectColumn;
            },
            selectRow() {
                return this.$store.state.form.selection.selectRow;
            },
            selectButton() {
                return this.$store.state.form.selection.selectButton;
            },
            componentProps() {
                return this.selectColumn.model.props || (this.selectColumn.model.props = {});
            }
    },
    watch: {
        selectColumn: {
            handler(column, oldColumn) {
                    if (column) {
                        column.selected = true;
                    }
                    if (oldColumn) {
                        oldColumn.selected = false;
                    }
		    if(true || this.designOption.type == "form") {
		        if(column) {
			    this.setColumnValues(column);
			}
		    }
                },
                deep: false
        },
        selectRow: {
	    handler(row) {
		if(true || this.designOption.type == "form") {
		    if (row) {
			this.setRowValues(row);
		    }
		} else {
		}
	    },
	    deep: false
        },
        selectButton: {
            handler(button) {
                if(true || this.designOption.type == "form") {
		    if (button) {
			this.setButton(button);
		    }
		} else {
		}
	    },
            deep: false
        }
    }
}

</script>
