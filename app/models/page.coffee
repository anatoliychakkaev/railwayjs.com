Page.buildIndex = (callback) ->
    byPosition = (x, y) ->
        x = parseInt(x.pos, 10)
        y = parseInt(y.pos, 10)
        return 0 if isNaN(x) or isNaN(y)
        x - y

    Page.find (err, pages) ->
        Page.index = {}
        if pages
            pages.sort(byPosition).forEach (page) ->
                Page.index[page.path] = page
        callback() if callback

Page.getSorted = ->
    pages = []
    Object.keys(Page.index).forEach (path) ->
        pages.push(Page.index[path])
    pages

Page.prototype.siblings = ->
    result = []
    if @path == '/'
        path = '/'
    else
        path = @path.replace(/[^\/]+$/, '')

    Object.keys(Page.index).forEach (pagePath) ->
         if pagePath.search(path) != -1
             if pagePath.replace(path, '').search('/') == -1
                result.push(Page.index[pagePath])
    result

Page.prototype.htmlContent = ->
    require('markdown-js').makeHtml @content

Page.pathCommentable = (path) ->
    !!Page.index[path]

Page.prototype.loadComments = (done) ->
    Comment.find {patpath: @path}, (err, comments) =>
        @comments = (comments || []).sort (y, x) ->
            x.date.getTime() - y.date.getTime()
        done()
