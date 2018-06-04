<template>
        <InputNumber 
	   :id='elementId'
	   :size='size'
	   :value='currentValue'
	   :class='{"form-number-input-fitwidth" : fitWidth}'
           @on-blur='blur'
	   @on-change='change'
	   @input.native="handleInput"/>
</template>
<script>

import FormBasic from '../form/FormBasic'
import {InputNumber} from 'iview'
export default 
{
       name : 'FormInputNumber',
       extends : InputNumber,
       mixins : [FormBasic],
       props : {
           fitWidth : {
	       type : Boolean,
	       default : false
	   },
	   elementId : String
       },
       data() {
           return {
	      currentValue : Number.isNaN(Number(this.value)) ? 1 : Number(this.value)
	   }
       },
       computed : {
       },
       methods : {
           /*overwrite formbasic*/
           setCurrentValue(val) {
		if(this.currentValue != val) {
		    this.currentValue = Number.isNaN(Number(val)) ? value : Number(val);
		}
           },
           blur() {
	       this.$emit('on-blur',this.currentValue);
	   },
	   change(value) {
	       this.$emit('on-change',value);
	       this.$emit('input', value);
	   },
	   handleInput(e) {
	       let value = e.target.value;
	       this.setCurrentValue(value);
               this.$emit('input', this.currentValue);
	   }
       },
       watch : {
       
       }

}
</script>
<style>
.form-number-input-fitwidth {
     width : 100% !important; 
}
</style>
