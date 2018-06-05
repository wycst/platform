<template>
<Card ref='accordion' style='height:520px;' :class="{'accordion-small' : size == 'small','accordion-fit' : true}">
     <p slot="title">
        <Icon v-if='icon != null' :type="icon"></Icon>
	测试112
     </p>   
     <p slot='extra'>

         <Button @click='testModel'>测试弹出框</Button>

         <Button>
             <Input v-model='height'>
	     <span slot="prepend">accordion高度1:</span>
	     </Input>
	 </Button>
	 <Button>
           animate: <i-switch v-model='animate'></i-switch>
	 </Button>
	  <Button>
           fit: <i-switch v-model='fit'></i-switch>
	 </Button>
	 <Button>
           multi: <i-switch v-model='multi'></i-switch>
	 </Button>
 
     </p>
     <div :style="{height: height + 'px',background : 'white',overflow : 'auto'}">
	
         <Tabs value="name1">
		<TabPane label="accordion" name="accordion">
		     <accordion :multi='multi' :animate='animate' :fit='fit' :items='items'>
			    <AccordionPanel title='标签添加的' active>
					<accordion :multi='multi' :animate='animate' :fit='fit'>
					    <AccordionPanel title='children标签添加1' active>
						<Input/>
					    </AccordionPanel>
					    <AccordionPanel title='children标签添加1' active>
						<Input/>
					    </AccordionPanel>
					</accordion>
			    </AccordionPanel>
		      </accordion>
		</TabPane>
		<TabPane label="modelTree" name="modelTree">
		      <ModelTree :model='treeData' childrenKey='columns'></ModelTree>
		</TabPane>
	 </Tabs>

     </div>

</Card>
</template>

<script>

import AccordionPanel from '@/components/panel/AccordionPanel'
import Accordion from '@/components/panel/Accordion'

import ModelTree from '@/components/tree/ModelTree'

export default {
        name : 'AccordionDemo',
        components : {
	    Accordion,
	    AccordionPanel,
	    ModelTree
	},
	props : {
	    icon  : String,
	    title : String,
            size  : {
	        type : String,
		default : 'small'
	    }
	},
	data () {
		 return {
		     hide : true,
		     active : 0,
		     fit : true,
		     animate : true,
		     multi   : false,
		     accordionHeight : 0,
                     height : 300,
		     items : [{
				title : '其他属性',
				component : {
				    template : '<div>组件属<br>属<br>属<br>属<br>属<br>属<br>属<br>属<br>属<br>属<br>属<br>属<br>属性2<br/></div>'
				}
			    },{
				title : '组件属性4',
				component : {
				    template : '<div>组件属性4</div>'
				}
			    }],


                      treeData : [{
			    title : '测试1',
			    columns : [{
				title : '测试11',
				columns : [{
				    title : '测试111 '
				}]
			    },{
				title : '测试12'
			    }]
		      },{
			    title : '测试2',
			    columns : [{
				title : '测试21',
				columns : [{
				    title : '测试211 '
				}]
			    },{
				title : '测试22'
			    }]
		      }]

		 }  
	},
	mounted () { 
	   this.accordionHeight = this.$refs.accordion.$el.getBoundingClientRect().height ;
	},
	computed : {
	   bodyHeight () {
	      return this.fit ? '100%' : (this.height ? this.height + 'px' : 'auto');
	   }
	},
	methods : {
	   toggle(i) {
	      this.active = i == this.active ? -1 : i;
	   },
           testModel() {
	       this.$Modal.confirm({
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: this.value,
                                autofocus: true,
                                placeholder: 'Please enter your name...'
                            },
                            on: {
                                input: (val) => {
                                    this.value = val;
                                }
                            }
                        })
                    }
                });
	   }
	}
}
</script>
<style>
.ivu-accordion {
   background-color: #f7f7f7;
   border-radius: 3px;
   border: 1px solid #dddee1;
}
.ivu-accordion-item {
   //border: 1px solid #e9eaec;
   position:relative;
}
.ivu-accordion>.ivu-accordion-item {
   border-top: 1px solid #dddee1;
}

.ivu-accordion>.ivu-accordion-item:first-child {
   border-top: 0;
}
.ivu-accordion-item-head {
    padding: 14px 16px;
    cursor: pointer;
    line-height: 1;
}
.ivu-accordion-extra {
    position: absolute;
    right: 16px;
    top: 14px;
}

.ivu-accordion-content {
    color: #495060;
    padding: 15px;
    background-color: #fff;
}

.accordion-small .ivu-accordion-item-head {
    padding: 10px 12px;
}
.accordion-small .ivu-accordion-extra {
    right: 12px;
    top: 10px;
}
.accordion-small .ivu-accordion-content {
    padding: 12px;
}

.toggle-arrow {
    transition: transform .3s;
}

.ivu-icon.is-active {
    transform: rotate(90deg);
}



</style>