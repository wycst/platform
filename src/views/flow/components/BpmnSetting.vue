<template>

<div id="bpmnSetting" v-show="editStatus == 1" style="z-index:100;background: #FFF;height: 360px;position: absolute; right: 20px; top: 62px; width: 520px;">
	<Card>
	     <p slot="title">
		<Icon type="ios-browsers"></Icon>
		{{title}}
	     </p> 
	     <p slot="extra">
		<Button type="text" shape="circle" icon="close-round" @click="close"></Button>
	     </p>  

	     <!--流程属性-->
	     <div v-show="editType == 'process'" style="height:350px;overflow:auto;">
		<PropertyTable size="small" ref="flowRef" border :propertyColumns="propertyColumns" :propertyValues="processValues" :height='320'></PropertyTable>
	     </div> 
	     
	     <!--节点(连线)属性-->
	     <div v-show="editType == 'element'" style="height:350px;overflow:auto;">
		 <Tabs ref="tabs" :animated="false"  type="card" :style="{background : 'white'}" @on-click="clickTab">
			<TabPane label="基本属性">
			    <PropertyTable size="small" ref="basePropertyTable" border :propertyColumns="propertyColumns" :propertyValues="elementValues" :height='280'></PropertyTable>
			</TabPane>
			<TabPane name='paramSetting' :disabled="!isEditHumanNode" label="参数配置">
			       <Form ref="paramFormRef" :model='paramModel' :label-width="50" height="20">
				    <Row>
					<Col span="8">
					    <FormItem label="名称">
						<Input required :disabled="!isEditHumanNode" v-model='paramModel.name' name="name" size='small' placeholder=""></Input>
					    </FormItem>
					</Col>
					<Col span="10">
					    <FormItem label="值">
						<Input :disabled="!isEditHumanNode" v-model='paramModel.value' name="value" size='small' placeholder=""></Input>
					    </FormItem>
					</Col>
					<Col span="6">
					    <FormItem>
						<Button :disabled="!isEditHumanNode" size='small' icon="plus" @click="addParam">增加</Button>
					    </FormItem>
					</Col>
				    </Row>
				 </Form>
			    <EditableTable size="small" ref="paramTabRef" border :columns="paramColumns" :data="paramValues" :height='240'></EditableTable>
			</TabPane>
			<TabPane :disabled="!isEditHumanNode" label="表单">
			</TabPane>
		 </Tabs>
	     </div> 

	</Card>
</div>

