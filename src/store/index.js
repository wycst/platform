import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app'
import flow from './modules/flow'
import form from './modules/form'
import common from './modules/common'
// import user from './modules/user';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        //
    },
    mutations: {
        //
    },
    actions: {

    },
    modules: {
        app,
		flow,
		form,
		common
    }
}); 
store.commit("init");

export default store;
