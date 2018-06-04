<template>
	<div ref='accordion' class='accordion' :class="{'accordion-fit' : !multi && fit,'accordion-small' : size == 'small'}" :style="{height:fitHeight}">
	   
	    <template v-for='(item,i) in items'>
		    <div class="accordion-item">
			<div class="accordion-item-head">
			    {{item.title}}
			</div>
			<div class="accordion-item-extra">
			    <p>
			        <span @click='toggle(i,item)'>
				   <Icon class='toggle-arrow-icon' :class="{'toggle-arrow-icon-active': active.indexOf(i) > -1}" type='chevron-right'/>
				</span>
			    </p>
			</div>
			<div class="accordion-item-content" :style="{height:bodyHeight,overflow:'auto'}">
			    <DynamicRender :component='item.component'></DynamicRender>
			</div>
			                  
		    </div>
	    </template>
	</div>
</template>

<script>

import CollapseTransition from 'iview/src/components/base/collapse-transition';
import $ from 'jquery'
export default {
        name : 'Accordion',
        components : {
	    CollapseTransition
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
	    items : Array,
	    height: [Number,String],
            size  : {
	        type : String,
		default : 'small'
	    }
	},
	data () {
	    return {
		active : [0]
            }  
	},
	mounted () { 
	   // console.log(this.$refs);
	   // this.accordionHeight = this.$refs.accordion.getBoundingClientRect().height ;
	   let mutli = this.mutli;
	   let fit = this.fit;
	   let len = this.items.length;
	   let accordion = this.$refs.accordion;
	   if(this.animate) {
	       $('.accordion-item-head').click(function() {
                    if(!mutli) {
                        let currentItem = $(this).parent();
                        let prevActive = currentItem.siblings('.accordion-item-active');
                        prevActive.find('.accordion-item-content').slideUp(200,function() {
			    prevActive.removeClass('accordion-item-active');
			});
			if(!currentItem.hasClass('accordion-item-active')) {
			    currentItem.addClass('accordion-item-active').find('.accordion-item-content').slideToggle(0).slideDown(500);
			} else {
			    currentItem.find('.accordion-item-content').slideToggle(0).slideUp(200);
			    currentItem.removeClass('accordion-item-active')
			}
		    }
	       });
	   }
	},
	computed : {
	   activeItemHeight () {
	      let headerHeight = this.size == 'small' ? 35 : 43;
	      let length = this.items.length;
	      return !this.multi && this.fit ? 'calc(100% - ' + headerHeight * (length - 1) + 'px)' : 'auto';
	   },
	   bodyHeight () {
	      let headerHeight = this.size == 'small' ? 35 : 43;
	      return !this.multi && this.fit ? 'calc(100% - '+headerHeight+'px)' : 'auto';
	   },
	   fitHeight() {
	      if(!this.multi && this.fit) {
	          let headerHeight = this.items.length * (this.size == 'small' ? 35 : 43);
		  return this.active.length == 0 ? headerHeight + 'px' : '100%'
	      } else {
	          return this.height ? this.height + 'px' : 'auto';
	      }
	   }
	},
	methods : {
	   toggle(i,item) {

              this.animate = false;

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

              if(this.animate) {
	          // 如果开启动画，放弃数据绑定，使用js实现显示和隐藏
                  

	      } else {
	          
	      }


	      // 传播事件
              this.$emit('item-click',i,item);
	   }
	},
	updated () {
	},
        watch : {
	   'active' : {
	       handler(v) {
	          this.$emit('change',v);
	       }
	   }
	
	}
}
</script>
<style>
.accordion {
   background-color: #f7f7f7;
   border-radius: 3px;
   border: 1px solid #dddee1;
}
.accordion-fit {
   overflow : hidden;
}

.accordion-fit.accordion-small>.accordion-item-active .accordion-item-content {
   height : calc(100% - 35px);
}

.accordion-fit>.accordion-item-active .accordion-item-content {
   height : calc(100% - 43px);
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
    padding: 15px;
    background-color: #fff;
    display : none;
}

.accordion-item-active .accordion-item-content {
    display : block;
}

.accordion-small>.accordion-item .accordion-item-head {
    padding: 10px 12px;
}
.accordion-small>.accordion-item .accordion-item-extra {
    right: 12px;
    top: 10px;
}
.accordion-small>.accordion-item .accordion-item-content {
    padding: 12px;
}

.toggle-arrow-icon {
    transition: transform .3s;
}

.toggle-arrow-icon.toggle-arrow-icon-active {
    transform: rotate(90deg);
}

</style>