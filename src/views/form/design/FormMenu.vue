

<template>

<Accordion fit>
    <AccordionPanel title='表单目录' active>
        <Tree :data="data1"></Tree>
    </AccordionPanel>
    <AccordionPanel title='状态列表'>
        <ButtonGroup style='margin-bottom:5px;'>
            <Button type="ghost">添加</Button>
            <Button type="ghost">删除</Button>
            <Button type="ghost" @click='unSelectState'>取消选中</Button>
        </ButtonGroup>
        <Menu @on-select='selectState' width='auto'>
               <MenuItem name="3">
                   <Icon type="heart"></Icon>
                   拟稿
               </MenuItem>
               <MenuItem name="4">
                   <Icon type="heart-broken"></Icon>
                   审批
               </MenuItem>
               <MenuItem name="4">
                   <Icon type="heart-broken"></Icon>
                   归档
               </MenuItem>
        </Menu>
    </AccordionPanel>
    <AccordionPanel title='表单模型树'>
        <ModelTree :titleRender='titleRender' @on-node-click='clickNode' @on-select-change='selectChange' childrenKey='columns' :model='this.$store.state.form.form.rows'></ModelTree>
    </AccordionPanel>
</Accordion>

</template>

<script>

import ModelTree from '@/components/tree/ModelTree'

export default {
    components: {
        ModelTree
    },
    data() {
        return {
            i: 1,
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
        }

    },
    methods: {
        unSelectState() {
            this.$store.commit('setSelection',{
                 selectState : null
            });
	    this.$store.commit('clearState');
        },
        selectState() {
            // load state by id,then commit store
            this.$store.commit('setSelection',{
                 selectState : {
		 }
            });
	    this.$store.commit('mergeState');
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
        clickNode(node,pnode)  {

           let option = {};
           if(node.rowConfig) {
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
                if(newNodes) {

                }
            },
            deep: true
        }

    }
}

</script>
