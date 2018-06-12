<style scoped>
.title {
    margin-left : 5px;
}


</style>
<template>
<Card ref="mainCard">
     <p slot="title">
        <Icon :type="$store.state.form.currentFormId ? 'edit' : 'plus'"></Icon>
	<span class='title'>{{title}}</span>
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
		    design : null
		 }
	},
	created () {
	   this.design = new FormDesign();
	   this.$store.commit('initForm',this.design);
	   let id = this.$route.query.id;
	   if(id) {
	       this.$store.commit("loadForm",id);
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
	   save() {
	       let me = this;
	       this.$store.commit('saveForm',{
		   callback() {
		       // 重新加载tree或state
		       me.$eventTarget.$emit('on-refresh-formtree');
		       // 重新加载form
		       me.$store.commit("reloadForm");
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
	      let currentFormId = this.$store.state.form.currentFormId;
	      let query = {
	          formId : currentFormId
	      };
              if(this.$store.state.form.selection.selectStateId) {
	          query.stateId = this.$store.state.form.selection.selectStateId;
	      }
	      this.$router.push({
				    path: "/formpreview",
				    query: query
				});
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
		      this.$store.commit("loadForm",id);
		  } 
	      }
  }
}

</script>
