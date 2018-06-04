<style>
.state-row {
   //transition: height .2s;
}
.state-row .item-row {
   padding : 2px;
   margin : 2px;
}

.state-row-arrow-expand {
   transform: rotate(90deg);
}
.state-row .ivu-icon-ios-arrow-right {
   transition: all .2s ease-in-out;
   cursor : pointer;
}

</style>
<template>
    <div class='state-row' :style1='{height:cssHeight}'>

	<Form :model="rowObject.state">
		<Row class='item-row' :class="{'ivu-tree-title-selected' : rowObject.selected}">
		    <Col span='2' style='text-align : left;'>
			<span @click='toggleExpand'>
			    <Icon type='ios-arrow-right' :class='{"state-row-arrow-expand" : expand}'/>
			</span>
		    </Col>
		    <Col span='7' style='text-align : left'>
			{{'第【' + (rowIndex + 1) + '】行'}}
		    </Col>
		    <Col span='5'>
			<Checkbox v-model='rowObject.state.render'/>
		    </Col>
		    <Col span='5'>
			<Checkbox v-model='rowObject.state.hide'/>
		    </Col>
		    <Col span='5'>
			<Checkbox v-model='rowObject.state.readonly'/>
		    </Col>
		</Row>
	</Form>

	<template v-for='(column,index) in rowObject.columns'>
	    <Form :model="column.state">
		    <Row v-if='expand' class='item-row' :class="{'ivu-tree-title-selected' : column.selected}">
			<Col span='2'>
			    <span style='display:block;'>
				&nbsp;
			    </span>
			</Col>
			<Col span='7' style='text-align : left'>
           <span style="padding-left:15px;">
			    {{column.columnConfig.label || '列' + index}}
           </span>
			</Col>
			<Col span='5'>
			    <Checkbox v-model='column.state.render'/>
			</Col>
			<Col span='5'>
			    <Checkbox v-model='column.state.hide'/>
			</Col>
			<Col span='5'>
			    <Checkbox v-model='column.state.readonly'/>
			</Col>
		    </Row>
             </Form>
	</template>
    </div>
</template>
<script>

export default {
    name : 'state-row',
    props : {
        rowIndex : Number,
        rowObject : Object
    },
    created() {
        // 初始化数据
	this.$eventTarget.$on('hideAll',this.hideAll);
	this.$eventTarget.$on('renderAll',this.renderAll);
	this.$eventTarget.$on('readonlyAll',this.readonlyAll);
    },
    data() {
        return {
	    expand : false
	}
    },
    computed : {
        cssHeight() {
	    if(this.expand) {
	        return 25 + 27 * this.rowObject.columns.length + 'px';
	    } else {
	        return '25px';
	    }
	}
    },
    methods : {
        toggleExpand() {
	    this.expand = !this.expand;
	},
	hideAll(value) {
	    this.rowObject.state.hide = value;
            this.rowObject.columns.forEach(column => {
	        column.state.hide = value;
	    });
	},
	renderAll(value) {
	    this.rowObject.state.render = value;
            this.rowObject.columns.forEach(column => {
	        column.state.render = value;
	    });
	},
	readonlyAll(value) {
	    this.rowObject.state.readonly = value;
            this.rowObject.columns.forEach(column => {
	        column.state.readonly = value;
	    });
	}
    }
}

</script>
