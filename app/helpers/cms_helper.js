module.exports = {
    menu: function (currentPage) {
        var html = [];
        currentPage.siblings().forEach(function (page) {
            if (page.path == currentPage.path) {
                html.push('<li class="active">' + page.title + '</li>');
            } else {
                html.push('<li><a href="' + page.path + '">' + page.title + '</a></li>');
            }
        });
        return '<ul>' + html.join('') + '</ul>';
    }
};
