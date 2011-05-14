action('create', function () {
    var path = req.body.path
    if (!Page.pathCommentable(path)) {
        return error('/');
    }
    req.comment = new Comment({
        text: req.body.text,
        path: path,
        date: new Date()
    });
    req.comment.save(function (errors) {
        if (errors) {
            return error();
        } else {
            flash('info', 'Comment created');
            Page.index[path].loadComments(function () {
                redirect(path);
            });
        }
    });

    function error (path) {
        flash('error', 'Comment can not be created');
        redirect(path);
    }
});
