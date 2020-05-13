// 返回添加用戶信息後的所有文章
// 在需要的地方，我們可以使用 store.getters.computedArticles 來代替 store.state.articles
export const computedArticles = (state) => {
    let articles = state.articles
    let newArticles = []

    // 添加用戶信息，參數 isCurrentUser 代表是否是當前用戶
    const addUserInfo = function(isCurrentUser) {
        // 當前登入用戶資料
        const userName = state.user && state.user.name
        const userAvatar = state.user && state.user.avatar
        const avatarUrl = 'https://api.adorable.io/avatars/200/'

        // 是當前用戶時，設置用戶數據爲當前用戶的信息
        if (isCurrentUser) {
            this.uname = userName
            this.uavatar = userAvatar
        } else {
            // 不是當前用戶時，設置用戶數據爲對象裏用戶的信息
            // 測試資料已有 uname 不用再添加
            this.uavatar = `${avatarUrl}${this.uname}`
        }
    }

    if (Array.isArray(articles)) {
        // 深拷貝 articles 以不影響其原值
        newArticles = JSON.parse(JSON.stringify(articles))
        newArticles.forEach((article) => {
            const comments = article.comments
            const likeUsers = article.likeUsers

            // 添加用戶信息到文章(因測試和手動增加的文章格式不同而區分)
            if (article.uid === 1) {
                addUserInfo.call(article, true)
            } else {
                addUserInfo.call(article)
            }

            // 添加用戶信息到評論
            if (Array.isArray(comments)) {
                comments.forEach((comment) => {
                    if (comment.uid === 1) {
                        addUserInfo.call(comment, true)
                    } else {
                        addUserInfo.call(comment)
                    }
                })
            }

            // 添加用戶信息到點贊
            if (Array.isArray(likeUsers)) {
                likeUsers.forEach((likeUser) => {
                    if (likeUser.uid === 1) {
                        addUserInfo.call(likeUser, true)
                    } else {
                        addUserInfo.call(likeUser)
                    }
                })
            }
        })
    }

    return newArticles
}

// 返回指定 uid 下的所有文章
// 參數 uid 是用戶 ID，user 是用戶名，傳入任一參數可取得該用戶的所有文章
// 第二個參數是 getters，通過它可以訪問倉庫的派生狀態。
export const getArticlesByUid = (state, getters) => (uid, user) => {
    // 使用派生狀態 computedArticles 作爲所有文章
    let articles = getters.computedArticles
  
    if (Array.isArray(articles)) {
        // 有用戶名時遍歷所有文章
        // 通過 http://localhost:8080/:user 這類地址訪問『個人專欄』的時候
        // 路由是不帶 uid 參數的，我們需要通過 user 參數找到 uid
        if (user) {
            for (const article of articles) {
                if (article.uname === user) {
                    // 指定 uid 爲文章上的 uid
                    uid = article.uid
                    break
                }
            }
        }
    
        // 使用指定 uid 過濾所有文章
        articles = articles.filter(article => parseInt(uid) === parseInt(article.uid))
    } else {
        articles = []
    }
  
    return articles
}


// 返回使用 filter 參數排序後的所有文章
export const getArticlesByFilter = (state, getters) => (filter) => {
    // 使用派生狀態 computedArticles 作爲所有文章
    let articles = getters.computedArticles
    let filteredArticles = []

    if (Array.isArray(articles)) {
        // 深拷貝 articles 以不影響其原值
        filteredArticles = articles.map(article => ({ ...article }))

        switch(filter) {
            case 'excellent':
                // 將當前用戶的文章設置爲精華文章
                filteredArticles = getters.getArticlesByUid(1)
            break
            case 'vote':
                // 將讚的最多的文章排在前面
                // 參數 a,b 代表取出第一個和第二個 article ，用於比較
                // 當回傳值小於 0，則會把 a 排在小於 b 之索引的位置，即 a 排在 b 前面。
                filteredArticles.sort((a, b) => {
                    const alikeUsers = Array.isArray(a.likeUsers) ? a.likeUsers : []
                    const blikeUsers = Array.isArray(b.likeUsers) ? b.likeUsers : []

                    return blikeUsers.length - alikeUsers.length
                })

            break
            case 'recent':
                // 將最新寫的文章排在前面
                filteredArticles.reverse()
            break
            case 'noreply':
                // 將評論最少的文章排在前面
                filteredArticles.sort((a, b) => {
                    const aComments = Array.isArray(a.comments) ? a.comments : []
                    const bComments = Array.isArray(b.comments) ? b.comments : []

                    return aComments.length - bComments.length
                })

            break
            default:
                // 默認將回復時間最新的文章排在前面
                filteredArticles.sort((a, b) => {
                    const aComments = Array.isArray(a.comments) ? a.comments : []
                    const bComments = Array.isArray(b.comments) ? b.comments : []
                    const aCommentsLength = aComments.length
                    const bCommentsLength = bComments.length

                    if (aCommentsLength > 0) {
                        if (bCommentsLength > 0) {
                            return new Date(bComments[bCommentsLength - 1].date) - 
                            new Date(aComments[aCommentsLength - 1].date)
                        } else {
                            return -1
                        }
                    } else {
                        return 1
                    }
                })

            break
        }
    }

    return filteredArticles
}


// 根據關鍵字 keyword 返回搜索結果
export const getArticlesByKeyword = (state, getters) => (keyword, filter) => {
    let articles = getters.computedArticles
    // 搜索結果
    let results = []
  
    if (Array.isArray(articles)) {
        articles.forEach((article) => {
            let { articleId, title, content } = article
            // 該正則表示文章標題或內容中的關鍵字
            // g: global 的意思，找到之後會繼續往後配對
            // i: case insensitive 的意思
            const regex = new RegExp(`(${keyword})`, 'gi')
    
            if (title.indexOf(keyword) !== -1 || content.indexOf(keyword) !== -1) {
                // url 是文章中沒有的數據，我們結合 articleId 拼出完整的路徑
                const url = `${state.origin}/articles/${articleId}/content`
                // 給文章標題中的關鍵字加上高亮，$1 匹配到的第一個內容
                title = title.replace(regex, '<span class="highlight">$1</span>')
                // 給文章內容中的關鍵字加上高亮，只取內容前 100 個字
                content = content.substr(0, 100).replace(regex, '<span class="highlight">$1</span>')
                // 等價於 results.push(Object.assign({}, article, { url: url, title: title, content: content })) 
                results.push({...article, ...{ url, title, content }})
            }
        })
    }

    
    // 評估排序方式
    switch (filter) {
        case 'vote':
            // 將讚的最多的文章排在前面
            results.sort((a, b) => {
                const alikeUsers = Array.isArray(a.likeUsers) ? a.likeUsers : []
                const blikeUsers = Array.isArray(b.likeUsers) ? b.likeUsers : []

                return blikeUsers.length - alikeUsers.length
            })

        break
        default:
            // 默認將標題中含有關鍵字的文章排在前面
            results.sort((a, b) => a.title.indexOf(keyword) < b.title.indexOf(keyword))
    }



    return results
}