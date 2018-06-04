<style>

.settingForm .ivu-form-item {
    margin-bottom: 5px;
}

.item-row {
    text-align : right;
}

</style>

<template>

<Accordion fit>
    <AccordionPanel title='状态信息' active>
        <Form class='settingForm' :model="baseProps" :label-width="100">
            <FormItem label="状态名称" prop="name">
                <Input v-model='baseProps.name' />
            </FormItem>
            <FormItem label="状态编码" prop="code">
                <Input v-model='baseProps.code' />
            </FormItem>
            <FormItem label="状态描述" prop="description">
                <Input v-model='baseProps.description' />
            </FormItem>
        </Form>
    </AccordionPanel>
    <AccordionPanel title='全局状态'>
        <Form class='settingForm' :model="global" :label-width="100">
            <FormItem label="默认渲染" prop="render">
                <Checkbox v-model="global.render"></Checkbox>
            </FormItem>
            <FormItem label="默认隐藏" prop="hide">
                <Checkbox v-model="global.hide"></Checkbox>
            </FormItem>
            <FormItem label="默认只读" prop="readonly">
                <Checkbox v-model="global.readonly"></Checkbox>
            </FormItem>
        </Form>
    </AccordionPanel>
    <AccordionPanel title='组件状态'>
       
       <Row class='item-row'>
           <Col span='2'>
	        <span style='display:block;'>&nbsp;</span>
	   </Col>
	   <Col span='7' style='text-align : left'>
	        目标
	   </Col>
	   <Col span='5'>
	        渲染
		<Checkbox @on-change='renderAll'/>
	   </Col>
	   <Col span='5'>
	        隐藏
		<Checkbox @on-change='hideAll'/>
	   </Col>
	   <Col span='5'>
	        只读
		<Checkbox @on-change='readonlyAll'/>
	   </Col>
       </Row>
       <template v-for='(row,index) in rows'>
	   <StateRow :rowIndex='index' :rowObject='row' :stateObj='formState.elementsState[row.rowId] || (formState.elementsState[row.rowId] = {})'></StateRow>
       </template>      
    </AccordionPanel>
</Accordion>

</template>

<script>

import StateRow from '../design/StateRow'
export default {
    components: {
        StateRow
    },
    data() {
        return {
        }
    },
    methods: {
        hideAll(value) {
	   this.$eventTarget.$emit('hideAll',value);
	},
	renderAll(value) {
	   this.$eventTarget.$emit('renderAll',value);
	},
	readonlyAll(value) {
	   this.$eventTarget.$emit('readonlyAll',value);
	}
    },
    computed: {
        rows() {
	    return this.$store.state.form.form.rows;
	},
        baseProps() {
            return this.$store.state.form.formState.baseProps;
        },
        global() {
            return this.formState.global;
        },
	formState() {
	    return this.$store.state.form.formState;
	}
    },
    watch: {

    }
}

</script>
