<template>
<Card ref='accordion' :class="{'accordion-small' : size == 'small','accordion' : true,'accordion-fit' : fit}">
     <p v-if='title != null' slot="title">
        <Icon v-if='icon != null' :type="icon"></Icon>
	{{title}} 
     </p>   
     <template slot="extra">
        <slot name='extra'></slot>
     </template>

     <div :style="{height: bodyHeight,background : 'white',overflow : 'auto'}">
	 <template v-for='panel in items'>
	     <PanelCard :title='panel.title' fit>
	          <DynamicRender :component='panel.component'></DynamicRender>
	     </PanelCard>
	 </template>
     </div>

</Card>
</template>

<script>

import PanelCard from '@/components/panel/PanelCard'
export default {
        name : 'Accordion',
        components : {
	    PanelCard
	},
	props : {
	    icon  : String,
	    title : String,
	    fit   : Boolean,
	    items : Array,
	    height: [Number,String],
            size  : {
	        type : String,
		default : 'small'
	    }
	},
	data () {
		 return {
		     accordionHeight : 0
		 }  
	},
	mounted () { 
	   console.log(this.items);
	   this.accordionHeight = this.$refs.accordion.$el.getBoundingClientRect().height ;
	},
	computed : {
	   bodyHeight () {
	      return this.fit ? '100%' : (this.height ? this.height + 'px' : 'auto');
	   }
	},
	methods : {
	  
	}
}
</script>
<style>
.accordion {
   overflow:hidden;
}
.accordion-small {
   border-radius: 2px
}
.accordion-small>.ivu-card-head{
   padding: 7px 8px;
}
.accordion-small>ivu-card-extra .ivu-btn {
   padding: 2px 7px;
   font-size: 12px;
   border-radius: 3px;
}
.accordion-small>.ivu-card-extra {
    position: absolute;
    right: 8px;
    top: 7px;
}
.accordion-small>.ivu-card-body {
    padding: 8px;
}
.accordion-fit>.ivu-card-body {
    height: calc(100% - 37px);
    height: -moz-calc(100% - 37px);
    height: -webkit-calc(100% - 37px);
}

</style>