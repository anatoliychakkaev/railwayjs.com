var app = module.exports = require("./.railway/lib/onrailway").createServer();

if (!module.parent) {
    app.listen(app.settings.env == 'development' ? 8008 : 8808);
    console.log("Express server listening on port %d", app.address().port)
}
