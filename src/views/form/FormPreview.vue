<template>
	<Card ref="card">
	     <p slot="title">
		<Icon type="ios-flower"></Icon>
		事件流程
	     </p>
	     <p slot="extra">
		 <Button type="ghost" icon="checkmark" @click="backEdit">返回编辑</Button>
	     </p>   
	     <div :style="{height:(clientHeight - 20 )+'px',width :'100%',background : 'white',overflow : 'auto',border : '0px solid gray'}">
		 <FormComponent formId='123'></FormComponent>
	     </div>
	</Card>
</template>

<script>

import FormComponent from '@/components/form/FormComponent'
// document.title = '表单预览';
export default {
        name : 'form-preview',
	components : {
	    FormComponent
	},
	data () {
		 return {
		    offsetTop : 0,
		    t : 2,
		    rows : [{
		    },{
		    }]
		 }  
	},
	mounted () {
	   this.offsetTop = this.$refs.card.$el.getBoundingClientRect().top ;
	},
	computed : {
	   clientHeight () {
	       return this.$store.state.common.documentBodyClientHeight - 70 - this.offsetTop ;
	   }
	},
	methods : {
	   backEdit() {
	       this.$router.push("/formdesign");
	   }
	}
}

</script>