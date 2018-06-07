

<template>

<Accordion fit>
    <AccordionPanel title='表单目录' active>
        <ModelTree ref='formTree' titleKey='name' dataType='raw' :url='formTreeDataUrl' @on-load='afterTreeLoad' @on-node-click='selectForm'></ModelTree>
    </AccordionPanel>
    <AccordionPanel title='状态列表'>
        <ButtonGroup style='margin-bottom:5px;'>
            <Button type="ghost" @click='addState'>添加</Button>
            <Button type="ghost">删除</Button>
            <Button type="ghost" @click='unselectState'>取消选中</Button>
        </ButtonGroup>
        <Menu ref='stateMenu' :active-name='activeStateName' @on-select='selectState' width='auto'>
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
            stateList() {
                return this.$store.state.form.stateList;
            },
            formTreeDataUrl() {
                return this.$store.state.form.contextPath + this.$store.state.form.url.loadFormTree;
            }
    },
    updated() {
        this.$nextTick(()=> {
            this.$refs.stateMenu.updateActiveName(null);
        });
    },
    methods: {
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
                        this.$router.push({
                            path: '/formdesign',
                            query: {
                                id: node.id
                            }
                        });
                        this.unselectState();
                    }
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
                        // canel
                    }
                });
            },
            unselectState() {
                this.$store.commit('setSelection', {
                    selectStateId: null
                });
                this.activeStateName = null;
                this.$store.commit('clearState');
            },
            selectState(name) {
                // load state by name，then commit store
                this.$store.commit('setSelection', {
                    selectStateId: name
                });
                this.activeStateName = name;
                this.$store.commit('loadState', name);
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
        }

    }
}

</script>
