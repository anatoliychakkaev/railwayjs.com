app.on('twitterConnect', function (user, req, res) {
    var location = req.session && req.session.beforeTwitterAuth || '/';
    delete req.session.beforeTwitterAuth;
    res.redirect(location);
});
