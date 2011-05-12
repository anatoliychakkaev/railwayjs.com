action("page", function () {
    var path = req.params[0];
    var page = Page.index[path];
    if (page) {
        render({
            title: page.title,
            page: page
        });
    } else {
        redirect('/pages/new?path=' + path);
        // send("No routes matched with " + path);
    }
});
