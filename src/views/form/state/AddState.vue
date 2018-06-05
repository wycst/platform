<template>
   <div style='margin:10px;padding:10px;'>
	     <Form class='settingForm' ref="stateInfo" :model="stateInfo" label-position="left" :label-width="65">
		 <FormItem label="状态名称" prop="name">
			<Input v-model="stateInfo.name"/>
		 </FormItem>
		 <FormItem label="状态编码" prop="code">
			<Input v-model="stateInfo.code"/>
		 </FormItem>
		 <FormItem label="状态描述" prop="description">
			<Input type='textarea' v-model="stateInfo.description"/>
		 </FormItem>
	    </Form>
   </div>
</template>

<script>
export default {
    name : 'AddState',
    props : {
        stateInfo : Object
    },
    data() {
        return {
	}
    }
}



</script>
