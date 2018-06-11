<style>
</style>

<template>

<div class="ivu-tree">
    <ul class="ivu-tree-children" visible="visible">
        <template v-for='(child,index) in data'>
            <ModelTreeNode :modelId='modelId' :nodeIndex='index' :titleRender='titleRender' :titleKey='titleKey' :childrenKey='childrenKey' :data='child'></ModelTreeNode>
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
	    remote : false,
	    modelId : this._uid,
            selectedNodes : []
        }
    },
    mounted() {
        if(this.model) {
             this.data.push(...this.model);
        } else if(this.url) {
	     this.remote = true;
             this.load();
        } 
	// child后代组件继承emitter后直接dispatch会触发
        this.$on('clickNode',this.clickNode);
	this.$on('dblclickNode',this.dblclickNode);
        this.$emit('on-render');
    },
    computed: {
    },
    methods: {
        load() {
	   if(this.url && this.remote) {
	       this.data.splice(0,this.data.length);
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
		  this.$emit('on-load',this,this.data);
	     });
	   }
	},
	reload() {
	   this.load();
	},
        select(select) {
	   this.clearSelectedNodes();
	   if(typeof select == 'object') {
               this.selectedNodes.push(select);
	   } else {
	       // how to get the selected by id
	       if(select) {
	           let id = select;
		   setTimeout(()=> {
		       this.$eventTarget.$emit(this.modelId + '-on-select',id,this.selectedNodes);
		   },0);
	       }
	   }
	},
        clearSelectedNodes() {
           this.selectedNodes.forEach(node =>{
               node.selected = false;
           });
           this.selectedNodes.splice(0,this.selectedNodes.length);
        },
	dblclickNode(node,parentNode) {
	   this.$emit('on-node-dblclick',node,parentNode);
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
