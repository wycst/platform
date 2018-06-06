<style>
</style>

<template>

<div class="ivu-tree">
    <ul class="ivu-tree-children" visible="visible">
        <template v-for='(child,index) in data'>
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

import axios from 'axios';
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
        dataType:{
            type:String,
            default : 'tree'
        },
        url : String,
        model: Array
    },
    data() {
        return {
            data : [],
            selectedNodes : []
        }
    },
    mounted() {

        if(this.model) {
             this.data.push(...this.model);
        } else if(this.url) {
             axios.get(this.url).then(res => {
                  if(this.dataType == 'raw') {
                      let rawData = res.data;
                      let nodeMap = {};
                      rawData.forEach(item => {
                          let id = item.id;
                          nodeMap[id] = item;
                      });
                      let nodeList = [];
                      rawData.forEach(item => {
                          let pid = item.pid;
                          if(nodeMap[pid]) {
                              let pnode = nodeMap[pid];
                              pnode[this.childrenKey] = pnode[this.childrenKey] || [];
                              pnode[this.childrenKey].push(item);
                          } else {
                              nodeList.push(item);
                          }
                      });
                      this.data.push(...nodeList);
                  } else {
                      this.data.push(...res.data);
                  }
             });
        } 
        this.$on('clickNode',this.clickNode);
        this.$emit('on-render');
    },
    mounted1() {
        this.$on('clickNode',this.clickNode);
        this.$emit('on-render');
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
         },
         model(m1,m2) {
             this.data.splice(0,this.data.length);
             this.data.push(...m1);
         }
    }
}

</script>
