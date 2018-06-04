<template>
<div v-if='!removed' v-show='!hide' class="accordion-item" :class="{'accordion-item-active' : isActive}" :style="{'height' : isActive ? itemHeight : null}">
	<div class="accordion-item-head" @click='toggle'>
	    {{title}}
	</div>
	<div class="accordion-item-extra">
	    <p>
		<span @click='toggle'>
		   <Icon class='toggle-arrow-icon' :class="{'toggle-arrow-icon-active': isActive}" type='chevron-right'/>
		</span>
	    </p>
	</div>
        <!--css百分比高度动画使用有点问题，包一层div获取固定高度 -->
	<div class='accordion-item-content-outer' :class="{'accordion-item-content-outer-animate' : animate}" :style="{height : isActive ? contentHeight : '0px'}" style='overflow:hidden;'>
	     <div class="accordion-item-content" :style="{overflow:'auto'}">
		<slot></slot>
	     </div>
	</div>
</div>
</template>

<script>

export default {
        name : 'AccordionPanel',
        components : {
	},
	props : {
	    that : {
	       type : Object,
	       default : function() {
		   return {};
	       }
	    },
	    icon  : String,
	    title : String,
	    hide  : Boolean,
	    active : Boolean
	},
	data () {
	    return {
	        childAccordion : null,
	        animate  : false,
		multi    : false,
		removed  : false,
		itemIndex:-1
            }  
	},
	beforeCreate() {
	},
	created () {
	   let parentTagName = this.$parent.$options.name;
	   if(parentTagName == 'Accordion') {
	       this.itemIndex = this.$parent.itemSize++;
	       this.animate = this.$parent.animate;
	       this.multi = this.$parent.multi;

               this.that.target = this;
	   } else {
	       this.removed = true;
	       console.error('AccordionPanel should render by parent component[Accordion]');
	   }
	},
	mounted () { 
	    if(this.active) {
	         this.setActive();
	    }
	    if(this.hide) {
	         this.$parent.itemSize--;
	    }
	},
	beforeDestroy () {
	   if(this.itemIndex > -1) {
	       this.$parent.itemSize--;
	   }
	},
	computed : {
	   isActive () {
	      let actives = this.$parent.active;
              return actives.indexOf(this.itemIndex) > -1;
	   },
	   itemHeight() {
	      return this.$parent.itemHeight;
	   },
	   contentHeight() {
	      return this.$parent.contentHeight;
	   }
	},
	methods : {
	   setActive() {
	      let actives = this.$parent.active;
	      if(this.multi) {
	          if(actives.indexOf(this.itemIndex) == -1) {
		      actives.push(this.itemIndex);
		  }
	      } else {
		  actives.length = 0;
		  actives.push(this.itemIndex);
	      }
	   },
	   toggle() {
	      let actives = this.$parent.active;
              let activeOfIndex = actives.indexOf(this.itemIndex);
              if(activeOfIndex == -1) {
	          actives.push(this.itemIndex);
	      } else {
	          actives.splice(activeOfIndex,activeOfIndex + 1);
	      }
	      if(!this.$parent.multi && actives.length > 1) {
	          //  if not multi,close others
                  actives.shift();
	      }

              this.$parent.$emit('item-click',this.itemIndex,this);
	   }
	},
	watch : {
	   'isActive' : {
	       handler (v) {
	           if(v) {
		       // if active, 更新accordionHeight
		       if(this.childAccordion) {
			   this.childAccordion.delayResize();
		       }
		   }
	       }
	   },
	   'hide' : {
	       handler(v) {
                   if(v) {
		       this.$parent.itemSize--;
		   } else {
		       this.$parent.itemSize++;
		   }
	       }
	   },
	   'active' : {
	       handler(v) {
                   if(v) {
		       this.setActive();
		   } 
	       }
	   }
	}
}
</script>
<style>
</style>