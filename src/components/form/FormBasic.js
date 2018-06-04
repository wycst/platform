export default {
    name : 'FormBasic',
    props : {
		formModel:Object,
	    formItemKey : String,
		value : [String,Number]
	},
	methods : {
	    setCurrentValue(val) {
		    if(this.currentValue != val) {
			    this.currentValue = val;
			}
		}
	},
	data() {
	    return {
		   currentValue : this.value
		}
	},
	watch : {
	    value(val) {
		    this.setCurrentValue(val);
		}	
    }
}