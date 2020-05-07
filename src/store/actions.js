import router from '../router'

export const post = ({ commit, state }, { article, articleId }) => {
    // 从仓库获取所有文章
    let articles = state.articles

    // 没有文章时，建一个空数组
    if (!Array.isArray(articles)) articles = []

    if (article) {
        // 因为是单用户，所以指定用户 ID 为 1
        const uid = 1
        const { title, content } = article
        // 為每一篇文章加入創建日期
        const date = new Date()

        // 如果没传 articleId，表示新建文章
        if (articleId === undefined) {
            const lastArticle = articles[articles.length - 1]

            if (lastArticle) {
                // 新的 articleId 是最后一篇文章的 articleId 加 1
                articleId = parseInt(lastArticle.articleId) + 1
            } else {
                // 若無資料，直接用文章個數加 1
                articleId = articles.length + 1
            }

            articles.push({
                uid,
                articleId,
                title,
                content,
                date
            })
        }else{
            for (let article of articles) {
                if (parseInt(article.articleId) === parseInt(articleId)) {
                    article.title = title
                    article.content = content
                    break
                }
            }

        }

        commit('UPDATE_ARTICLES', articles)
        // 附带 articleId 和 showMsg 参数
        router.push({ name: 'Content', params: { articleId, showMsg: true } })

    }else {

        // 遍历所有文章
        for (let article of articles) {
            // 找到与 articleId 对应的文章
            if (parseInt(article.articleId) === parseInt(articleId)) {
                // 删除对应的文章
                articles.splice(articles.indexOf(article), 1)
                break
            }
        }
        
        // 更新文章列表
        commit('UPDATE_ARTICLES', articles)
        // 跳转到首页，附带 showMsg 参数，以指示首页显示一个消息提示
        router.push({ name: 'Home', params: { showMsg: true } })
    }
}


// 参数 articleId 是文章 ID；isAdd 为 true 时点赞，为 false 时取消赞
export const like = ({ commit, state }, { articleId, isAdd }) => {
    // 仓库的文章
    let articles = state.articles
    // 点赞用户列表
    let likeUsers = []
    // 用户 ID，默认为 1
    const uid = 1
  
    if (!Array.isArray(articles)) articles = []
  
    for (let article of articles) {
        // 找到对应文章时
        if (parseInt(article.articleId) === parseInt(articleId)) {
            // 取此 article 點贊用戶列表
            likeUsers = Array.isArray(article.likeUsers) ? article.likeUsers : likeUsers
    
            if (isAdd) {
                // 判斷是否已贊
                // some 可判斷陣列中是否至少有一個符合，即會回傳 true
                const isAdded = likeUsers.some(likeUser => parseInt(likeUser.uid) === uid)
        
                if (!isAdded) {
                    // 在点赞用户列表中加入当前用户
                    likeUsers.push({ uid })
                }
            } else {
                for (let likeUser of likeUsers) {
                    // 找到对应点赞用户时
                    if (parseInt(likeUser.uid) === uid) {
                        // 删除点赞用户
                        likeUsers.splice(likeUsers.indexOf(likeUser), 1)
                        break
                    }
                }
            }
    
            // 更新文章的点赞用户列表
            article.likeUsers = likeUsers
            break
        }
    }
  
    // 提交 UPDATE_ARTICLES 以更新所有文章
    commit('UPDATE_ARTICLES', articles)
    
    // 返回点赞用户列表
    return likeUsers
}

// 参数 articleId 是文章 ID；comment 是评论内容；commentId 是评论 ID
export const comment = ({ commit, state }, { articleId, comment, commentId }) => {
    // 仓库的文章
    let articles = state.articles
    // 评论列表
    let comments = []

    if (!Array.isArray(articles)) articles = []

    for (let article of articles) {
        // 找对应文章
        if (parseInt(article.articleId) === parseInt(articleId)) {
            // 更新评论列表
            comments = Array.isArray(article.comments) ? article.comments : comments

            if (comment) {
                // 获取用户传入的评论内容，设置用户 ID 的默认值为 1
                const { uid = 1, content } = comment
                const date = new Date()

                if (commentId === undefined) {
                    const lastComment = comments[comments.length - 1]

                    // 新建 commentId
                    if (lastComment) {
                        commentId = parseInt(lastComment.commentId) + 1
                    } else {
                        commentId = comments.length + 1
                    }

                    // 在评论列表中加入当前评论
                    comments.push({
                        uid,
                        commentId,
                        content,
                        date
                    })
                }else {
                    for (let comment of comments) {
                        // 找到对应的评论时
                        if (parseInt(comment.commentId) === parseInt(commentId)) {
                            // 更新评论的内容
                            comment.content = content
                            break
                        }
                    }
                }
            } else {
                // 删除评论的时候不会有 comment 传参
                for (let comment of comments) {
                    // 找到对应的评论时
                    if (parseInt(comment.commentId) === parseInt(commentId)) {
                        // 删除这条评论
                        comments.splice(comments.indexOf(comment), 1)
                        break
                    }
                }
            }
            

            // 更新文章的评论列表
            article.comments = comments
            break
        }
    }

    // 提交 UPDATE_ARTICLES 以更新所有文章
    commit('UPDATE_ARTICLES', articles)
    // 返回评论列表
    return comments
}