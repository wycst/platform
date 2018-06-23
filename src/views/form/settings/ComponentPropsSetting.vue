<template>
    <Form class='settingForm' ref="componentProps" :model="componentProps" :label-width="100">
        
	<FormItem label="尺寸" prop="size">
            <Select v-model="componentProps.size" placeholder="">
                <Option value="default">default</Option>
                <Option value="small">small</Option>
                <Option value="large">large</Option>
            </Select>
        </FormItem>

        <FormItem label="默认值" prop="value">
             <template v-if="componentName == 'InputNumber' || componentName == 'FormNumberInput'">
	          <InputNumber v-model="componentProps.value"/>
	     </template>
	     <template v-else-if="componentName == 'FormSwitch'">
		  <i-switch v-model="componentProps.value"/>
			<span slot="open">开</span>
			<span slot="close">关</span>
		  </i-switch>
	     </template>
	     <template v-else-if="componentName == 'FormDatePicker'">
		  <DatePicker transfer v-model="componentProps.value"/></DatePicker>
	     </template>
             <template v-else>
	          <Input v-model="componentProps.value"/>
	     </template>
	</FormItem>

        <!--数字输入框配置-->
        <template v-if="componentName == 'FormNumberInput'">
	     <FormItem label="自适应宽度" prop="fitWidth">
		    <i-switch v-model="componentProps.fitWidth">
			<span slot="open">是</span>
			<span slot="close">否</span>
		    </i-switch>
	     </FormItem>
	</template>

        <!--普通文本输入框配置-->
        <template v-if="componentName == 'Input' || componentName == 'FormInput'">
	        <FormItem label="占位文本" prop="placeholder">
		    <Input v-model="componentProps.placeholder"/>
		</FormItem>
		<FormItem label="删除按钮" prop="clearable">
		    <i-switch v-model="componentProps.clearable">
			<span slot="open">是</span>
			<span slot="close">否</span>
		    </i-switch>
		</FormItem>
		<FormItem label="类型" prop="type">
		    <Select v-model="componentProps.type" transfer placeholder="">
			<Option value="text">text</Option>
			<Option value="password">password</Option>
			<Option value="textarea">textarea</Option>
			<Option value="url">url</Option>
			<Option value="email">email</Option>
			<Option value="date">date</Option>
		    </Select>
		</FormItem>
	</template>

        <!--日期组件配置-->
        <template v-if="componentName == 'FormDatePicker' || componentName == 'DatePicker'">
	        <FormItem label="是否可输入" prop="editable">
		    <i-switch v-model="componentProps.editable">
			<span slot="open">是</span>
			<span slot="close">否</span>
		    </i-switch>
		</FormItem>
		<FormItem label="格式" prop="format">
		    <Select v-model="componentProps.format" transfer placeholder="">
			<Option value="yyyy-MM-dd">yyyy-MM-dd</Option>
			<Option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</Option>
                        <Option value="yyyy-MM">yyyy-MM</Option>
			<Option value="yyyy/MM/dd">yyyy/MM/dd</Option>
			<Option value="yyyy/MM/dd HH:mm:ss">yyyy/MM/dd HH:mm:ss</Option>
                        <Option value="yyyy/MM">yyyy/MM</Option>
			<Option value="yyyy">yyyy</Option>
		    </Select>
		</FormItem>
		<FormItem label="类型" prop="type">
		    <Select v-model="componentProps.type" transfer placeholder="">
			<Option value="date">date</Option>
			<Option value="datetime">datetime</Option>
		    </Select>
		</FormItem>
	</template>

        <!--下拉选配置-->
	<template v-if="componentName == 'ComboSelect' || componentName == 'Select' || componentName == 'FormComboSelect'">
	        <FormItem label="是否可搜索" prop="filterable">
		    <i-switch v-model="componentProps.filterable">
			<span slot="open">是</span>
			<span slot="close">否</span>
		    </i-switch>
		</FormItem>
		<FormItem label="数据加载模式">
		    <RadioGroup v-model="componentProps.mode">
			<Radio label="local">本地</Radio>
			<Radio label="remote">远程</Radio>
		    </RadioGroup>
		</FormItem>
              
                <template v-if='componentProps.mode == "remote"'>
			<FormItem label="远程url" prop="url">
			    <Input v-model="componentProps.url"/>
			</FormItem>
			<FormItem label="url参数" prop="params">
			    <Input v-model="componentProps.params" />
			</FormItem>
			<FormItem label="valueKey" prop="valueKey">
			    <Input v-model="componentProps.valueKey"/>
			</FormItem>
			<FormItem label="labelKey" prop="labelKey">
			    <Input v-model="componentProps.labelKey"/>
			</FormItem>
		</template>
		<JsonStore v-if='componentProps.mode == "local"' dataType='Array' :props='["key","label"]' :data='componentProps.data || (componentProps.data = [])'></JsonStore>
	</template>
	
        <!--开关类组件配置-->
        <template v-if="componentName == 'FormSwitch'">
	        <FormItem label="label-开" prop="openLabel">
		    <Input v-model="componentProps.openLabel"/>
		</FormItem>
		<FormItem label="label-关" prop="closeLabel">
		    <Input v-model="componentProps.closeLabel"/>
		</FormItem>
	</template>

    </Form>
</template> 
<script>

    export default {
        name : 'ComponentPropsSetting',
	components : {
	},
	props : {
	    componentName : String,
            componentProps : {
	        type : Object,
		default : ()=> {
		    return {};
		}
	    }
	},
	created() {
	},
        data () {
            return {
                
            }
        },
        methods: {
           showResult() {
	       console.log(JSON.stringify(this.componentProps));
	   }
        },
	watch : {
	}
    }
</script>
<style>
body .ivu-modal .ivu-select-dropdown{
 // position: fixed !important;
}
</style>
