export default [
    {
        path: '/auth/register',
        name: 'Register',
        component: () => import('@/views/auth/Register')
    },
    {
        path: '/',
        name: 'Home',
        alias: '/topics',
        component: () => import('@/views/Home')
    },
    {
        path: '*',
        redirect: '/'
    },
    {
        path: '/auth/login',
        name: 'Login',
        component: () => import('@/views/auth/Login')
    },
    {
        path: '/users/1/edit',
        //name: 'EditUsers',
        component: () => import('@/views/users/Edit.vue'),
        // 子路由的配置
        children: [
            {
                // 子路由的 path 为空值 ''，表示该页面作为默认子路由，
                // 在导航到父级路由（/users/1/edit）时，就自動加载
                path: '',
                name: 'EditProfile',
                component: () => import('@/views/users/Profile.vue'),
                // auth 为 true，表示此路由需要登入才能访问
                meta: { auth: true }
            },
            {
                path: '/users/1/edit_avatar',
                name: 'EditAvatar',
                component: () => import('@/views/users/Avatar.vue'),
                meta: { auth: true }
            },
            {
                path: '/users/1/edit_password',
                name: 'EditPassword',
                component: () => import('@/views/users/Password.vue'),
                meta: { auth: true }
            }
        ]
    },
    {
        path: '/articles/create',
        name: 'Create',
        component: () => import('@/views/articles/Create'),
        meta: { auth: true }
    },
    {
        // 冒号开头，代表的是该项参数是动态的
        path: '/articles/:articleId/edit',
        name: 'Edit',
        // 跟 Create 一样的组件页面
        component: () => import('@/views/articles/Create'),
        meta: { auth: true }
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('@/views/Search')
    },
    {
        // 动态路径参数 :user，用来匹配用户名
        // 去掉父路由的 name
        // 使用名称导航时，我们应该使用默认子路由的名称
        path: '/:user',
        component: () => import('@/views/articles/Column'),
        children: [
            {
                path: '',
                name: 'Column',
                component: () => import('@/views/articles/List.vue')
            },
            {
                path: '/articles/:articleId/content',
                name: 'Content',
                component: () => import('@/views/articles/Content.vue')
            }
        ]
    },




]