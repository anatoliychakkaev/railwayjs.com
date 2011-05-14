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
        pagePath = '/'
    else
        pagePath = @path.replace(/[^\/]+$/, '')

    Object.keys(Page.index).forEach (path) ->
         if path.search(pagePath) != -1
             if path.replace(pagePath, '').search('/') == -1
                result.push(Page.index[path])
    result

Page.prototype.htmlContent = ->
    require('markdown-js').makeHtml @content

Page.pathCommentable = (path) ->
    !!Page.index[path]

Page.prototype.loadComments = (done) ->
    Comment.find {path: @path}, (err, comments) =>
        @comments = (comments || []).sort (y, x) ->
            x.date.getTime() - y.date.getTime()
        done()
