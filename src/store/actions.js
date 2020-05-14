import router from '../router'

export const post = ({ commit, state }, { article, articleId }) => {
    // 從倉庫獲取所有文章
    let articles = state.articles

    // 沒有文章時，建一個空數組
    if (!Array.isArray(articles)) articles = []

    if (article) {
        // 因爲是單用戶，所以指定用戶 ID 爲 1
        const uid = 1
        const { title, content } = article
        // 為每一篇文章加入創建日期
        const date = new Date()

        // 如果沒傳 articleId，表示新建文章
        if (articleId === undefined) {
            const lastArticle = articles[articles.length - 1]

            if (lastArticle) {
                // 新的 articleId 是最後一篇文章的 articleId 加 1
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
            // articleId 若相同，直接修改該文章的標題和內容
            for (let article of articles) {
                if (parseInt(article.articleId) === parseInt(articleId)) {
                    article.title = title
                    article.content = content
                    break
                }
            }

        }

        commit('UPDATE_ARTICLES', articles)
        // 附帶 articleId 和 showMsg 參數
        router.push({ name: 'Content', params: { articleId, showMsg: true } })

    }else {

        // 遍歷所有文章
        for (let article of articles) {
            // 找到與 articleId 對應的文章
            if (parseInt(article.articleId) === parseInt(articleId)) {
                // 刪除對應的文章
                articles.splice(articles.indexOf(article), 1)
                break
            }
        }
        
        // 更新文章列表
        commit('UPDATE_ARTICLES', articles)
        // 跳轉到首頁，附帶 showMsg 參數，以指示首頁顯示一個消息提示
        router.push({ name: 'Column', params: { user:state.user.name,showMsg: true } })
    }
}


// 參數 articleId 是文章 ID；isAdd 爲 true 時點贊，爲 false 時取消贊
export const like = ({ commit, state }, { articleId, isAdd }) => {
    // 倉庫的文章
    let articles = state.articles
    // 點贊用戶列表
    let likeUsers = []
    // 用戶 ID，默認爲 1
    const uid = 1
  
    if (!Array.isArray(articles)) articles = []
  
    for (let article of articles) {
        // 找到對應文章時
        if (parseInt(article.articleId) === parseInt(articleId)) {
            // 取此 article 點贊用戶列表
            likeUsers = Array.isArray(article.likeUsers) ? article.likeUsers : likeUsers
    
            if (isAdd) {
                // 判斷是否已贊
                // some 可判斷陣列中是否至少有一個符合，即會回傳 true
                const isAdded = likeUsers.some(likeUser => parseInt(likeUser.uid) === uid)
        
                if (!isAdded) {
                    // 在點贊用戶列表中加入當前用戶
                    likeUsers.push({ uid })
                }
            } else {
                for (let likeUser of likeUsers) {
                    // 找到對應點贊用戶時
                    if (parseInt(likeUser.uid) === uid) {
                        // 刪除點贊用戶
                        likeUsers.splice(likeUsers.indexOf(likeUser), 1)
                        break
                    }
                }
            }
    
            // 更新文章的點贊用戶列表
            article.likeUsers = likeUsers
            break
        }
    }
  
    // 提交 UPDATE_ARTICLES 以更新所有文章
    commit('UPDATE_ARTICLES', articles)
    
    // 返回點贊用戶列表
    return likeUsers
}

// 參數 articleId 是文章 ID；comment 是評論內容；commentId 是評論 ID
export const comment = ({ commit, state }, { articleId, comment, commentId }) => {
    // 倉庫的文章
    let articles = state.articles
    // 評論列表
    let comments = []

    if (!Array.isArray(articles)) articles = []

    for (let article of articles) {
        // 找對應文章
        if (parseInt(article.articleId) === parseInt(articleId)) {
            // 更新評論列表
            comments = Array.isArray(article.comments) ? article.comments : comments

            if (comment) {
                // 獲取用戶傳入的評論內容，設置用戶 ID 的默認值爲 1
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

                    // 在評論列表中加入當前評論
                    comments.push({
                        uid,
                        commentId,
                        content,
                        date
                    })
                }else {
                    for (let comment of comments) {
                        // 找到對應的評論時
                        if (parseInt(comment.commentId) === parseInt(commentId)) {
                            // 更新評論的內容
                            comment.content = content
                            break
                        }
                    }
                }
            } else {
                // 刪除評論的時候不會有 comment 傳參
                for (let comment of comments) {
                    // 找到對應的評論時
                    if (parseInt(comment.commentId) === parseInt(commentId)) {
                        // 刪除這條評論
                        comments.splice(comments.indexOf(comment), 1)
                        break
                    }
                }
            }
            

            // 更新文章的評論列表
            article.comments = comments
            break
        }
    }

    // 提交 UPDATE_ARTICLES 以更新所有文章
    commit('UPDATE_ARTICLES', articles)
    // 返回評論列表
    return comments
}