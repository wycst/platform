<template>
<Card ref="mainCard">
     <p slot="title">
        <Icon type="ios-flower"></Icon>
	表单设计
     </p>   
     <p slot="extra">
	      <Button type="ghost" icon="checkmark" @click='preview'>预览</Button>
              <Button type="ghost" icon="checkmark" @click='addRow'>增加一行</Button>
	      <Button type="ghost" icon="checkmark" @click='deleteRow'>删除一行</Button>
	      <Button type="ghost" icon="checkmark">保存</Button>
     </p>   

     <div :style="{height:(clientHeight - 20 )+'px',width :'100%',background : 'white',overflow : 'auto'}">
	   <BorderLayout ref='bl' :regions='regions'>
	   </BorderLayout>
     </div>

</Card>

</template>


<script>

import $ from 'jquery'
import 'jqueryui'

import BorderLayout from '@/components/layout/BorderLayout.vue'

import FormMenu from '@/views/form/design/FormMenu.vue'
import FormSetting from '@/views/form/design/FormSetting.vue'
import FormEdit from '@/views/form/FormEdit.vue'

//document.title = '表单';

export default {
        name : 'form-design',
	components : {
	   BorderLayout
	},
	data () {
		 return {
		    offsetTop : 0,
		    rows : [],
		    regions : {
		        west : {
			    title : '导航',
			    width : 220,
			    component : FormMenu
			},
			east : {
			    title : '设置',
			    width : 320,
			    component : FormSetting
			},
			south1 : {
			    title : 'version',
			    height : 120,
			    component : FormSetting
			},
			center : {
			    title : '设计',
			    component : FormEdit
			}
		    }
		 }  
	},
	mounted () {
	   this.offsetTop = this.$refs.mainCard.$el.getBoundingClientRect().top ;
	},
	computed : {
	   clientHeight () {
	       return this.$store.state.common.documentBodyClientHeight - 70 - this.offsetTop ;
	   }
	},
	methods : {
	   addRow() {
	       this.$refs.bl.$regions.center.addRow();
	   },
	   deleteRow() {
	       this.$refs.bl.$regions.center.deleteRow();
	   },
           preview() {

	   }
	}
}

</script>