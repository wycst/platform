import Vue from 'vue';
import axios from 'axios';
import qs from 'qs';

import FormMenu from '@/views/form/design/FormMenu.vue'
import FormSetting from '@/views/form/design/FormSetting.vue'
import FormEdit from '@/views/form/FormEdit.vue'

const form = {
    state: {
        contextPath : 'http://localhost:3000',
        url : {
		   query            : '/form/datagrid',
		   save             : '/form/saveForm',
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
    formState : {
        baseProps : {
            name : 'state',
            code : 'state'
        },
		stateOption : {
            render : true,
            hide : false,
            readonly : false
		},
        global : {
            render : true,
            hide : false,
            readonly : false
        },
        elementsState : {
        }
    },
    selection : {
        selectState : null,
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
            form.rows.forEach( row => {
                 row.columns.forEach(column => {
					 let columnState = formState.elementsState[column.columnId];
                     if(!columnState) {
					     columnState = JSON.parse(JSON.stringify(formState.stateOption));
					     formState.elementsState[column.columnId] = columnState;
					 } 
					 Vue.set(column,'state',columnState);
				 });

                 let rowState = formState.elementsState[row.rowId];
				 if(!rowState) {
					 rowState = JSON.parse(JSON.stringify(formState.stateOption));
					 formState.elementsState[row.rowId] = rowState;
				 } 
				 Vue.set(row,'state',rowState);
			});
        },
		// 清除form对象中的state信息
		clearState(state) {
            console.log(JSON.stringify(state.formState,0,4));
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
        saveForm(state,id) {
            let queryParams = Object.assign({},state.form.baseProps);
            if(id) {
			           queryParams.id = id;
            }
    			  queryParams.formSource = JSON.stringify(state.form,0,4);
                axios.post(state.contextPath + state.url.save,qs.stringify(queryParams)).then(res => {
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