</template>
<script>

   import $ from 'jquery'
   import 'jqueryui'
   export default {
       name : 'bpmnSetting',
       data()  {
          return {
	        editStatus : 0,
	        editType : null,
		elementType : 'node',
		elementDataType : null,
                propertyColumns : [{
                        title: '名称',
			width : 160,
                        key: 'propertyName'
                    },{
                        title: '值',
                        key: 'propertyValue'
                    }
                ],
		paramColumns : [{
                        title: '参数名称',
			width : 160,
                        key: 'name',
			afterEdit : ()=> {
			    this.syncParams();
			},
			editor : 'Input'
                    },{
                        title: '参数值',
                        key: 'value',
			editor : 'Input',
			afterEdit : ()=> {
			    this.syncParams();
			}
                    },{
                        title: '操作',
			width : 80,
                        key: 'ops',
			render : (h,params) => {
			    return h('Button',{
			        props : {
				   icon  : 'minus',
				   size  : 'small'
				},
				on : {
				   click : ()=> {
				      this.deleteParam(params.index,params.row);
				   }
				}
			    });
			}
                    }],
                paramModel  : {},
                paramValues : [],
		process  : {},
		element  : {},

                inMapping : {},

		processValues : [],
		elementValues : []
	  }
       },
       computed : {
          title () {
	     return this.editType == "process" ? '流程属性' : '元素属性';
	  },
	  isEditHumanNode() {
	     return this.editType == 'element' && this.elementType == 'node' && this.elementDataType == null;
	  }
       },
       mounted() {
          this.init();
       },
       methods : {
          init() {
             $('#bpmnSetting').draggable({
	          handle : '.ivu-card-head'
	     });
	  },
          close() {
	     this.editStatus = 0;
	  },
	  clickTab(name) {
	     if(name == 'paramSetting') {
	         this.loadParamValues();
	     }
	  },
	  addParam() {
             let inMapping = this.element.data('parameterMapping');
             if(this.paramModel.name) {
	         inMapping[this.paramModel.name] = this.paramModel.value;
		 this.loadParamValues();
	         this.paramModel = {};
	     } else {
	         this.$Message.error('参数名称不能为空！');
	     }
	  },
	  deleteParam(index,row) {
             let inMapping = this.element.data('parameterMapping');
             delete inMapping[row.name];
             this.loadParamValues();
	  },
	  syncParams() {
	     if(this.$refs.paramTabRef) {
	         let data = this.$refs.paramTabRef.getData();
		 let inMapping = this.element.data('parameterMapping');
                 for(let key in inMapping) {
		     delete inMapping[key];
		 }
                 data.forEach(record => {
		     if(record.name) {
		        inMapping[record.name] = record.value;
		     }
		 });
	     }
	  },
	  loadParamValues () {
	     if(this.$refs.paramTabRef) {
	         this.$refs.paramTabRef.loadData(this.getParamValues());
	     }
	  },
	  getProcessValues() {
	     let values = [];
             let properties = this.process.properties;
             if(properties) {
	         values.push(...[{
                        propertyName: '流程编码',
			propertyKey : 'processCode',
                        propertyValue: properties['processCode']
                    },{
                        propertyName: '流程版本',
			propertyKey : 'version',
			editor : {
			   type : 'H5Input',
			   props : {
			       type : 'number'
			   }
			},
			callback : (key,value) => {
			   properties[key] = value;
			},
                        propertyValue: properties['version']
                    },{
                        propertyName: '流程名称',
			propertyKey : 'processName',
			callback : (key,value) => {
			   properties[key] = value;
			},
                        propertyValue: properties['processName']
                    }]);
	     }
	     return values;
	  },
          getElementValues() {
	     let values = [];
             if(this.element.data) {
		let properties = this.element.data("properties");
		let dataType = this.element.data("type");
		if(this.elementType == 'node') {
			values.push(...[{
				propertyName: '环节id',
				propertyKey : 'nodeId',
				readOnly : true,
				propertyValue: this.element.data('nodeId')
			   },{
				propertyName: '环节名称',
				propertyKey : 'nodeName',
				callback : (key,value) => {
				    properties.nodeName = value;
				    if(this.element.data('text')) {
					this.element.data('text').attr('text',value);
				    }
				},
				propertyValue: properties.nodeName
			   }
			]);
                        if(['start','end','diverage','converge'].indexOf(dataType) > -1) {
			   
			} else {
			   values.push(...[{
				propertyName: '环节描述',
				propertyKey : 'comment',
				callback : (key,value) => {
				    properties.comment = value;
				},
				propertyValue: properties.comment
			   },{
				propertyName: '环节受理组',
				propertyKey : 'groupId',
				callback : (key,value) => {
				    properties[key] = value;
				},
				propertyValue: properties.groupId
			   }]);
			}

		} else {
		        // link
		        values.push(...[{
				propertyName: '元素类型',
				propertyKey : 'elementType',
				readOnly : true,
				propertyValue: '连线'
			   },{
				propertyName: '连线名称',
				callback : (key,value) => {
				    properties[key] = value;
				    if(this.element.data('pathText')) {
					this.element.data('pathText').attr('text',value);
				    }
				},
				propertyKey : 'linkName',
				propertyValue: properties.linkName
			   }
			]);
		} 
		
	     }
	     return values;
	  },
          getParamValues() {
             let paramValues = [];
             if(this.element.data) {
	         let inMapping = this.element.data('parameterMapping') || {};
		 this.element.data("parameterMapping",inMapping);

                 for(let key in inMapping) {
		     paramValues.push({
		          name  : key,
			  value : inMapping[key]
		     });
		 }
	     }
             return paramValues;
	  },
	  updateEditData(editType,data) {
	     this.editType = editType;
	     if(editType == 'element') {
	         this.element = data;
		 // dataType :  start,mutiSubProcess,end,diverage,converge
                 let dataType = this.element.data('type');
		 this.elementDataType = dataType;
		 // type: image,rect,path
		 let type = this.element.type;
                 if(type == 'rect' || type == 'image') {
		     this.elementType = 'node';
		 } else if(type == 'path') {
		     // link
		     this.elementType = 'link';
		 } 
	     }
	     if(editType == 'process') {
	         this.process = data;
	     }
	  },
          show() {
	     this.editStatus = 1;
	  }
       },
       watch: {
           element: {
		handler (newElement,oldElement) {
		   // update element props
		   this.$refs.basePropertyTable.loadData(this.getElementValues());

                   // update params
		   this.loadParamValues();
		},
		deep: false 
	   },
           editType : {
	        handler (type) {
		    // update
		    if(type == 'process') {
		        this.$refs.flowRef.loadData(this.getProcessValues());
		    }
		},
		deep: false   
	   }
       }
   }
</script>