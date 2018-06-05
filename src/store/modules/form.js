import Vue from 'vue';
import axios from 'axios';
import qs from 'qs';

import FormMenu from '@/views/form/design/FormMenu.vue'
import FormSetting from '@/views/form/design/FormSetting.vue'
import FormEdit from '@/views/form/FormEdit.vue'

const initState = {
	baseProps : {
		name : null,
		code : null,
		description : null
	},
	global : {
		render : true,
		hide : false,
		readonly : false
	},
	elementsState : {}
}

const form = {
    state: {
        contextPath : 'http://localhost:3000',
        url : {
		   query            : '/form/datagrid',
		   save             : '/form/saveForm',
		   addState         : '/form/addState',
		   loadState        : '/form/loadState',
		   saveState        : '/form/saveState',
		   queryById        : '/form/loadForm',
		   disableForm  : '/form/disable',
		   publishForm  : '/form/publish',
		   deleteForm   : '/form/delete'
		},
		vm : null,
		loading : false,
		totalCount : 0,
		regions : {
			west : {
					title : '导航',
					width : 250,
					component : FormMenu
				},
				east : {
					title : '设置',
					collapsed : true,
					width : 350,
					component : FormSetting
				},
				center : {
					title : '设计',
					component : FormEdit
				}
			},
		form : {},
        form_uid : null,

		stateList : [],
		newState : {
			name : null,
		    code :null,
			description : null
		},
		formState : JSON.parse(JSON.stringify(initState)),
		selection : {
			selectStateId : null,
			selectType : 1,
			selectRow  : null,
			selectButton  : null,
			selectColumn : null
		},
		rows : []
    },
    mutations: {
        initForm(state,form) {
            state.form = form;
		},
		// 合并state到form对象
        mergeState(state,type) {
            let form = state.form;
            let formState = state.formState;
            Vue.set(form,'state',formState.global);

            let initStateOption = {
				render : true,
				hide : false,
				readonly : false
			};

            form.rows.forEach( row => {
                 row.columns.forEach(column => {
					 let columnState = formState.elementsState[column.columnId];
					 Vue.set(column,'state',columnState || {...initStateOption});
				 });
                 let rowState = formState.elementsState[row.rowId];
				 Vue.set(row,'state',rowState || {...initStateOption});
			});
        },
		// 清除form对象中的state信息
		clearState(state) {
            let form = state.form;
			delete form.state;
            form.rows.forEach( row => {
                 row.columns.forEach(column => {
				     delete column.state;
				 });
                 delete row.state;
			});
			// 按钮信息的state
		},
        setSelection(state,option) {
            Object.assign(state.selection,option);
	    },
		addState(state) {
			let params = Object.assign({},state.newState);
            if(!params.name) {
				 alert('请输入状态名称！');
				 return ;
			} else if(!params.code) {
			     alert('请输入状态编码！');
				 return ;
			}
			params.form_uid = state.form_uid;
			params.order_index = state.stateList.length;

            let stateSourceJson = JSON.parse(JSON.stringify(initState));
			Object.assign(stateSourceJson.baseProps,state.newState);
            params.state_source = JSON.stringify(stateSourceJson,0,4);
         
            console.log(JSON.stringify(initState));

            axios.post(state.contextPath + state.url.addState,
				 qs.stringify(params)).then(res => {
    			      alert('sucess');
					  Object.assign(state.newState,{
							name : null,
							code :null,
							description : null
						});
    		     }).catch(function(error) {
    			      alert(error);
    			 });
		},
        saveForm(state,id) {
            let queryParams = Object.assign({},state.form.baseProps);
            if(id) {
			    queryParams.id = id;
            }
            // 保存状态信息
            let stateId = state.selection.selectStateId;
            if(stateId) {
			   console.log(' to saveState ');
			   this.commit('saveState');
               return ;
            }

            queryParams.formSource = JSON.stringify(state.form,0,4);

            axios.post(state.contextPath + state.url.save,
				 qs.stringify(queryParams)).then(res => {
    			      alert('sucess');
    		     }).catch(function(error) {
    			      alert(error);
    			 });
		},
	    saveState(state) {
			let formState = state.formState;
			let queryParams = Object.assign({},formState.baseProps);
           
			queryParams.id = state.selection.selectStateId;
            // 每次保存根据编辑的结果初始化store的状态信息
            formState.elementsState = {};
			state.form.rows.forEach( row => {
				 row.columns.forEach(column => {
					 formState.elementsState[column.columnId] = column.state;
				 });
				 formState.elementsState[row.rowId] = row.state;
			});
            queryParams.stateSource = JSON.stringify(formState,0,4);
            axios.post(state.contextPath + state.url.saveState,
				 qs.stringify(queryParams)).then(res => {
    			      alert('sucess');
    		     }).catch(function(error) {
    			      alert(error);
    			 });
		},
	    deleteForm(state,option) {

		},
        executeFormRequest(state,option) {

		},
		publishForm(state,option) {
            this.commit("executeFormRequest",{
				id : option.id,
				callback : option.callback,
			    url : state.contextPath + state.url.publishForm,
				loadMsg : '发布中...',
				successMsg : '发布成功！'
			});
		},
		disableForm(state,option) {
			this.commit("executeFormRequest",{
				id : option.id,
				callback : option.callback,
			    url : state.contextPath + state.url.disableForm,
				loadMsg : '正在停用...',
				successMsg : '已停用！'
			});
		},
		loadState(state,id) {
		    axios.get(state.contextPath + state.url.loadState,{
				params: {
					'id' : id,
					 t : new Date().getTime()
				}
			}).then(res => {
				state.loading = false;
				// res.data
				let stateData = res.data;
				let stateSource = stateData.state_source;
				if(stateSource) {
					let formState = JSON.parse(stateSource);
                    Object.assign(state.formState,formState);
				} else {
				
					Object.assign(state.formState,formState);
				}
				this.commit('mergeState');
		    }).catch(function(error) {
                console.trace(error);
				alert(error);
			});

		},
		loadForm(state,option) {
			let id = option.id;
            state.loading = true;
		    axios.get(state.contextPath + state.url.queryById,{
				params: {
					'id' : id,
					 t : new Date().getTime()
				}
			}).then(res => {
				state.loading = false;
				if(res.data && option.callback) {
					state.form_uid = res.data[0].uid;
					state.stateList.splice(0,state.stateList.length);
					if(res.data[0].stateList) {
						state.stateList.push(...res.data[0].stateList);
					}
				    option.callback.call(this,res.data);
				}
		    }).catch(function(error) {
                console.trace(error);
				alert(error);
			});

		},
		loadFormData (state,vm) {
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

export default form;
