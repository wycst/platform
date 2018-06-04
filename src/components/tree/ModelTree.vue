<style>
</style>

<template>

<div class="ivu-tree">
    <ul class="ivu-tree-children" visible="visible">
        <template v-for='(child,index) in model'>
            <ModelTreeNode :nodeIndex='index' :titleRender='titleRender' :titleKey='titleKey' :childrenKey='childrenKey' :data='child'></ModelTreeNode>
        </template>
    </ul>
    <!---->
</div>

</template>

<script>

import Vue from 'vue'
import ModelTreeNode from '../tree/ModelTreeNode'
Vue.component('ModelTreeNode', ModelTreeNode);

export default {
    name: 'ModelTree',
    props: {
        mutilSelect : Boolean,
        titleRender: Function,
        titleKey: {
            type: String,
            default: 'title'
        },
        childrenKey: {
            type: String,
            default: 'children'
        },
        model: Array
    },
    data() {
        return {
            selectedNodes : []
        }
    },
    created() {

    },
    mounted() {
        this.$on('clickNode',this.clickNode);
    },
    computed: {

    },
    methods: {
        clearSelectedNodes() {
           this.selectedNodes.forEach(node =>{
               node.selected = false;
           });
           this.selectedNodes.splice(0,this.selectedNodes.length);
        },
        clickNode(node,parentNode) {
           if(node.selected) {
                  if(!this.mutilSelect) {
                      this.clearSelectedNodes();
                      this.selectedNodes.push(node);
                  } else {
                      if(this.selectedNodes.indexOf(node) == -1) {
                          this.selectedNodes.push(node);
                      }
                  }
            } else {
                  if(!this.mutilSelect) {
                      this.clearSelectedNodes();
                  } else {
                      if(this.selectedNodes.indexOf(node) != -1) {
                          this.selectedNodes.splice(this.selectedNodes.indexOf(node),1);
                      }
                  }
            }

            // click node event
            this.$emit('on-node-click',node,parentNode);

        }
    },
    beforeDestroy: function() {
         this.$off('clickNode',this.clickNode);
    },
    watch: {
         selectedNodes : {
              handler(nodes) {
                  this.$emit('on-select-change',nodes);
              },
              deep : true
         }
    }
}

</script>
