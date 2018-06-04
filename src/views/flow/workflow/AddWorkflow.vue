<template>

<Card ref="mainCard">
     <p slot="title">
        <Icon type="ios-flower"></Icon>
	新建工作流
     </p>   
     <p slot="extra">
              <Button type="ghost" icon="checkmark" @click="save">保存</Button>
	      <Button type="ghost" icon="upload" @click="bpmnImport">导入</Button>
	      <Button type="ghost" icon="android-download" @click="bpmnExport">导出</Button>
	      <Button type="ghost" icon="trash-a" @click="clear">清除画板</Button>
	      <Button type="ghost" icon="android-arrow-back" @click="back">返回</Button>
     </p>   

     <Layout :style="{height: layoutHeight + 'px'}" id="flowdesign">
            <Sider collapsible hide-trigger :collapsed-width="78" theme='primary' :style="{height:clientHeight+'px',background : 'white',maxWidth : '210px',width : '210px',flex : '0 0 210px'}">
	            <div style="height:100%;overflow:auto;">
                          <div style="height: 100%; width: 100%;">

                                <Menu :open-names="['BaseElements']" width="200px">
				
				<Submenu name="BaseElements">
				    <template slot="title">
					<Icon type="ios-paper"></Icon>
					基本元素
				    </template>
				    <MenuItem name="Start">
				         <div class="node start">
					    <Avatar :src="bpmnImg.start" style="margin-right:15px"/>开始
					 </div>
				    </MenuItem>
				    <MenuItem name="End">
				         <div class="node end">
				            <Avatar :src="bpmnImg.end" style="margin-right:15px"/>结束
					 </div>
			            </MenuItem>
				    <MenuItem name="HumanTask">
				         <div class="node humanTask">
					    <Avatar icon="person" style="margin-right:15px;" shape="square"/>人工任务
					 </div>
				    </MenuItem>
				    <MenuItem name="split">
				         <div class="node diverage">
					    <Avatar :src="bpmnImg.diverage" style="margin-right:15px;"/>分支
					 </div>
				    </MenuItem>
				    <MenuItem name="join">
                                         <div class="node converge">
					    <Avatar :src="bpmnImg.converge" style="margin-right:15px;"/>聚合
					 </div>
				    </MenuItem>
				    <MenuItem name="SubProcess">
				         <div class="node mutiSubprocess">
				            <Avatar icon="android-checkbox-outline-blank" shape="square" style="margin-right:15px;"></Avatar>子流程
					 </div>
			            </MenuItem>
				</Submenu>
				<Submenu name="ServiceElements">
				    <template slot="title">
					<Icon type="ios-paper"></Icon>
					服务组件
				    </template>
				    <MenuItem name="WebService">WebService服务</MenuItem>
				    <MenuItem name="EmailService">Email服务</MenuItem>
				    <MenuItem name="MessageService">短信服务</MenuItem>
				</Submenu>
			     </Menu>
			  </div>
		    </div>
			  
            </Sider>

            
	    <Content :style="{padding: '0 0px 0px'}">
		 <Card>  
		    <Tabs ref="tabs" :animated="false"  type="card" :style="{background : 'white'}" @on-click="clickTab">
			<TabPane label="设计">
                            <div :style="{height:(clientHeight - 68 )+'px',width :'100%',background : 'white',overflow : 'auto',border : '1px solid gray'}">
				 <bpmn-ui ref="bpmnRef"></bpmn-ui>
			    </div>
			</TabPane>
			<TabPane label="BPMN">
			    <div :style="{height:(clientHeight - 68 )+'px',width :'100%',background : 'white',border : '0px solid blue'}">
				 <textarea id="bpmnSource" style="width: 99%;height: 99%;border: 0px;padding: 2px;margin: 2px;resize:none;">{{bpmnSource}}</textarea>
			    </div>
			</TabPane>
			<TabPane label="JSON">
			    <div :style="{height:(clientHeight - 68 )+'px',width :'100%',background : 'white',border : '0px solid blue'}">
				 <textarea id="JSON" style="width: 99%;height: 99%;border: 0px;padding: 2px;margin: 2px;resize:none;">{{dataJson}}</textarea>
			    </div>
			</TabPane>
			<TabPane label="辅助项">
			    <div :style="{height:(clientHeight - 68 )+'px',width :'100%',background : 'white',border : '0px solid blue'}">
				 <Form :model="formItem" :label-width="120">
					<FormItem label="是否使用背景">
					    <i-switch v-model="formItem.useBg" size="large">
						<span slot="open">开</span>
						<span slot="close">关</span>
					    </i-switch>
					</FormItem>
					<FormItem label="连线默认名称">
					    <Input v-model="formItem.defaultTaskName" placeholder=""></Input>
					</FormItem>
					<FormItem label="任务默认名称">
					    <Input v-model="formItem.input" placeholder=""></Input>
					</FormItem>
					<FormItem label="任务背景颜色">
					    <Select v-model="formItem.bgColor">
						<Option value="#FCFCDD">黄（淡）</Option>
						<Option value="LightBlue">蓝（淡）</Option>
						<Option value="LightGreen">绿（淡）</Option>
					    </Select>
					</FormItem>
				 </Form>
			    </div>
			</TabPane>
		    </Tabs>
		 </Card>
             </Content>
     </Layout>
      
</Card>

</template>

<script>

    // 引入自定义的js
    import bpmnImg from '../libs/bpmnImg'
    import bpmnUi from '../components/BpmnUI'
    export default {
        name : 'add-workflow',
	components: {
	    bpmnUi
	},
        data () {
            return {
	        bpmnSource : '',
		dataJson   : '',
	        bpmnImg : bpmnImg,
		offsetTop : 0,
                formItem: {
                    bgColor: '#FCFCDD',
		    defaultTaskName : '任务名称',
                    checkbox: [],
                    useBg: true
                }
            }
        },
	computed : {
	   clientHeight () {
	       return this.$store.state.common.documentBodyClientHeight - 70 - this.offsetTop ;
	   },
	   paperWidth () {
	       return document.body.clientWidth - 270;
	   },
	   layoutHeight() {
	       return this.$store.state.common.documentBodyClientHeight - this.offsetTop;
	   }
	},
	mounted () {
	   this.offsetTop = this.$refs.mainCard.$el.getBoundingClientRect().top ;
	},
	methods : {
	   clickTab(name) {
	      if(name == 1 || name == 2) {
	          let processData = this.$refs.bpmnRef.flowDesign.getProcessData();
		  let stringJson = JSON.stringify(processData, null, 4);
                  if(name == 1) {
		      this.$store.commit("toBpmn",{
		          data : stringJson,
		          callback : (xml)=> {
			     this.bpmnSource = xml;
		          }
		      });
		  } else {
		      this.dataJson = stringJson;
		  }
	      } 
	   },
	   save () {
	      let processData = this.$refs.bpmnRef.flowDesign.getProcessData();
	      let structuredData = JSON.stringify(processData, null, 4);
	      let data = {...processData.properties};
              data.structuredData = structuredData;
              this.$store.commit("saveWorkflow",data);
	   },
	   clear() {
	      this.$refs.bpmnRef.flowDesign.clear();
	   },
	   back() {
	      this.$router.go(-1);
	   },
	   bpmnImport() {
	     
	   },
	   bpmnExport() {
	      
	   }
	}
        
    }
</script>
 


  


  

 
   