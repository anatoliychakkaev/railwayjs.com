action('create', function () {
    var path = req.body.path
    if (!Page.pathCommentable(path)) {
        return error('/');
    }
    var author = req.session.twitter,
        authorName = author.name || author.screen_name;

    req.comment = new Comment({
        author: authorName,
        text: req.body.text,
        path: path,
        twid: author.id,
        pic: author.profile_image_url,
        date: new Date()
    });
    req.comment.save(function (errors) {
        if (errors) {
            return error();
        } else {
            flash('info', 'Comment created');
            var page = Page.index[path];
            page.loadComments(function () {
                redirect(app.config.url + path + '#discussion');
                app.extensions.mailer.sendEmail('comment', {
                    comment: req.comment,
                    author: author,
                    page: page
                }, {
                    email: app.config.email,
                    subject: authorName + ' commented on ' + page.title
                });
            });
        }
    });

    function error (path) {
        flash('error', 'Comment can not be created');
        redirect(path);
    }
});

action('destroy', function () {
    Comment.findById(req.param('id'), function (err, comment) {
        if (comment && req.session.twitter && req.session.twitter.id == comment.twid) {
            var page = Page.index[comment.path];
            comment.remove(function () {
                page.loadComments(function () {
                    send('location.href = location.href');
                });
            });
        } else {
            send('');
        }
    });
});
