<template>
    <Select :value="currentValue" :disabled='disabled' :size='size' :filterable='filterable' transfer @on-change='change'>
        <Option v-for="option in optionList" :value="option.key" :key="option.key">{{ option.label }}</Option>
    </Select>
</template>
<script>
    import {Select} from 'iview'
    import axios from 'axios'
    import StringUtil from '../utils/StringUtil'
    export default {
        name : 'ComboSelect',
	extends : Select,
	props : {
	   formModel : Object,
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
	   data  : Array,
	   value : [String,Number]
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
	   },
	   setCurrentValue(v) {
	       if(this.currentValue != v) {
	           this.currentValue = v;
	       }
	   }
	},
        data () {
            return {
	       currentValue: this.value,
	       optionList : this.data || []
	    }
        },
	watch : {
           value (val) {
                this.setCurrentValue(val);
           }
       }
    }
</script>