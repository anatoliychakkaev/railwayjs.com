var app = module.exports = require('express').createServer();
require("./.railway/lib/onrailway").init(app);

if (!module.parent) {
    app.listen(app.settings.env == 'development' ? 8008 : 8808);
    console.log("Express server listening on port %d", app.address().port)
}
