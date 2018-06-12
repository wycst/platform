<template>
        <Input 
	   :id='elementId'
	   :size='size'
	   :readonly='readonly'
	   :value='currentValue' 
	   :type="type" 
           :placeholder="placeholder"
           @blur='blur'
	   @change='change'
	   @input="handleInput"/>
</template>
<script>

import FormBasic from '../form/FormBasic'
import {Input} from 'iview'
export default 
{
       name : 'FormInput',
       extends : Input,
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
           blur(e) {
	       this.$emit('on-blur',e.target.value);
	   },
	   change(e) {
	       this.$emit('on-change',e.target.value);
	   },
	   handleInput(value) {
                if (this.type == 'number') value = Number.isNaN(Number(value)) ? value : Number(value);
                this.setCurrentValue(value);
		this.$emit('input', value);
	   }
       },
       watch : {
       
       }

}
</script>
