<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
        <Card>
	    <div>
		 <div style="marginTop:2px;">
		      <Button type="ghost" icon="plus" @click='toAddFlow'>新增工作流</Button>
		      <Button type="ghost" icon="upload">导入</Button>
		      <Button type="ghost" icon="android-download">导出</Button>
		      <Button type="ghost" icon="android-download">导出全部</Button>


		      <Select clearable placeholder="选择模式" style="width:100px;" v-model="queryParams.pubMode">
			   <Option value="online" key="online">在线</Option>
			   <Option value="offline" key="offline">离线</Option>
		      </Select>
		      <Input placeholder="请输入流程名称" clearable v-model="queryParams.processName" style="width:150px;"></Input>
		      <Button type="ghost" icon="search" @click="filter">查询</Button>

		 </div>
		 <div style="marginTop:2px;">
		      <Table ref="tab" size="small" border :loading="this.$store.state.flow.loading" :columns="columns" :data="rows" class="table" :height="tableHeight"></Table>
		 </div>
		 <div style="marginTop:4px;">
		      <Page ref="page" :current="queryParams.page" :total="totalCount" size="small" :page-size="queryParams.rows" show-total class="paging" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,30]" placement="top" show-elevator show-sizer></Page>
		 </div>
             </div>
	 </Card>
</template>

<script>

export default {
    name: 'workflow-manage',
    data () {
        return {
             ajaxHistoryData:[],
	     start : 0,
	     offsetTop : 200,
	     queryParams : {
		 page : 1,
		 rows : 10
	     },
	     columns : [
		    {
			type: 'selection',
			width: 60,
			align: 'center'
		    },
		    {
		        title: '',
			width: 60,
			align: 'center',
			render : (f,record) => {
			   return this.renderIndex(f,record);
			}
		    },
		    {
			title: '流程名称',
			width: 210, 
			key: 'processName',
		    },
		    {
			title: '流程编码',
			width: 210, 
			ellipsis : true,
			key: 'processCode',
		    },
		    {
			title: '版本',
			width: 80, 
			key: 'version'
		    },
		    {
			title: '状态',
			width: 80, 
			key: 'statusCode',
			render (f,record) {
			   return record.row.statusCode == 1 ? '启用' : '草稿';
			}
		    },
		    {
			title: '模式',
			key: 'pubMode',
			width: 80, 
			render (f,record) {
			   return record.row.pubMode == 'online' ? '在线' : '离线';
			}
		    },
		    {
			title  : '操作',
			key    : 'ops',
			align  : 'center',
			width  : 280, 
			render : (f,record)=>{
		           return f('div',{
                                    },[
				      f('Button',{
				         props : {
					    icon : 'edit',
					    type : 'text',
					    size : 'small'
					 },
					 on : {
					    click :()=> {
						this.toEditFlow(record);
					    }
					 }
				      },'编辑'),
				      f('Button',{
				          props : {
					      icon : 'ios-trash',
					      type : "text",
					      size : 'small'
					  },
					  on : {
					     click :()=> {
					        this.deleteFlow(record);
					     }
					  }
				      },'删除'),
                                      (record.row.statusCode == 1) ? [
				        f('Button',{
				           props : {
					        icon : 'eye-disabled',
						type : "text",
						size : 'small'
					   },
					   on : {
					        click : ()=> {
						   this.disableFlow(record);
						}
					   }
				        },'停用'),
					f('Button',{props : {icon : 'plus-circled',type : "text",size : 'small'}},'新版本')] : 
				        f('Button',{
				               props : {
					          icon : 'ios-checkmark',
						  type : "text",
						  size : 'small'
					       },
					       on : {
					          click : ()=> {
					              this.publishFlow(record);
						  }
					       }
					},'发布')
				    ]);

			}
		    }
             ] 
        };
    },
    methods: {
        init () {
            this.loadData();
        },
	renderIndex (f,record) {
	   return this.start + record.index + 1;
	},
	filter() {
	   this.queryParams.page = 1;
           this.loadData();
	},
        loadData() {
	    this.$store.commit('loadProcessData', this);
	},
        changePage (p) {
	    // 改变分页后
            this.queryParams.page = p;
	    this.loadData();
	},
	changePageSize(size) {
	    this.queryParams.rows = size;
            this.loadData();
	},
        toAddFlow () {
	    //this.display = 2;
	    this.$router.push("/addWorkflow");
	},
        toEditFlow (record) {
	    this.$router.push("/editWorkflow?id=" + record.row.id);
	},
	deleteFlow(record) {
	    this.$store.commit('deleteWorkflow', {
	        id : record.row.id,
		callback : this.loadData
	    });
	},
	publishFlow(record) {
            this.$store.commit('publishWorkflow', {
	        id : record.row.id,
		callback : this.loadData
	    });
	},
	disableFlow(record) {
	    this.$store.commit('disableWorkflow', {
	        id : record.row.id,
		callback : this.loadData
	    });
	}
    },
    computed : {
	    tableHeight () {
                return this.$store.state.common.documentBodyClientHeight - this.offsetTop ;
            },
	    totalCount () {
	        return this.$store.state.flow.totalCount;
	    },
            rows () {
	        return this.$store.state.flow.rows;
	    }
    },
    mounted () {
        this.init();
        this.offsetTop = this.$refs.tab.$el.getBoundingClientRect().top ;
    },
    watch: {
        '$route' () {
        }
    }
};

</script>

<style>
 .table table{
   // width: 100% !important;
  }

</style>
