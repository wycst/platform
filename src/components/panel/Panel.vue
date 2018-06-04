<template>
<Card ref='panel' :class="{'panel-small' : size == 'small','panel' : true,'panel-fit' : fit}">
     <p v-if='title != null' slot="title">
        <Icon v-if='icon != null' :type="icon"></Icon>
	{{title}}
     </p>   
     <template slot="extra">
        <slot name='extra'></slot>
     </template>

     <div :style="{height: bodyHeight,background : 'white',overflow : 'auto'}">
         <slot></slot>
     </div>
</Card>
</template>

<script>
export default {
        name : 'Panel',
	props : {
	    icon  : String,
	    title : String,
	    fit   : Boolean,
	    height: [Number,String],
            size  : {
	        type : String,
		default : 'small'
	    }
	},
	data () {
		 return {
		     panelHeight : 0
		 }  
	},
	mounted () {
	   this.panelHeight = this.$refs.panel.$el.getBoundingClientRect().height ;
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
.panel {
   overflow:hidden;
}
.panel-small {
   border-radius: 2px
}
.panel-small>.ivu-card-head{
   padding: 7px 8px;
}
.panel-small>ivu-card-extra .ivu-btn {
   padding: 2px 7px;
   font-size: 12px;
   border-radius: 3px;
}
.panel-small>.ivu-card-extra {
    position: absolute;
    right: 8px;
    top: 7px;
}
.panel-small>.ivu-card-body {
    padding: 8px;
}
.panel-fit>.ivu-card-body {
    height: calc(100% - 37px);
    height: -moz-calc(100% - 37px);
    height: -webkit-calc(100% - 37px);
}

</style>