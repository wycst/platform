<template>
    <div :id='elementId' class='layout-border'>
         <template v-if='westComponent != null'>
	     
	     <div class='layout-panel layout-border-west' :class="{'layout-collapse-west-animate' : westAnimate}" :style='{ width : westWidth + "px",marginLeft: marginLeft + "px", left : 0,top : top + "px",bottom : bottom + "px"}'>
		 <PanelCard :title='westTitle' fit :style='{height : "100%"}'>
		      <DynamicRender ref='west' :component='westComponent'></DynamicRender>
		 </PanelCard>
	     </div>
             
             <div class='layout-border-resize layout-border-resize-w' :class="{'layout-border-resize-w-cursor' : !westCollapsed,'layout-resize-west-animate' : westAnimate}" :style='{left: (westWidth + marginLeft) + "px",width: splitWidth + "px",top : top + "px",bottom : bottom + "px"}' @dblclick='westCollapse'>
		  <template v-if='this.westCollapsible'>
		      <div @click='westCollapse' style="position:absolute;cursor:pointer;height:10px;width:5px; top: 50%;transform: translateY(-50%);left: 0px;">
		          <Icon :type="westCollapsed ? 'arrow-right-b' : 'arrow-left-b'">
		          </Icon>
		      </div>
		  </template>
	     </div>

	 </template>

	 <template v-if='eastComponent != null'>
	     <div class='layout-panel layout-border-east' :class="{'layout-collapse-east-animate' : eastAnimate}" :style='{ width : eastWidth + "px",marginRight: marginRight + "px",right : 0,top : top + "px",bottom : bottom + "px"}'>
	          <PanelCard :title='eastTitle' fit :style='{height : "100%"}'>
		      <DynamicRender ref='east' :component='eastComponent'></DynamicRender>
		  </PanelCard>
	     </div>

             <div class='layout-border-resize layout-border-resize-e' :class="{'layout-border-resize-e-cursor' : !eastCollapsed,'layout-resize-east-animate' : eastAnimate}" :style='{right: (eastWidth + marginRight) + "px",width: splitWidth + "px",top : top + "px",bottom : bottom + "px"}' @dblclick='eastCollapse'>
		  <template v-if='this.eastCollapsible'>
		      <div @click='eastCollapse' style="position:absolute;cursor:pointer;height:10px;width:5px; top: 50%;transform: translateY(-50%);left: 0px;">
		          <Icon :type="!eastCollapsed ? 'arrow-right-b' : 'arrow-left-b'">
		          </Icon>
		      </div>
		  </template>
	     </div>
	 </template>

         <template>
	     <div class='layout-panel layout-border-center' :style='{ left : left + "px",right : right + "px",top : top + "px",bottom : bottom + "px",transition : transition}'>
		  <PanelCard :title='centerTitle' fit :style='{height : "100%"}'>
		      <DynamicRender ref='center' :component='centerComponent'></DynamicRender>
		  </PanelCard>
	     </div>
	 </template>

         <template v-if='northComponent != null'>
	     <div class='layout-panel layout-border-north' :class="{'layout-collapse-north-animate' : northAnimate}" :style='{ height : northHeight + "px",marginTop: marginTop + "px",top:0,right:0,left:0}'>
		  <PanelCard :title='northTitle' fit>
		      <DynamicRender ref='north' :component='northComponent'></DynamicRender>
		  </PanelCard>
	     </div>

             <div class='layout-border-resize layout-border-resize-n' :class="{'layout-border-resize-n-cursor' : !northCollapsed,'layout-resize-north-animate' : northAnimate}" :style='{top: (northHeight+marginTop) + "px",height: splitHeight + "px",left:0,right:0}'>
		  <template v-if='this.northCollapsible'>
		      <div @click='northCollapse' style="position:absolute;cursor:pointer;height:5px;width:10px; left: 50%;transform: translateX(-50%);top:-6px;">
		          <Icon :type="!northCollapsed ? 'arrow-down-b' : 'arrow-up-b'">
		          </Icon>
		      </div>
		  </template>
	     </div>
	 </template>

	 <template v-if='southComponent != null'>
	     <div class='layout-panel layout-border-north' :class="{'layout-collapse-south-animate' : southAnimate}" :style='{ height : southHeight + "px",marginBottom: marginBottom + "px",bottom:0,right:0,left:0}'>
		  <PanelCard :title='southTitle' fit :style='{height : "100%"}'>
		      <DynamicRender ref='south' :component='southComponent'></DynamicRender>
		  </PanelCard>
	     </div>

             <div class='layout-border-resize layout-border-resize-s' :class="{'layout-border-resize-s-cursor' : !southCollapsed,'layout-resize-south-animate' : southAnimate}" :style='{bottom: (southHeight+marginBottom) + "px",height: splitWidth + "px",left:0,right:0}'>
		  <template v-if='this.southCollapsible'>
		      <div @click='southCollapse' style="position:absolute;cursor:pointer;height:5px;width:10px; left: 50%;transform: translateX(-50%);top:-6px;">
		          <Icon :type="southCollapsed ? 'arrow-down-b' : 'arrow-up-b'">
		          </Icon>
		      </div>
		  </template>
	     </div>
	 </template>

    </div>
