import Vue from 'vue'
import iView from 'iview'
import Router from 'vue-router'
import {routers} from '@/router/router.js'

Vue.use(Router)

const router =  new Router({
  routes: routers
})

export default router;

router.beforeEach((to, from, next) => {
	iView.LoadingBar.start();
	next();
});

router.afterEach((to) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});