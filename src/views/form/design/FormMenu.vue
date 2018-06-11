<style>
.stateMenu .ivu-menu-item {
    padding: 7px 24px;
}
</style>

<template>
<Accordion fit>
    <AccordionPanel title='表单目录' active>
        <ModelTree ref='formTree' titleKey='name' dataType='raw' :url='formTreeDataUrl' @on-load='afterTreeLoad' @on-node-click='selectForm' @on-node-dblclick='dblclickTreeNode'></ModelTree>
    </AccordionPanel>
    <AccordionPanel title='状态列表' :hide='!showStateList'>
        <ButtonGroup style='margin-bottom:5px;'>
            <Button type="ghost" icon="plus" @click='addState'></Button>
            <Button type="ghost" icon="minus" @click='delState'></Button>
            <Button type="ghost" @click='unselectState'>取消选中</Button>
	</ButtonGroup>

        <Menu ref='stateMenu' class='stateMenu' :active-name='activeStateName' @on-select='selectState' width='auto'>
            <template v-for='state in stateList'>
                <MenuItem :name="state.id">
                    <Icon type="heart1"></Icon>
                    <span>{{state.name}}</span>
                </MenuItem>
            </template>
        </Menu>

    </AccordionPanel>
    <AccordionPanel title='表单模型树'>
        <ModelTree :titleRender='titleRender' @on-node-click='clickNode' @on-select-change='selectChange' childrenKey='columns' :model='this.$store.state.form.form.rows'></ModelTree>
    </AccordionPanel>
</Accordion>

</template>

<script>

import ModelTree from '@/components/tree/ModelTree'
import AddState from '../state/AddState'
export default {
    components: {
        ModelTree,
        AddState
    },
    data() {
        return {
            i: 1,
            activeStateName : null,
            data1: [{
                title: '表单',
                expand: true,
                children: [{
                    title: '01.表单',
                    expand: true
                }, {
                    title: '02.表单',
                    expand: true
                }]
            }]
        }
    },
    computed: {
        selectNode() {
                if (this.i && this.$refs.modelTree) {
                    return this.$refs.modelTree.getSelectedNodes();
                }
                return null;
            },
      	    showStateList() {
      	        return this.$store.state.form.showStateList;
      	    },
            stateList() {
                return this.$store.state.form.stateList;
            },
            formTreeDataUrl() {
                return this.$store.state.form.contextPath + this.$store.state.form.url.loadFormTree;
            },
            designOption() {
                return this.$store.state.form.designOption;
            }
    },
    updated() {
        if(this.$refs.stateMenu) {
	    this.$nextTick(()=> {
		this.$refs.stateMenu.updateActiveName(null);
	    });
	}
    },
    mounted() {
        this.$eventTarget.$on('on-refresh-formtree',this.refreshFormtree);
    },
    methods: {
            dblclickTreeNode(node) {
	        if(node.type == 'node') {
		    this.$layouts.formdesign.eastCollapse(false);
		}
	    },
            refreshFormtree() {
	        this.$refs.formTree.reload();
	    },
            afterTreeLoad(tree) {
                let formId = this.$route.query.id;
                tree.select(formId);
            },
            selectForm(node) {
                if (node && node.type == 'node') {
                    let formId = this.$route.query.id;
                    if (formId != node.id) {
                        // 刷新页面的数据
                        // 方法1 直接刷新页面
                        // 方法2 修改router的地址，通过query的id加载
			// 方法3 直接loadForm，传递表单的id
			if(formId) {
			    this.$router.push({
				    path: this.$router.currentRoute.path,
				    query: {
				        id : node.id
				    }
				});
			    this.clearState();
			} else {
                            let currentFormId = this.$store.state.form.currentFormId;
                            if(currentFormId != node.id) {
			        this.$store.commit("loadForm",node.id);
			        this.clearState();
			    }
			}
                    }
                    this.designOption.type = 'form';
                }
            },
            addState() {
                let me = this;
                let newState = this.$store.state.form.newState;
                this.$Modal.confirm({
                    title: '添加状态',
                    closable: true,
                    render: (h) => {
                        return h(AddState, {
                            props: {
                                stateInfo: newState
                            }
                        }, null);
                    },
                    onOk() {
                        // save current form state
                        me.$store.commit('addState');
                    },
                    onCancel() {
                        // cancel
                    }
                });
            },
	    clearState() {
	        this.$store.commit('setSelection', {
                    selectStateId: null
                });
                this.activeStateName = null;
                this.$store.commit('clearState');
	    },
            unselectState() {
	        this.clearState();
                this.designOption.type = 'form';
            },
            selectState(name) {
                // load state by name，then commit store
                let selectStateId = this.$store.state.form.selection.selectStateId;
                if(selectStateId != name) {
		    this.$store.commit('setSelection', {
			selectStateId: name
		    });
		    this.activeStateName = name;
		    this.$store.commit('loadState', name);
		}
                this.designOption.type = 'state';
            },
	    delState() {
	        this.$store.commit('delState');
	    },
            titleRender(source, index) {
                if (source) {
                    if (source.rowConfig) {
                        return '行【' + (index + 1) + '】'
                    } else if (source.columnConfig) {
                        return source.columnConfig.label || '列【' + (index + 1) + '】'
                    }
                }
                return 'none';
            },
            selectChange(nodes) {
                this.i++;
            },
            clickNode(node, pnode) {

                let option = {};
                if (node.rowConfig) {
                    option.selectType = 1;
                    option.selectRow = node;
                } else {
                    option.selectType = 2;
                    option.selectRow = pnode;
                    option.selectColumn = node;
                }

                this.$store.commit('setSelection', option);

            }
    },
    watch: {
        selectNode: {
            handler(newNodes, oldNodes) {
                    if (newNodes) {

                    }
                },
                deep: true
        },
	'$route.query.id'(id) {
	    if(id && this.$refs.formTree) {
	        this.$refs.formTree.select(id);
	    }
	 }

    }
}

</script>
