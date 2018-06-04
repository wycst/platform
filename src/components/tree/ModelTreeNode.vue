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
    <span class="ivu-tree-title" :class="{'ivu-tree-title-selected' : selected}" @click='clickNode'>
        {{title}}
    </span>
    <ul v-show='children && expand' class="ivu-tree-children">
        <template v-for='(child,i) in children'>
            <ModelTreeNode @on-expand='expandNode' :parentData='data' :nodeIndex='i' :titleRender='titleRender' :titleKey='titleKey' :childrenKey='childrenKey' :data='child'></ModelTreeNode>
        </template>
    </ul>
</li>

</template>

<script>
import Emitter from 'iview/src/mixins/emitter';
export default {
    name: 'ModelTreeNode',
    mixins: [ Emitter ],
    props: {
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
        expandNode() {
            this.expand = true;
            this.$emit('on-expand');
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
