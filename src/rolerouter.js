let routers = [
	{
		path: '/',
		component: resolve => require(['./components/common/Home.vue'], resolve),
		meta: {title: '自述文件'},
		children: [
			{
				path: '/dashboard',
				component: resolve => require(['./components/pages/Dashboard.vue'], resolve),
				meta: {title: '系统首页'}
			},
			{
				path: '/userAdmin',
				component: resolve => require(['./components/pages/UserAdmin.vue'], resolve),
				meta: {
					title: '用户管理'
				}
			},
			{
				path: '/userAdmin_op',
				component: resolve => require(['./components/pages/UserAdmin_op.vue'], resolve),
				meta: {
					title: 'op用户管理'
				}
			},
			{
				path: '/oneLevelAgent',
				component: resolve => require(['./components/pages/OneLevelAgent.vue'], resolve),
				meta: {
					title: '一级代理',
				}
			},
			{
				path: '/walletAdmin',
				component: resolve => require(['./components/pages/OneLevelAgentEnd.vue'], resolve),
				meta: {title: '资产管理'}
			},
			{
				path: '/device',
				component: resolve => require(['./components/pages/DeviceAdmin.vue'], resolve),
				meta: {title: '设备管理'}
			},
			{
				path: '/lookDevice',
				component: resolve => require(['./components/pages/LookDevice.vue'], resolve),
				meta: {title: '查看设备'}
			},
			{
				path: '/lookUser',
				component: resolve => require(['./components/pages/LookUser.vue'], resolve),
				meta: {title: '查看用户'}
			},
			{
				path: '/commision',
				component: resolve => require(['./components/pages/commission.vue'], resolve),
				meta: {title: '返佣查询'}
			},
			{
				path: '/config',
				component: resolve => require(['./components/pages/Config.vue'], resolve),
				meta: {title: '配置'}
			},
			{
				path: '/twoLevelAgent',
				component: resolve => require(['./components/pages/TwoLevelAgent.vue'], resolve),
				meta: {title: '二级代理'}
			},
			{
				path: '/twoLevelAgentBig',
				component: resolve => require(['./components/pages/TwoLevelAgentBig.vue'], resolve),
				meta: {title: '二级用户代理'}
			},
			{
				path: '/coinAdmin',
				component: resolve => require(['./components/pages/CoinAdmin.vue'], resolve),
				meta: {title: '提币管理'}
			},
			{
				path: '/coin',
				component: resolve => require(['./components/pages/Coin.vue'], resolve),
				meta: {title: '提币'}
			},
			{
				path: '/setting',
				component: resolve => require(['./components/pages/Setting.vue'], resolve),
				meta: {title: '个人设置'}
			},
			{
				path: '/404',
				component: resolve => require(['./components/pages/404.vue'], resolve),
				meta: {title: '404', requireAuth: true}
			}
		]
	}];
export default routers;
