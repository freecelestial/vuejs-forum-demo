// 返回添加用户信息后的所有文章
// 在需要的地方，我们可以使用 store.getters.computedArticles 来代替 store.state.articles
export const computedArticles = (state) => {
    let articles = state.articles
    let newArticles = []

    // 添加用户信息，参数 isCurrentUser 代表是否是当前用户
    const addUserInfo = function(isCurrentUser) {
        // 當前登入用戶資料
        const userName = state.user && state.user.name
        const userAvatar = state.user && state.user.avatar
        const avatarUrl = 'https://api.adorable.io/avatars/200/'

        // 是当前用户时，设置用户数据为当前用户的信息
        if (isCurrentUser) {
            this.uname = userName
            this.uavatar = userAvatar
        } else {
            // 不是当前用户时，设置用户数据为对象里用户的信息
            // 測試資料已有 uname 不用再添加
            this.uavatar = `${avatarUrl}${this.uname}`
        }
    }

    if (Array.isArray(articles)) {
        // 深拷贝 articles 以不影响其原值
        newArticles = JSON.parse(JSON.stringify(articles))
        newArticles.forEach((article) => {
            const comments = article.comments
            const likeUsers = article.likeUsers

            // 添加用户信息到文章(因測試和手動增加的文章格式不同而區分)
            if (article.uid === 1) {
                addUserInfo.call(article, true)
            } else {
                addUserInfo.call(article)
            }

            // 添加用户信息到评论
            if (Array.isArray(comments)) {
                comments.forEach((comment) => {
                    if (comment.uid === 1) {
                        addUserInfo.call(comment, true)
                    } else {
                        addUserInfo.call(comment)
                    }
                })
            }

            // 添加用户信息到点赞
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
// 参数 uid 是用户 ID，user 是用户名，傳入任一參數可取得該用戶的所有文章
// 第二个参数是 getters，通过它可以访问仓库的派生状态。
export const getArticlesByUid = (state, getters) => (uid, user) => {
    // 使用派生状态 computedArticles 作为所有文章
    let articles = getters.computedArticles
  
    if (Array.isArray(articles)) {
        // 有用户名时遍历所有文章
        // 通过 http://localhost:8080/:user 这类地址访问『个人专栏』的时候
        // 路由是不带 uid 参数的，我们需要通过 user 参数找到 uid
        if (user) {
            for (const article of articles) {
                if (article.uname === user) {
                    // 指定 uid 为文章上的 uid
                    uid = article.uid
                    break
                }
            }
        }
    
        // 使用指定 uid 过滤所有文章
        articles = articles.filter(article => parseInt(uid) === parseInt(article.uid))
    } else {
        articles = []
    }
  
    return articles
}


// 返回使用 filter 参数排序后的所有文章
export const getArticlesByFilter = (state, getters) => (filter) => {
    // 使用派生状态 computedArticles 作为所有文章
    let articles = getters.computedArticles
    let filteredArticles = []

    if (Array.isArray(articles)) {
        // 深拷贝 articles 以不影响其原值
        filteredArticles = articles.map(article => ({ ...article }))

        switch(filter) {
            case 'excellent':
                // 将当前用户的文章设置为精华文章
                filteredArticles = getters.getArticlesByUid(1)
            break
            case 'vote':
                // 将赞的最多的文章排在前面
                // 參數 a,b 代表取出第一個和第二個 article ，用於比較
                // 當回傳值小於 0，則會把 a 排在小於 b 之索引的位置，即 a 排在 b 前面。
                filteredArticles.sort((a, b) => {
                    const alikeUsers = Array.isArray(a.likeUsers) ? a.likeUsers : []
                    const blikeUsers = Array.isArray(b.likeUsers) ? b.likeUsers : []

                    return blikeUsers.length - alikeUsers.length
                })

            break
            case 'recent':
                // 将最新写的文章排在前面
                filteredArticles.reverse()
            break
            case 'noreply':
                // 将评论最少的文章排在前面
                filteredArticles.sort((a, b) => {
                    const aComments = Array.isArray(a.comments) ? a.comments : []
                    const bComments = Array.isArray(b.comments) ? b.comments : []

                    return aComments.length - bComments.length
                })

            break
            default:
                // 默认将回复时间最新的文章排在前面
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


// 根据关键字 keyword 返回搜索结果
export const getArticlesByKeyword = (state, getters) => (keyword, filter) => {
    let articles = getters.computedArticles
    // 搜索结果
    let results = []
  
    if (Array.isArray(articles)) {
        articles.forEach((article) => {
            let { articleId, title, content } = article
            // 该正则表示文章标题或内容中的关键字
            // g: global 的意思，找到之後會繼續往後配對
            // i: case insensitive 的意思
            const regex = new RegExp(`(${keyword})`, 'gi')
    
            if (title.indexOf(keyword) !== -1 || content.indexOf(keyword) !== -1) {
                // url 是文章中没有的数据，我们结合 articleId 拼出完整的路径
                const url = `${state.origin}/articles/${articleId}/content`
                // 给文章标题中的关键字加上高亮，$1 匹配到的第一個内容
                title = title.replace(regex, '<span class="highlight">$1</span>')
                // 给文章内容中的关键字加上高亮，只取内容前 100 个字
                content = content.substr(0, 100).replace(regex, '<span class="highlight">$1</span>')
                // 等价于 results.push(Object.assign({}, article, { url: url, title: title, content: content })) 
                results.push({...article, ...{ url, title, content }})
            }
        })
    }

    
    // 评估排序方式
    switch (filter) {
        case 'vote':
            // 将赞的最多的文章排在前面
            results.sort((a, b) => {
                const alikeUsers = Array.isArray(a.likeUsers) ? a.likeUsers : []
                const blikeUsers = Array.isArray(b.likeUsers) ? b.likeUsers : []

                return blikeUsers.length - alikeUsers.length
            })

        break
        default:
            // 默认将标题中含有关键字的文章排在前面
            results.sort((a, b) => a.title.indexOf(keyword) < b.title.indexOf(keyword))
    }



    return results
}