<template>
	  <div class="ivu-input-wrapper ivu-input-type">
		   <i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i> 
		   <input :value='currentValue' @input="handleInput" :id='elementId' autocomplete="off" spellcheck="false" :type="type" placeholder="" number="true" class="ivu-input" @blur='blur' @change='change'/> 
	  </div>
</template>
<script>
export default 
{
       name : 'H5Input',
       props : {
           value : [String, Number],
           type : String,
	   elementId : String
       },
       data() {
           return {
               currentValue: this.value
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
	   setCurrentValue(v) {
	       if(this.currentValue != v) {
	           this.currentValue = v;
	       }
	   },
	   handleInput(event) {
	        let value = event.target.value;
                if (this.type == 'number') value = Number.isNaN(Number(value)) ? value : Number(value);
                this.$emit('input', value);
                this.setCurrentValue(value);
                this.$emit('on-change', event);
	   }
       },
       watch : {
           value (val) {
                this.setCurrentValue(val);
           }
       }

}
</script>
