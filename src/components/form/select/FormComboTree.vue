<template>
  
<div tabindex="0" class="ivu-select ivu-select-single ivu-select-default">
    <div class="ivu-select-selection">
        <input type="hidden">
        <span class="ivu-select-placeholder">
            请选择
        </span>
        <span class="ivu-select-selected-value" style="display: none;">
        </span>
        <!---->
        <i class="ivu-icon ivu-icon-ios-close ivu-select-arrow" style="display: none;">
        </i>
        <i class="ivu-icon ivu-icon-arrow-down-b ivu-select-arrow">
        </i>
    </div>
    <!---->
    <div class="ivu-select-dropdown" style="width: 200px; transform-origin: center bottom 0px; position: absolute; will-change: top, left; top: -174px; left: 20px;"
	x-placement="top">
	    <ul class="ivu-select-not-found" style="display: none;">
		<li>
		    无匹配数据
		</li>
	    </ul>
	    <ul class="ivu-select-dropdown-list">
		<li class="ivu-select-item">
		    New York
		</li>
		<li class="ivu-select-item">
		    London
		</li>
		<li class="ivu-select-item">
		    Sydney
		</li>
		<li class="ivu-select-item">
		    Ottawa
		</li>
		<li class="ivu-select-item">
		    Paris
		</li>
		<li class="ivu-select-item">
		    Canberra
		</li>
	    </ul>
	    <ul class="ivu-select-loading" style="display: none;">
		加载中
	    </ul>
	</div>
</div>

</template>
<script>
    import {Select} from 'iview'
    import axios from 'axios'
    import StringUtil from '@/components/utils/StringUtil'
    import FormBasic from '@/components/form/FormBasic'
    export default {
        name : 'FormComboTree',
	extends : Select,
        mixins : [FormBasic],
	props : {
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