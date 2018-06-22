<template>
        <DatePicker 
	   :id='elementId'
	   :size='size'
	   :readonly='readonly'
	   :value='currentValue' 
	   :type="type" 
	   :format="format"
	   transfer
           :placeholder="placeholder"
	   @on-change='change'/>
</template>
<script>

import FormBasic from '../form/FormBasic'
import {DatePicker} from 'iview'
export default 
{
       name : 'FormDatePicker',
       extends : DatePicker,
       mixins : [FormBasic],
       props : {
	   elementId : String
       },
       data() {
           return {
	   }
       },
       computed : {
       },
       methods : {
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
