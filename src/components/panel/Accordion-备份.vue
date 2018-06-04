<template>
	<div ref='accordion' class='accordion' :class="{'accordion-fit' : !multi && fit,'accordion-small' : size == 'small'}" :style="{height:this.fitHeight,minHeight : items.length * headerHeight + 'px'}">
	   
	    <template v-for='(item,i) in items'>
		    <div class="accordion-item" :class="{'accordion-item-active' : active.indexOf(i) > -1}" :style="{'height' : active.indexOf(i) > -1 ? itemHeight : null}">
			<div class="accordion-item-head" @click='toggle(i,item)'>
			    {{item.title}}
			</div>
			<div class="accordion-item-extra">
			    <p>
			        <span @click='toggle(i,item)'>
				   <Icon class='toggle-arrow-icon' :class="{'toggle-arrow-icon-active': active.indexOf(i) > -1}" type='chevron-right'/>
				</span>
			    </p>
			</div>

                        <!--css百分比高度动画使用有点问题，包一层div获取固定高度 -->
                        <div class='accordion-item-content-outer' :class="{'accordion-item-content-outer-animate' : animate}" :style="{height : active.indexOf(i) > -1 ? contentHeight : '0px'}" style='overflow:hidden;'>
                             <div class="accordion-item-content" :style="{overflow:'auto'}">
				<DynamicRender :component='item.component'></DynamicRender>
			     </div>
			</div>
      
		    </div>
	    </template>

            <slot></slot>

	</div>
</template>

<script>

//import CollapseTransition from 'iview/src/components/base/collapse-transition';
export default {
        name : 'Accordion',
        components : {
	  //  CollapseTransition
	},
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

            // 这里做个反转设置，如果当前vm时嵌套在AccordionPanel中的，设置AccordionPanel的childAccordion
            let parentTagName = this.$parent.$options.name;
	    if(parentTagName == 'AccordionPanel') {
	        this.$parent.childAccordion = this;
	    } 

	    this.active.length = 0;
	    let initActives = [];
	    this.items.forEach((item,i) => {
		if(item.active === true) {
		    initActives.push(i);
		}
	    });
            if(initActives.length > 0) {
	        if(!this.multi) {
		    this.active.push(initActives[initActives.length-1]);
		} else {
		    this.active.push(...initActives);
		}
	    } else {
	        this.active.push(0);
	    }
	},
	beforeMount () {
	   // 解决标签下面配置的AccordionPanel
	   this.itemSize = this.items.length;
	},
	mounted () { 
	   this.accordionEl = this.$refs.accordion;
	   if(this.fit) {
	       window.addEventListener('resize',this.delayResize);	
	   }
	   this.bindEvents();
	   this.delayResize();
	},
	computed : {
	   fitHeight() {
	      if(this.height) {
	          return this.height + 'px';
	      }
	      if(!this.multi && this.fit) {
	         // let headerHeights = this.items.length * this.headerHeight;
		 // return this.active.length == 0 ? headerHeights  + 'px' : '100%'
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
	   toggle(i,item) {
              if(this.multi) {
	         let j = -1;
	         if((j = this.active.indexOf(i)) > -1) {
		     this.active.splice(j,j+1);
		 } else {
		     this.active.push(i);
		 }
	      } else {
                 if(this.active[0] != i) {
		     this.active.shift();
                     this.active.push(i);
		 } else {
		     this.active.shift();
		 }
	      }

	      // 传播事件
              this.$emit('item-click',i,item);
	   },
	   bindEvents() {
	      this.$eventTarget.$on('resize-h',this.resize);
	      // 如果出现嵌套时在子面板激活时触发
	      this.$on('open',this.open);
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
   background-color: red;
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