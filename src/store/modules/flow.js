//import Util from '@/libs/util';
import axios from 'axios';
import qs from 'qs';
//import jquery from '@/libs/jquery-1.8.2';
const flow = {
    state: {
        contextPath : 'http://123.206.43.12:8080/workflowinter',
        url : {
		   query            : '/processmanage/datagrid.mvc',
		   save             : '/processmanage/saveOnlineProcess.mvc',
		   queryById        : '/processmanage/loadOnlineProcess.mvc',
		   disableWorkflow  : '/processmanage/disable.mvc',
		   publishWorkflow  : '/processmanage/release.mvc',
		   deleteWorkflow   : '/processmanage/delOnlineProcess.mvc',
		   toBpmn           : '/processmanage/toBpmn.mvc'
		},
		vm : null,
		loading : false,
		totalCount : 0,
		rows : []
    },
    mutations: {
        
        initFlow(state,vm) {
            state.vm = vm;
		},
        saveWorkflow(state,data) {
            data.CrossDomain = "true";
			state.vm.$Message.loading({
			    content : '正在保存...',
				duration : 0
			});
			axios.post(state.contextPath + state.url.save,qs.stringify(data)).then(res => {
				state.vm.$Message.destroy();
				if(res.data != "success") {
				    state.vm.$Message.error(res.data);
				} else {
				    state.vm.$Message.success("保存成功！");
                    state.vm.$router.go(-1);
				}
		    }).catch(function(error) {
				state.vm.$Message.destroy();
			    state.vm.$Message.error(error+'');
			});
		},
	    deleteWorkflow(state,option) {
			this.commit("execute",{
				id : option.id,
				callback : option.callback,
			    url : state.contextPath + state.url.deleteWorkflow,
				loadMsg : '删除中...',
				successMsg : '删除成功！'
			});
		},
        execute(state,option) {
			state.vm.$Message.loading({
			    content : option.loadMsg,
				duration : 0
			});
			axios.get(option.url,{
				params: {
					'id' : option.id,
					'CrossDomain' : 'true'
				}}).then(res => {
				state.vm.$Message.destroy();
				if(res.data != "success") {
				    state.vm.$Message.error(res.data);
				} else {
				    state.vm.$Message.success(option.successMsg);
                    option.callback && option.callback();
				}
		    }).catch(function(error) {
				console.trace(error);
				state.vm.$Message.destroy();
			    state.vm.$Message.error(error+'');
			});
		},
		publishWorkflow(state,option) {
            this.commit("execute",{
				id : option.id,
				callback : option.callback,
			    url : state.contextPath + state.url.publishWorkflow,
				loadMsg : '发布中...',
				successMsg : '发布成功！'
			});
		},
		disableWorkflow(state,option) {
			this.commit("execute",{
				id : option.id,
				callback : option.callback,
			    url : state.contextPath + state.url.disableWorkflow,
				loadMsg : '正在停用...',
				successMsg : '已停用！'
			});
		},
		loadProcessDesignData(state,option) {
			let id = option.id;
            state.loading = true;
         
		    axios.get(state.contextPath + state.url.queryById,{
				params: {
					'id' : id,
					'CrossDomain' : 'true',
					 t : new Date().getTime()
				}
			}).then(res => {
				state.loading = false;
				if(res.data.structuredData && option.callback) {
				    option.callback.call(this,res.data);
				}
		    }).catch(function(error) {
                console.trace(error);
                state.loading = false;
				state.vm.$Message.error(error+'');
			});

		},
		toBpmn(state,option) {
            state.vm.$Message.loading({
			    content : '加载中...',
				duration : 0
			});
			axios.post(state.contextPath + state.url.toBpmn,qs.stringify({
			    'CrossDomain' : 'true',
				'structuredData' : option.data,
			})).then(res => {
				state.vm.$Message.destroy();
                option.callback && option.callback(res.data);
		    }).catch(function(error) {
				console.trace(error);
				state.vm.$Message.destroy();
			    state.vm.$Message.error(error+'');
			});
		},
		loadProcessData (state,vm) {
			state.loading = true;
			let queryParams = vm.queryParams;
			axios.post(state.contextPath + state.url.query,qs.stringify(queryParams)).then(res => {
			    state.totalCount = res.data.total;
				state.rows = res.data.rows;
                vm.start = (queryParams.page - 1) * queryParams.rows;
				state.loading = false;
		    }).catch(function(error) {
			    vm.$Message.error(error+'');
                state.loading = false;
			});
		}
    }
};

export default flow;
