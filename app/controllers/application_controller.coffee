loadUser = ->
    if req.headers.authorization and req.headers.authorization.search('Basic ') == 0
        creds = new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString()
        if creds == app.config.admin
            req.session.user = true
    @user = !!req.session.user
    next()

before loadUser

publish 'userRequired', ->
    if @user
        next()
    else
        console.log 'Unable to authenticate user ' + req.headers.authorization
        response.header 'WWW-Authenticate', 'Basic realm="Admin Area"'
        send 'Authentication required', 401
