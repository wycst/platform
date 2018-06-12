<template>
    <Select :value="currentValue" :disabled='disabled || readonly' :size='size' :filterable='filterable' transfer @on-change='change'>
        <Option v-for="option in optionList" :value="option.key" :key="option.key">{{ option.label }}</Option>
    </Select>
</template>
<script>
    import {Select} from 'iview'
    import axios from 'axios'
    import StringUtil from '@/components/utils/StringUtil'
    import FormBasic from '@/components/form/FormBasic'
    export default {
        name : 'FormComboSelect',
	extends : Select,
        mixins : [FormBasic],
	props : {
	   readonly : Boolean,
           mode : String,
           url  : String,
           params : String,
	   labelKey : {
	       type : String,
	       default : 'label'
	   },
	   valueKey : {
	       type : String,
	       default : 'key'
	   },
	   data  : Array
	},
	mounted() {

	   if(this.value) {
	      // if default value initing v-model value
	      this.$emit('input', this.value);
	   } 

           if(this.mode == 'remote') {
	      // if remote get optionList by ajax
          
              // 解析this.params的变量
              let params = this.params;
	      if(params) {
	          params = StringUtil.template(this.params,this.formModel);
	      }

              axios.post(this.url,params).then(res => {
		   let arr = res.data;
	           if(arr && (arr instanceof Array)) {
			arr.forEach(obj => {
			   this.optionList.push({
			       key : obj[this.valueKey],
			       label : obj[this.labelKey]
			   });
			});
		   } else {
		        throw new Error(' Response Error ');
		   }	
		}).catch(error => {
			this.$Message.error(' Request Error URL['+this.url+'],msg:' + error);
		   });
	   }

	},
	methods : {
	   change(value) {
	      this.$emit('on-change',value);
	      this.$emit('input', value);
	   }
	},
        data () {
            return {
	       optionList : this.data || []
	    }
        }
    }
</script>