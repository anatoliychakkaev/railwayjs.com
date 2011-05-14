var app = module.exports = require('express').createServer();
require("./.railway/lib/onrailway").init(app);

if (!module.parent) {
    app.listen(1602);
    console.log("Express server listening on port %d", app.address().port)
}
