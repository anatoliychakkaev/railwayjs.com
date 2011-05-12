exports.routes = function (map) {
    map.resources('pages');
    map.post('/pages/reorder', 'pages#reorder');

    map.get(/^(.*)$/, 'cms#page');
};
