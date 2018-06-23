<template>
   <i-switch 
       :value='currentValue' 
       :size="size" 
       @on-change='change'>
	<span slot="open">{{openLabel}}</span>
	<span slot="close">{{closeLabel}}</span>
   </i-switch>
</template>
<script>

import FormBasic from '../form/FormBasic'
import {Switch} from 'iview'

export default 
{
       name : 'FormSwitch',
       extends : Switch,
       mixins : [FormBasic],
       props : {
	   elementId : String,
	   openLabel : {
	       type : String,
	       default : '开',
	   },
	   closeLabel : {
	       type : String,
	       default : '关',
	   }
       },
       data() {
           return {
	   }
       },
       computed : {
       },
       methods : {
           setCurrentValue(val) {
	        val = !val ? false : true;
		if(this.currentValue != val) {
		    this.currentValue = val;
		}
	   },
	   change(value,type) {
	       this.currentValue = value;
	       this.$emit('on-change',value,type);
               this.$emit('input',value);
	   }
       },
       watch : {
       }
}
</script>