</template>

<script>

   import $ from 'jquery'
   import 'jqueryui'

   /*import Vue from 'vue'
   import VueResize from 'vue-resize'
   Vue.use(VueResize)*/

   import PanelCard from '@/components/panel/PanelCard'

   export default {
       name  : 'BorderLayout',
       components : {
           PanelCard
       },
       props : {
           name : String,
           regions : {
	      type:Object,
	      required:true
	   }
       },
       mounted () {
          // w和e拖动时top不变
          $('#' + this.elementId + ' .layout-border-resize-w').draggable({
	      	helper : "clone",
		containment : '.layout-border',
		zIndex : 10000,
		axis: "x",
		start : (event,ui) => {
		   ui.helper.removeClass('layout-resize-west-animate').html('');
		},
		stop : (event,ui) => {
		   this.westWidth = ui.position.left ;
		}
	  });
          $('#' + this.elementId + ' .layout-border-resize-e').draggable({
	      	helper : "clone",
		containment : '.layout-border',
		zIndex : 10000,
		axis: "x",
		start : (event,ui) => {
		   ui.helper.html('').removeClass('layout-resize-east-animate').data('oldLeft',ui.position.left);
		},
		stop : (event,ui) => {
		   let newLeft = ui.position.left ;
                   let oldLeft = ui.helper.data('oldLeft');
		   this.eastWidth = this.eastWidth - (newLeft - oldLeft);
		}
	  });

	  $('#' + this.elementId + ' .layout-border-resize-n').draggable({
	      	helper : "clone",
		containment : '.layout-border',
		zIndex : 10000,
		axis: "y",
		start : (event,ui) => {
		   ui.helper.removeClass('layout-resize-north-animate').html('');
		},
		stop : (event,ui) => {
		   this.northHeight = ui.position.top ;
		}
	  });

	  $('#' + this.elementId + ' .layout-border-resize-s').draggable({
	      	helper : "clone",
		containment : '.layout-border',
		zIndex : 10000,
		axis: "y",
		start : (event,ui) => {
		   ui.helper.removeClass('layout-resize-south-animate').html('').data('oldTop',ui.position.top);
		},
		stop : (event,ui) => {
		   let newTop = ui.position.top ;
                   let oldTop = ui.helper.data('oldTop');
		   this.southHeight = this.southHeight - (newTop - oldTop);
		}
	  });
          this.registerLayout();
       },
       created() {

          let regions = this.regions;
          if(regions) {
		  if(regions.west) {
		      this.westComponent = regions.west.component;
		      this.westWidth = regions.west.width || 200;
		      this.westTitle = regions.west.title;
		      this.westAnimate = regions.west.animate === false ? false : true;
		      if(regions.west.collapsed === true) {
		          this.marginLeft = -this.westWidth;
		      }
		      this.westCollapsed = regions.west.collapsed === true;
		  }

		  if(regions.east) {
		      this.eastComponent = regions.east.component;
		      this.eastWidth = regions.east.width || 200;
		      this.eastTitle = regions.east.title;
                      this.eastAnimate = regions.east.animate === false ? false : true;
		      if(regions.east.collapsed === true) {
		          this.marginRight = -this.eastWidth;
		      }
		      this.eastCollapsed = regions.east.collapsed === true;
		  }

		  if(regions.north) {
		      this.northComponent = regions.north.component;
		      this.northHeight = regions.north.height || 75;
		      this.northTitle = regions.north.title;
		      this.northAnimate = regions.north.animate === false ? false : true;
		  }

		  if(regions.south) {
		      this.southComponent = regions.south.component;
		      this.southHeight = regions.south.height || 75;
		      this.southTitle = regions.south.title;
		      this.southAnimate = regions.south.animate === false ? false : true;
		  }

		  this.centerComponent = regions.center.component;
		  this.centerTitle = regions.center.title;
	  }

       },
       computed : {
           splitWidth () {
	      return this.borderSize;
	   },
           splitHeight () {
	      return this.borderSize;
	   },
           left () {
	      return this.westComponent ? this.westWidth + this.borderSize + this.marginLeft : 0;
	   },
	   right() {
	      return this.eastComponent ? this.eastWidth + this.borderSize + this.marginRight : 0;
	   },
	   top() {
	      return this.northComponent ? this.northHeight + this.borderSize + this.marginTop : 0;
	   },
	   bottom () {
	      return this.southComponent ? this.southHeight + this.borderSize + this.marginBottom : 0;
	   },
	   transition() {
	      let animates = [];
              if(this.westAnimate) {
	          animates.push('left .35s');
	      }
	      if(this.eastAnimate) {
	          animates.push('right .35s');
	      }
	      if(this.northAnimate) {
	          animates.push('top .35s');
	      }
	      if(this.southAnimate) {
	          animates.push('bottom .35s');
	      }
	      return animates.join(',');
	   },
	   $regions() {
	      return {
	         west : this.$refs.rest && this.$refs.rest.$children[0],
		 east : this.$refs.east && this.$refs.east.$children[0],
		 center : this.$refs.center && this.$refs.center.$children[0],
		 north : this.$refs.north && this.$refs.north.$children[0],
                 south : this.$refs.south && this.$refs.south.$children[0]
	      }
	   }
       },
       data () {
          return {
	      
	       borderSize : 6,
               elementId:'layout-border-' + new Date().getTime(),

               westWidth: 0,
	       westAnimate : false,
               westCollapsible:true,
               westCollapsed:false,
               westResizable:true,
	       
	       eastWidth : 0,
	       eastAnimate : false,
               eastCollapsible:true,
               eastCollapsed:false,
               eastResizable:true,

               marginLeft   : 0,
	       marginRight  : 0,
	       marginTop    : 0,
	       marginBottom : 0,

               northHeight : 0,
	       northAnimate : false,
               northCollapsible:true,
               northCollapsed:false,
               northResizable:true,

	       southHeight : 0,
	       southAnimate : false,
               southCollapsible:true,
               southCollapsed:false,
               southResizable:true,

               centerTitle : null,
	       westTitle   : null,
	       northTitle  : null,
	       southTitle  : null,
               eastTitle   : null,

	       westComponent : null,
	       eastComponent : null,
	      northComponent : null,
	      southComponent : null
	  }
       },
       beforeDestroy() {
          
       },
       methods : {
          registerLayout() {
	      if(!this.$layouts.default) {
	          this.$layouts.default = this;
	      }
	      if(this.name) {
	          this.$layouts[this.name] = this;
	      }
	  },
          westCollapse (collapsed) {

              if(collapsed === true || collapsed === false) {
	          this.westCollapsed = collapsed
	      } else {
	           this.westCollapsed = !this.westCollapsed;
	      }
	      $('#' + this.elementId + ' .layout-border-resize-w').draggable(this.westCollapsed ? 'disable' : 'enable');
	  },
	  eastCollapse(collapsed) {
              if(collapsed === true || collapsed === false) {
	          this.eastCollapsed = collapsed
	      } else {
	          this.eastCollapsed = !this.eastCollapsed;
	      }
	      $('#' + this.elementId + ' .layout-border-resize-e').draggable(this.eastCollapsed ? 'disable' : 'enable');
	  },
	  northCollapse() {
	      this.northCollapsed = !this.northCollapsed;
	      $('#' + this.elementId + ' .layout-border-resize-n').draggable(this.northCollapsed ? 'disable' : 'enable');
	  },
	  southCollapse() {
	      this.southCollapsed = !this.southCollapsed;
	      $('#' + this.elementId + ' .layout-border-resize-s').draggable(this.southCollapsed ? 'disable' : 'enable');
	  },
	  broadcastResize(event,args) {
	      setTimeout(()=>{
	         this.$eventTarget.$emit(event,args);
	      },200);
	  }
       },
       watch : {
          'westCollapsed' : {
	      handler (value) {
	         if(value) {
		     this.marginLeft = -this.westWidth;
		 } else {
		     this.marginLeft = 0;
		 }
	      }
	  },
	  'eastCollapsed' : {
	      handler (value) {
	         if(value) {
		     this.marginRight = -this.eastWidth;
		 } else {
		     this.marginRight = 0;
		 }
	      }
	  },
	  'northCollapsed' : {
	      handler (value) {
	         if(value) {
		     this.marginTop = -this.northHeight;
		 } else {
		     this.marginTop = 0;
		 }
		 this.broadcastResize('resize-h');
	      }
	  },
	  'southCollapsed' : {
	      handler (value) {
	         if(value) {
		     this.marginBottom = -this.southHeight;
		 } else {
		     this.marginBottom = 0;
		 }
		 this.broadcastResize('resize-h');
	      }
	  },
	  'southHeight' : {
	      handler () {
	         this.broadcastResize('resize-h');
	      }
	  },
	  'northHeight' : {
	      handler () {
	         this.broadcastResize('resize-h');
	      }
	  },
	  'westWidth' : {
	      handler () {
	         this.broadcastResize('resize-w');
	      }
	  },
	  'eastWidth' : {
	      handler () {
	         this.broadcastResize('resize-w');
	      }
	  }
       }
   }
