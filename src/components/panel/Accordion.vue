<template>
	<div ref='accordion' class='accordion' :class="{'accordion-fit' : !multi && fit,'accordion-small' : size == 'small'}" :style="{height:this.fitHeight,minHeight : items.length * headerHeight + 'px'}">
            <template v-for='(item,i,j) in items'>
	        <AccordionPanel :that='j = {target : null}' :title='item.title' :active='item.active'>
		     <DynamicRender v-if='item.component' :component='item.component'></DynamicRender>
		     <DynamicRender v-if='item.items' :model="{type : 'Accordion',props : {fit:fit,size:size,items:item.items,that:j}}"></DynamicRender>
	        </AccordionPanel>
	    </template>
            <slot></slot>
	</div>
</template>

<script>

//import CollapseTransition from 'iview/src/components/base/collapse-transition';
import Vue from 'vue'
import AccordionPanel from '@/components/panel/AccordionPanel'
Vue.component('AccordionPanel',AccordionPanel)

export default {
        name : 'Accordion',
	props : {
	    icon  : String,
	    title : String,
	    fit   : Boolean,
	    multi : Boolean,
	    animate : {
	        type : Boolean,
		default : true
	    },
	    items : {
	        type : Array,
		default : function() {
		   return [];
		}
	    },
	    height: [Number,String],
	    that : {
	       type : Object,
	       default : function() {
		   return {};
	       }
	    },
            size  : {
	        type : String,
		default : 'small'
	    }
	},
	data () {
	    return {
	        accordionEl : null,
		accordionHeight : 0,
		active : [],
		itemSize : 0
            }  
	},
	created() {
	   this.init();
	},
	mounted () { 
	   this.accordionEl = this.$refs.accordion;
	   this.bindEvents();
	   this.delayResize();
	},
	computed : {
	   fitHeight() {
	      if(this.height) {
	          return this.height + 'px';
	      }
	      if(!this.multi && this.fit) {
	          return '100%'
	      } else {
	          return 'auto';
	      }
	   },
	   itemHeight() {
              if(this.multi || !this.fit) {
	           return 'auto';
	      }
              if(this.animate) {
		   return this.accordionHeight - (this.itemSize - 1) * this.headerHeight;
	      } else {
	           return 'calc(100% - '+(this.itemSize - 1) * this.headerHeight+'px)';
	      }
	   },
	   contentHeight() {
	      // 页面高度固定的情况，此计算属性只会计算2次，第一次初始化accordionHeight = 0，第二次获取容器面板的高度（此后如果不触发resize,accordionHeight不会改变） 
	      // 如果是子面板又嵌套的手风琴，由于未激活子面板的内容高度都是0（先执行子节点先计算属性），被嵌套的手风琴容器面板的高度永远是0(子手风琴accordionHeight得不到变更)
              // 延时触发事件resize-h，进行变更子容器面板的accordionHeight
	      if(this.multi || !this.fit) {
	           return 'auto';
	      }
	      if(this.animate) {
                   if(this.accordionHeight == 0) {
		       return '0px';
		   }
		   // 延时
		   setTimeout(()=>{
		      this.$eventTarget.$emit('resize-h');
		   },200);
		   return (this.accordionHeight - this.itemSize * this.headerHeight) + 'px';
	      } else {
	           return 'calc(100% - ' + this.headerHeight + 'px)';
	      }
	   },
	   headerHeight() {
	      return this.size == 'small' ? 35 : 43;
	   } 
	},
	methods : {
	   init() {
	        // 如果当前vm时嵌套在AccordionPanel中的，设置AccordionPanel的childAccordion
		let parentTagName = this.$parent.$options.name;
		if(parentTagName == 'AccordionPanel') {
		     this.$parent.childAccordion = this;
		} else if(parentTagName == 'DynamicRender'){ 
                     let target = this.that.target;
                     if(target && target.$options.name == 'AccordionPanel') {
			this.that.target.childAccordion = this;
		     }
		}
	        this.active.length = 0;
	   },
	   bindEvents() {
	      this.$eventTarget.$on('resize-h',this.resize);
	      if(this.fit) {
	          window.addEventListener('resize',this.delayResize);	
	      }
	   },
	   unbindEvents() {
              this.$eventTarget.$off('resize-h', this.resize);
              window.removeEventListener('resize',this.delayResize);	
	   },
	   resize() {
	      this.accordionHeight = this.accordionEl.getBoundingClientRect().height;
	   },
	   delayResize(delay) {
	      setTimeout(()=>{
		 this.resize();
	      },delay || 0);
	   }
	},
	beforeDestroy: function () {
	    this.unbindEvents();
	},
        watch : {
	   'active' : {
	       handler(v) {
	          this.$emit('change',v);
	       }
	   },
	   'accordionHeight' : {
	       handler(v,v1) {
	          if(v1 != 0) {
		     this.$emit('resize',v);
		  }
	       }
	   }
	}
}
</script>
<style>
.accordion {
   background-color: #fff;
  // background-color: red;
   border-radius: 3px;
   border: 1px solid #dddee1;
   overflow : auto;
}
.accordion.accordion-fit {
   overflow : hidden;
}

.accordion-item-content-outer {
   height : 0px;
}
.accordion-item-active .accordion-item-content-outer{
   height : auto;
}

.accordion-item-content-outer .accordion-item-content{
   display : none;
}
.accordion-item-active .accordion-item-content-outer .accordion-item-content{
   display : block;
}

.accordion-item-content-outer-animate {
   transition:height .4s;
} 

.accordion-item {
   position:relative;
}
.accordion>.accordion-item {
   border-top: 1px solid #dddee1;
}

.accordion>.accordion-item:first-child {
   border-top: 0;
}
.accordion-item-head {
    background-color: #f7f7f7;
    padding: 14px 16px;
    cursor: pointer;
    line-height: 1;
}
.accordion-item-extra {
    position: absolute;
    right: 16px;
    top: 14px;
}

.accordion-item-content {
    color: #495060;
    background-color: #fff;
    padding: 15px;
    height : 100%;
}

.accordion-small>.accordion-item .accordion-item-head {
    padding: 10px 12px;
}
.accordion-small>.accordion-item .accordion-item-extra {
    right: 12px;
    top: 10px;
}
.accordion-small>.accordion-item .accordion-item-content {
    padding: 11px;
}

.toggle-arrow-icon {
    transition: transform 0.4s;
    cursor: pointer;
}

.toggle-arrow-icon.toggle-arrow-icon-active {
    transform: rotate(90deg);
}

</style>