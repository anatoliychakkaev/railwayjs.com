load('application')

action("page", function () {
    var path = req.params[0];
    var page = Page.index[path];
    if (page) {
        if (page.comments) {
            done();
        } else {
            page.loadComments(done);
        }
    } else {
        redirect('/pages/new?path=' + path);
    }
    function done () {
        render({
            title: page.title,
            page: page
        });
    }
});
