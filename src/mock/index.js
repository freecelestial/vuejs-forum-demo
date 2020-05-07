import Mock from 'mockjs'
import store from '../store'

// 拦截 活跃用户请求('/users/active') 并返回相关数据
/* 
    Mock.mock(rurl, rtype, function(options))
    当拦截到匹配 rurl 和 rtype 的 Ajax 请求时，
    函数 function(options) 将被执行，并把执行结果作为响应数据返回，
    可以通过 options.body 访问相关传参
    
*/
Mock.mock('/users/active', 'get', () => {
    // 使用派生状态 computedArticles
    let articles = store.getters.computedArticles
    let comments = []
    let usersObj = {}
    // 活跃用户
    let activeUsers = []

    articles.map((article) => {
        const articleComments = Array.isArray(article.comments) ? article.comments : []
        // 合并评论，等价于 comments = comments.concat(articleComments)
        comments = [...comments, ...articleComments]
    })

    // 统计用户发布评论的数量，并加入头像連結於comments ，返回 usersObj (含用戶訊息的評論)
    // reduce 接收一個 callback ， 第一個參數是總計(物件集合)，第二個參數是目前的值(物件)
    usersObj = comments.reduce((accumulator, currentValue) => {
        accumulator[currentValue.uname] = accumulator[currentValue.uname] || {}
        accumulator[currentValue.uname].avatar = currentValue.uavatar
        accumulator[currentValue.uname].num = ++accumulator[currentValue.uname].num || 1
        return accumulator
    }, {})

    // 将统计后的数据放入一个数组
    for (const [key, value] of Object.entries(usersObj)) {
        activeUsers.push({
            name: key,
            avatar: value.avatar,
            num: value.num
        })
    }

    // 将发布评论最多的用户排在前面
    activeUsers.sort((a, b) => b.num - a.num)
    // 取前 8 个发布评论最多的用户
    activeUsers = activeUsers.slice(0, 8)

    return activeUsers

    /* 
    上面的 activeUsers 返回类似如下的数组：
    [
        {
            "name": "Kimberly",
            "avatar": "https://api.adorable.io/avatars/200/Kimberly",
            "num": 11
        },
        {
            "name": "Mary",
            "avatar": "https://api.adorable.io/avatars/200/Mary",
            "num": 8
        },
        {
            "name": "Melissa",
            "avatar": "https://api.adorable.io/avatars/200/Melissa",
            "num": 7
        }
    ]
    */

})



// 拦截最热文章请求并返回相关数据，请求方法为 POST
Mock.mock('/articles/hot', 'post', (options) => {
    // 将评论最少的文章排在前面
    let filteredArticles = store.getters.getArticlesByFilter('noreply')
    // 将评论最多的文章排在前面
    let articles = filteredArticles.reverse()
    // 取 7 天内评论最多的文章
    let hotArticles = articles.filter((article) => (new Date() - new Date(article.date) < 604800000))
    // 要取出的文章条数
    let num
    // 请求有传 num 时使用它
    // options.body 的值是字符串类型的数据，用 JSON.parse 转换成物件
    if (options.body) {
        try {
            num = JSON.parse(options.body).num
        } catch (e) {}
    }
  
    // 取前 num 条评论最多的文章，默认 10 条
    hotArticles = hotArticles.slice(0, num || 10)
  
    return hotArticles

    /* 
    上面的 activeUsers 返回类似如下的数组：
    [
        {
            "uid": 2,
            "articleId": 2,
            "title": "命相五经展由造再习设件同火压达六料林",
            "content": "复想到中路光这交少五打么增走支眼各。江给成花元局强非美如动识应地没资。总管全放价毛代外离须经到称。西利世主单果向国收金图整。政所专收三接龙问斗西备界节生话老。",
            "date": "2018-04-05T09:24:54.580Z",
            "likeUsers": [],
            "comments": [],
            "uname": "Jessica",
            "uavatar": "https://api.adorable.io/avatars/200/Jessica"
        }
    ]
    */
})