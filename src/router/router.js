import Main from '@/views/main/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/main/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

/*
export const preview = {
    path: '/preview',
    name: 'preview',
    component: () => import('@/views/form/article-publish/preview.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

*/

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: '主页', name: 'home_index',component: ()=> import('@/views/home/home.vue') },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index'},
        { path: 'order/:order_id', title: '订单详情', name: 'order-info' }, // 用于展示动态路由
        { path: 'shopping', title: '购物详情', name: 'shopping'}, // 用于展示带参路由
        { path: 'message', title: '消息中心', name: 'message_index'}
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/flow',
        icon: 'key',
        name: 'workflow',
		title: '工作流程',
        component: Main,
        children: [
            { path: 'workflowManage', title: '工作流管理',  icon : 'ios-play', name: 'workflow-manage', component: () => import('@/views/flow/WorkflowManage.vue')},
			{ path: 'workflowInstance', title: '工作流实例',icon : 'ios-play', name: 'workflow-instance', component: () => import('@/views/flow/WorkflowInstance.vue') }
        ]
    },
	{
        path: '/flow',
        icon: 'key',
        name: 'ruleflow',
		title: '业务引擎',
        component: Main,
        children: [
            { path: 'ruleflowManage', title: '业务流管理',  icon : 'ios-play', name: 'ruleflow-manage', component: () => import('@/views/flow/RuleflowManage.vue') },
			{ path: 'ruleflowInstance', title: '业务流实例',icon : 'ios-play', name: 'ruleflow-instance', component: () => import('@/views/flow/RuleflowInstance.vue') }
        ]
    },
	{
        path: '/statistics',
        icon: 'key',
        name: 'statistics',
		title: '流程统计',
        component: Main,
        children: [
            { path: 'flowStatistics', title: '流程统计',  icon : 'ios-play', name: 'flow-statistics', component: () => import('@/views/flow/workflow/AddWorkflow.vue') }
        ]
    },
    {
        path: '/other',
        icon: 'android-sad',
        title: '其他页面',
        name: 'other',
        component: Main,
        children: [
            { path: 'formdesign', title: '表单设计',icon : 'ios-play', name: 'form-design', component: () => import('@/views/form/FormDesign.vue') },
            { path: 'index2', title: '错误页面2',icon : 'ios-play', name: 'errorpage_index2', component: () => import('@/views/error-page/error-page.vue') },
			{ path: 'index12', title: '错误页面12',icon : 'ios-play', name: 'errorpage_index12', component: () => import('@/views/error-page/error-page.vue') }
		]
    }
];

// 一级界面
const oneLevelRouter = [
        { 
			path: '/formdesign',
			name: 'form-design', 
			component: () => import('@/views/form/FormDesign.vue')
		},
	    {
			path: '/addWorkflow',
			name: 'addWorkflow',
			component: () => import('@/views/flow/workflow/AddWorkflow.vue')
		},
		{
			path: '/editWorkflow',
			name: 'editWorkflow',
			component: () => import('@/views/flow/workflow/EditWorkflow.vue')
		},
		{ 
			path: '/borderlayout',
			name: 'border-layout', 
			component: () => import('@/views/layout/BorderLayoutDemo.vue')
		},
	    { 
			path: '/formedit',
			name: 'form-edit', 
			component: () => import('@/views/form/FormEdit.vue')
		},
		{ 
			path: '/formpreview',
			name: 'form-preview', 
			component: () => import('@/views/form/FormPreview.vue')
		},
		{ 
			path: '/demo',
			name: 'demo', 
			component: () => import('@/views/demo/Demo.vue')
		}
	];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
	otherRouter,
    ...appRouter,
	...oneLevelRouter,
    page500,
    page403,
    page404
];
