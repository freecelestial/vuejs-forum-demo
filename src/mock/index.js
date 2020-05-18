import Mock from 'mockjs'
import store from '../store'

// 攔截 活躍用戶請求('/users/active') 並返回相關數據
/* 
    Mock.mock(rurl, rtype, function(options))
    當攔截到匹配 rurl 和 rtype 的 Ajax 請求時，
    函數 function(options) 將被執行，並把執行結果作爲響應數據返回，
    可以通過 options.body 訪問相關傳參
    
*/
Mock.mock('/users/active', 'get', () => {
    // 使用派生狀態 computedArticles
    let articles = store.getters.computedArticles
    let comments = []
    // 用戶發佈評論的數量
    let usersObj = {}
    // 活躍用戶
    let activeUsers = []

    articles.map((article) => {
        const articleComments = Array.isArray(article.comments) ? article.comments : []
        // 合併評論，等於 comments = comments.concat(articleComments)
        comments = [...comments, ...articleComments]
    })

    /*
        comments 格式
        [
            {
            commentId: 8
            content: "dfsdsfdsf"
            date: "2020-05-16T03:43:38.222Z"
            uavatar: "https://api.adorable.io/avatars/200/jim.png"
            uid: 1
            uname: "qwe"
            }
        ]
    */

    // 統計用戶發佈評論的數量，並加入頭像連結於comments ，返回 usersObj (含用戶訊息的評論)
    // reduce 第一個參數是 callback 函數，第二個參數是 currentValue 的初始值 {}
    // accumulator 是總計(物件集合，無陣列)，currentValue 是目前的值(物件)
    usersObj = comments.reduce((accumulator, currentValue) => {
        accumulator[currentValue.uname] = accumulator[currentValue.uname] || {}
        accumulator[currentValue.uname].avatar = currentValue.uavatar
        accumulator[currentValue.uname].num = ++accumulator[currentValue.uname].num || 1
        return accumulator
    }, {})

    // 將統計後的數據放入一個數組
    for (const [key, value] of Object.entries(usersObj)) {
        activeUsers.push({
            name: key,
            avatar: value.avatar,
            num: value.num
        })
    }

    // 將發佈評論最多的用戶排在前面
    activeUsers.sort((a, b) => b.num - a.num)
    // 取前 8 個發佈評論最多的用戶
    activeUsers = activeUsers.slice(0, 8)

    return activeUsers

    /* 
    上面的 activeUsers 返回類似如下的數組：
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



// 攔截最熱文章請求並返回相關數據，請求方法爲 POST
Mock.mock('/articles/hot', 'post', (options) => {
    // 將評論最少的文章排在前面
    let filteredArticles = store.getters.getArticlesByFilter('noreply')
    // 將評論最多的文章排在前面
    let articles = filteredArticles.reverse()
    // 取 7 天內評論最多的文章
    let hotArticles = articles.filter((article) => (new Date() - new Date(article.date) < 604800000))
    // 要取出的文章條數
    let num
    // 請求有傳 num 時使用它
    // options.body 的值是字符串類型的數據，用 JSON.parse 轉換成物件
    if (options.body) {
        try {
            num = JSON.parse(options.body).num
        } catch (e) {}
    }
  
    // 取前 num 條評論最多的文章，默認 5 條
    hotArticles = hotArticles.slice(0, num || 5)
  
    return hotArticles

    /* 
    上面的 activeUsers 返回類似如下的數組：
    [
        {
            "uid": 2,
            "articleId": 2,
            "title": "命相五經展由造再習設件同火壓達六料林",
            "content": "復想到中路光這交少五打麼增走支眼各。江給成花元局強非美如動識應地沒資。總管全放價毛代外離須經到稱。西利世主單果向國收金圖整。政所專收三接龍問鬥西備界節生話老。",
            "date": "2018-04-05T09:24:54.580Z",
            "likeUsers": [],
            "comments": [],
            "uname": "Jessica",
            "uavatar": "https://api.adorable.io/avatars/200/Jessica"
        }
    ]
    */
})