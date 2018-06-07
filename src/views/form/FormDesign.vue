<template>
<Card ref="mainCard">
     <p slot="title">
        <Icon :type="$route.query.id ? 'edit' : 'plus'"></Icon>
	{{title}}
     </p>
     <p slot="extra">
              <Button type="ghost" icon="checkmark" @click='save'>保存</Button>
	      <Button type="ghost" icon="checkmark" @click='preview'>预览</Button>
	      <Button type="ghost" icon="checkmark" @click='showJson'>查看json</Button>
              <Button type="ghost" icon="checkmark" @click='addRow'>增加一行</Button>
	      <Button type="ghost" icon="checkmark" @click='showHtml'>显示html</Button>
	      <Button type="ghost" icon="checkmark" @click='deleteRow'>删除一行</Button>
	      <Button type="ghost" icon="checkmark" @click='backHome'>返回首页</Button>
     </p>

     <div :style="{height:(clientHeight - 20 )+'px',background : 'white',overflow : 'auto'}">
	   <BorderLayout name='formdesign' ref='bl' :regions='regions'>
	   </BorderLayout>
     </div>

</Card>

</template>
<script>

import BorderLayout from '@/components/layout/BorderLayout.vue'
import FormDesign from './libs/formDesign'
export default {
        name : 'form-design',
	components : {
	   BorderLayout
	},
	data () {
		 return {
		    offsetTop : 0,
		    initForm : null,
		    design : null
		 }
	},
	created () {
           // let id = this.$route.query
	   this.design = new FormDesign();
	   this.initForm = this.design.form;
	   let id = this.$route.query.id;
	   this.$store.commit('initForm',this.design.form);
	   if(id) {
	       this.loadForm(id);
	   } 
	},
	destroyed() {
           this.design.destroyed();
	   this.design = null;
	   // this.$store.commit clearForm
	},
	mounted () {
	   this.offsetTop = this.$refs.mainCard.$el.getBoundingClientRect().top ;
	},
	computed : {
	   clientHeight () {
	       return this.$store.state.common.documentBodyClientHeight - 70 - this.offsetTop ;
	   },
	   regions() {
	       return this.$store.state.form.regions;
	   },
	   title() {
	       return this.design.form.baseProps.name;
	   }
	},
	methods : {
	     loadForm(id) {
		  // 查询表单数据
		  this.$store.commit("loadForm",{
		      id : id,
		      callback : (data)=> {
			    if(!data || data.length == 0) {
				 alert('不存在的表单');
			    } else {
				 let form = JSON.parse(data[0].form_source);
				 this.design.form = form;
				 this.$store.commit('setCurrentForm',form);
			    }
		      }
		   });
	     },
	   save() {
	       let me = this;
	       this.$store.commit('saveForm',{
	           id : this.$route.query.id,
		   callback(type) {
		       // 重新加载tree或state
		       if(type == 1) {
		           me.$eventTarget.$emit('on-refresh-formtree');
		       } 
		       // 重新加载form
		       me.loadForm(me.$route.query.id);
		   }
	       });
	   },
	   showJson() {
	       console.log(JSON.stringify(this.design.form,0,4));
	   },
	   addRow() {
               this.design.addFormItemRow();
	   },
	   showHtml() {
               this.$refs.bl.$regions.center.getFormHtml();
	   },
	   deleteRow() {
	       this.$refs.bl.$regions.center.deleteRow();
	   },
           preview() {
              this.$router.push("/formpreview");
	   },
	   backHome () {
	      this.$router.push("/home");
	   },
	   showSetting() {
	      this.$refs.bl.eastCollapsed = false;
	   }
	},
	watch : {
	      '$route.query.id'(id) {
		  if(id) {
		      this.loadForm(id);
		  } else {
		     // this.design.form = JSON.parse(JSON.stringify(this.initForm));
		     // this.$store.commit('setCurrentForm',this.design.form);
		  }
	      }
  }
}

</script>
