loadPage = ->
    Page.findById req.params.id, (err, page) =>
        if err or !page
            redirect path_to.pages
        else
            @page = page
            next()

before loadPage,
    only: ['show', 'edit', 'update', 'destroy']

action 'new', ->
    @page = new Page
    @page.path = req.param('path') if req.param('path')?
    
    render title: 'New page'

action 'create', ->
    if Page.index[req.body.path]
        flash 'error', 'Page for this path already exists'
        render 'new', title: 'New page'
    else
        @page = new Page
        @page["title"]   = req.body["title"]
        @page["content"] = req.body["content"]
        @page["path"]    = req.body["path"]
        @page.save (errors) =>
            if errors
                flash 'error', 'Page can not be created'
                render 'new', title: 'New page'
            else
                flash 'info', 'Page created'
                Page.buildIndex =>
                    redirect @page.path

action 'index', ->
    @pages = Page.getSorted()

    if req.params.format == 'json'
        send @pages
    else
        render
            title: 'Pages index'

action 'show', ->
    render title: 'Page show'

action 'edit', ->
    render title: 'Page edit'

action 'update', ->
    if Page.index[req.body.path] && Page.index[req.body.path].id != @page.id
        flash 'error', 'Page can not be updated'
        render 'edit', title: 'Edit page details'
    else
        @page["title"]   = req.body["title"]
        @page["content"] = req.body["content"]
        @page["path"]    = req.body["path"]
        @page.save (err) =>
            if !err
                flash 'info', 'Page updated'
                Page.buildIndex =>
                    redirect @page.path
            else
                flash 'error', 'Page can not be updated'
                render 'edit', title: 'Edit page details'

action 'destroy', ->
    @page.remove (error) ->
        if error
            flash 'error', 'Can not destroy page'
        else
            flash 'info', 'Page successfully removed'

        Page.buildIndex () ->
            send "'" + path_to.pages + "'"

action 'reorder', ->
    wait = 0
    req.body.order.forEach (path, index) ->
        wait += 1
        Page.index[path].pos = index
        Page.index[path].save ->
            if --wait == 0
                Page.buildIndex ->
                    Page.getSorted().forEach (p) ->
                        console.log p.pos
                    send 'ok'
