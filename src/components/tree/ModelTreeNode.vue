<style>

.ivu-tree ul li {
    display : block;
    transition: height .2s;
}

</style>

<template>

<li :style='{height:cssHeight}'>
    <span class="ivu-tree-arrow" :class="{'ivu-tree-arrow-open' : expand}" @click='clickArrow'>
        <i v-if='children' class="ivu-icon ivu-icon-arrow-right-b">
        </i>
    </span>

    <span>
        <Icon :type="icon"></Icon>
    </span>

    <span class="ivu-tree-title" :class="{'ivu-tree-title-selected' : selected}" @click='clickNode' @dblclick='dblclickNode'>
        {{title}}
    </span>
    <ul v-show='children && expand' class="ivu-tree-children">
        <template v-for='(child,i) in children'>
            <ModelTreeNode :modelId='modelId' @on-expand='expandNode' :parentData='data' :nodeIndex='i' :titleRender='titleRender' :titleKey='titleKey' :childrenKey='childrenKey' :data='child'></ModelTreeNode>
        </template>
    </ul>
</li>

</template>

<script>
import emit from '@/components/mixins/emit';
export default {
    name: 'ModelTreeNode',
    mixins: [ emit ],
    props: {
        modelId : [String,Number],
        parentData : Object,
        nodeIndex: Number,
        titleRender: Function,
        titleKey: {
            type: String,
            default: 'title'
        },
        childrenKey: {
            type: String,
            default: 'children'
        },
        data: Object
    },
    data() {
        return {
            expand: false
        }
    },
    created() {
        this.expand = this.data.expand === true;
        let selected = this.data.selected;
        if(selected === undefined) {
            this.$set(this.data,'selected',false);
        }
    },
    mounted() {
        // 选择事件
        this.$eventTarget.$on(this.modelId + '-on-select',this.handleSelect);
    },
    computed: {
        cssHeight() {
            if(this.children && this.expand){
                 return 21 + 29 * this.children.length + 'px';
            } else {
                 return '21px';
            }
        },
        title() {
            if (this.titleRender) {
                return this.titleRender(this.data, this.nodeIndex);
            }
            return this.data ? this.data[this.titleKey] : '';
        },
        children() {
            return this.data ? this.data[this.childrenKey] : null;
        },
        selected() {
            return this.data['selected'];
        },
	icon() {
	    let icon = this.data['icon'];
            if(icon) {
	        return icon;
	    }
	    let isDir = this.data['type'] == 'dir' || (this.children && this.children.length > 0);
            icon = isDir ? 'folder' : 'document-text';
            return icon;
	}
    },
    methods: {
        clickArrow() {
            this.expand = !this.expand;
        },
        clickNode() {
            this.data['selected'] = !(this.data['selected'] === true);
            this.dispatch('ModelTree','clickNode',this.data,this.parentData);
        },
	dblclickNode() {
	    this.dispatch('ModelTree','dblclickNode',this.data,this.parentData);
	},
        expandNode() {
            this.expand = true;
            this.$emit('on-expand');
        },
	      handleSelect(id,selectedNodes) {
      	    if(this.data.id == id) {
        	        this.data['selected'] = 'selected';
        		      selectedNodes.push(this.data);
      	    }
    	}
    },
    beforeDestroy: function() {
        this.$off('on-expand',this.expand);
    },
    watch: {
        selected(t) {
           if(t) {
               // 展开当前节点的父节点,设置父组件的expand为true即可
               this.$emit('on-expand');
           }
        }
    }
}

</script>
