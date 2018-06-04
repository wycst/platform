// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// 导入iview
import iView from 'iview'
import App from './App'
import router from './router'
import store from './store/index';

import './components'

// 导入css
import 'iview/dist/styles/iview.css';

Vue.use(iView);

//Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  mounted () {
	  this.$store.commit('setOpenedList');
	  this.$store.commit('initCachepage');
      this.$store.commit('updateMenulist');
	  this.$store.commit('initFlow',this);
  }
})