</script>

<style scoped>
.layout-border {
    width  : 100%;
    height : 100%;
    overflow: hidden; 
    position: relative;
}

.layout-panel {
    overflow: auto;
    position: absolute;
    border : 1px solid #BBB;
}
.layout-border-resize {
    overflow: hidden;
    background: #DDD;
    position: absolute;
}
.layout-border-resize-w,.layout-border-resize-e {
}

.layout-border>.layout-collapse-west-animate {
    transition:margin-left .35s,width .35s;
}
.layout-border>.layout-resize-west-animate{
    transition:left .35s,top .35s,bottom .35s;
}

.layout-border>.layout-collapse-east-animate {
    transition:margin-right .35s,width .35s;
}
.layout-border>.layout-resize-east-animate{
    transition:right .35s,top .35s,bottom .35s;
}

.layout-border>.layout-collapse-north-animate {
    transition:margin-top .35s,height .35s;
}
.layout-border>.layout-resize-north-animate{
    transition:top .35s;
}

.layout-border>.layout-collapse-south-animate {
    transition:margin-bottom .35s,height .35s;
}
.layout-border>.layout-resize-south-animate{
    transition:bottom .35s;
}

.layout-border-resize-w-cursor {
    cursor: w-resize;
}
.layout-border-resize-e-cursor {
    cursor: e-resize;
}
.layout-border-resize-n-cursor {
    cursor: n-resize;
}
.layout-border-resize-s-cursor {
    cursor: s-resize;
}


</style>