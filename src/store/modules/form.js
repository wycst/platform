import Vue from 'vue';
import axios from 'axios';
import qs from 'qs';

import FormMenu from '@/views/form/design/FormMenu.vue'
import FormSetting from '@/views/form/design/FormSetting.vue'
import Settings from '@/views/form/design/Settings.vue'
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
			   loadFormTree     : '/form/formTree',
			   save             : '/form/saveForm',
			   addState         : '/form/addState',
			   delState         : '/form/delState',
			   loadState        : '/form/loadState',
			   saveState        : '/form/saveState',
			   queryById        : '/form/loadForm',
			   submitForm       : '/form/submitForm',

         loadModel         : '/form/loadModel',

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
				component : Settings
			},
			center : {
				title : '设计',
				component : FormEdit
			}
		},
    designOption : {
			type : 'form'
		},
		formTreeNodeList : [],
		form : {
		    state : {
				render : true,
				hide : false,
				readonly : false
			}
		},
        design : null,
	    currentFormId : null,

        form_uid : null,
		showStateList : false,
		stateList : [],
		newState : {
			name : null,
		    code :null,
			description : null
		},
		formState : JSON.parse(JSON.stringify(initState)),
		selection : {
			selectStateId : null,
			selectType : null,
			selectRow  : null,
			selectButton  : null,
			selectColumn : null
		},
		rows : []
    },
    mutations: {
		initForm(state,design) {
            state.design = design;
			state.form = state.design.form;

            state.showStateList = false;
            state.stateList.splice(0,state.stateList.length);
			Object.assign(state.selection,{
				selectStateId : null,
				selectType : null,
				selectRow  : null,
				selectButton  : null,
				selectColumn : null
			});
		},
        setCurrentForm(state,form) {
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
            let initStateOption = {
				render : true,
				hide : false,
				readonly : false
			};
			Vue.set(form,'state',{...initStateOption});
            form.rows.forEach( row => {
                 row.columns.forEach(column => {
				     Vue.set(column,'state',{...initStateOption});
				 });
				 Vue.set(row,'state',{...initStateOption});
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

            axios.post(state.contextPath + state.url.addState,
				 qs.stringify(params)).then(res => {
    			      alert('sucess');
					  Object.assign(state.newState,{
							name : null,
							code :null,
							description : null
						});
					  this.commit('reloadForm');
    		     }).catch(function(error) {
    			      alert(error);
    			 });
		},
	    delState(state) {
			let selectStateId = state.selection.selectStateId;
            if(!selectStateId) {
			    alert("请选择要删除的状态！");
				return ;
			}
			if(window.confirm('确定要删除当前选择的状态吗？')) {
			    axios.get(state.contextPath + state.url.delState,{
					params: {
						'id' : selectStateId,
						 t : new Date().getTime()
					}
				}).then(res => {
				    if(res.data == "success") {
					    alert("success");
					}
					this.commit('reloadForm');
					state.designOption.type = 'form';
				}).catch(function(error) {
    			    alert(error);
    			});
			}


		},
        saveForm(state,option) {

            let queryParams = Object.assign({},state.form.baseProps);
			let formId = state.currentFormId;

            if(!formId) {
			   alert('请选择一个表单!');
			   return ;
			}

			let stateId = state.selection.selectStateId;
			if(stateId) {
			   // 如果已选择了state，则保存状态信息
			   let stateParams = {
			       id : stateId
			   };
			   this.commit('setStateParams',stateParams);
               queryParams.currentState = stateParams;
			}

			queryParams.id = formId;
            queryParams.formSource = JSON.stringify(state.form,0,4);

            axios.post(state.contextPath + state.url.save,
				 qs.stringify(queryParams)).then(res => {
    			      alert('sucess');
					  if(option.callback) {
					      option.callback.call(this,1);
					  }
    		     }).catch(function(error) {
    			      alert(error);
    			 });
		},
	    setStateParams(state,stateParams) {
			let formState = state.formState;
			Object.assign(stateParams,formState.baseProps);
            formState.elementsState = {};
			state.form.rows.forEach( row => {
				 row.columns.forEach(column => {
					 formState.elementsState[column.columnId] = column.state;
				 });
				 formState.elementsState[row.rowId] = row.state;
			});
            stateParams.stateSource = JSON.stringify(formState,0,4);
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
			this.commit('getState',{
			    id : id,
			    callback : stateData => {
					if(stateData) {
						let stateSource = stateData.state_source;
						if(stateSource) {
							let formState = JSON.parse(stateSource);
							Object.assign(state.formState,formState);
						} else {
							alert('数据异常!');
						}
						this.commit('mergeState');
					}
				}
			});
		},
		loadForm(state,id) {
            state.loading = true;
            this.commit('getForm',{
			     id : id,
			     callback(formData){
					state.currentFormId = id;
                    if(formData) {
						state.form_uid = formData.uid;
						state.stateList.splice(0,state.stateList.length);
						if(formData.stateList) {
							state.stateList.push(...formData.stateList);
						}
						let form = JSON.parse(formData.form_source);
						state.design.form = form;
						state.form = form;
						// show statelist
						state.showStateList = true;
					}
				 }
			});
		},
		reloadForm(state) {
			this.commit('loadForm',state.currentFormId);
		},
        getForm(state,options) {
            axios.get(state.contextPath + state.url.queryById,{
				params: {
					'id' : options.id,
					 t : new Date().getTime()
				}
			}).then(res => {
				state.loading = false;
				if(res.data == 'error') {
				    alert('form[id='+id+']加载失败!');
					return ;
				}
				if(options.callback && typeof(options.callback) == 'function') {
				    options.callback(res.data);
				}
		    }).catch(function(error) {
                console.trace(error);
				alert(error);
			});
		},
		getState(state,options) {
            axios.get(state.contextPath + state.url.loadState,{
				params: {
					'id' : options.id,
					 t : new Date().getTime()
				}
			}).then(res => {
				state.loading = false;
				if(res.data == 'error') {
				    alert('state[id='+id+']加载失败!');
					return ;
				}
				// res.data
				if(options.callback && typeof(options.callback) == 'function') {
				    options.callback(res.data);
				}
		    }).catch(function(error) {
                console.trace(error);
				alert(error);
			});
		},
		loadModel(state,options) {
						axios.get(state.contextPath + state.url.loadModel,{
				params: {
					'id' : options.id,
					 t : new Date().getTime()
				}
			}).then(res => {
				state.loading = false;
				if(res.data == 'error') {
						alert('Model[id='+id+']加载失败!');
					return ;
				}
				// res.data
				if(options.callback && typeof(options.callback) == 'function') {
						options.callback(res.data);
				}
				}).catch(function(error) {
								console.trace(error);
				alert(error);
			});
		},
	    submitForm(state,options) {
            let postParams = {
			    form_uid : options.form_uid,
				model_source : options.model_source
			};
            if(options.id) {
			    postParams.id = options.id;
			}
			axios.post(state.contextPath + state.url.submitForm,qs.stringify(postParams)).then(res => {
				alert('提交成功！')
				// res.data
				if(options.callback && typeof(options.callback) == 'function') {
				    options.callback(res.data);
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
