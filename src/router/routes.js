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
                // 子路由的 path 爲空值 ''，表示該頁面作爲默認子路由，
                // 在導航到父級路由（/users/1/edit）時，就自動加載
                path: '',
                name: 'EditProfile',
                component: () => import('@/views/users/Profile.vue'),
                // auth 爲 true，表示此路由需要登入才能訪問
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
        // 冒號開頭，代表的是該項參數是動態的
        path: '/articles/:articleId/edit',
        name: 'Edit',
        // 跟 Create 一樣的組件頁面
        component: () => import('@/views/articles/Create'),
        meta: { auth: true }
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('@/views/Search')
    },
    {
        // 動態路徑參數 :user，用來匹配用戶名
        // 去掉父路由的 name
        // 使用名稱導航時，我們應該使用默認子路由的名稱
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