Comment.prototype.timeAgo = function () {
    var diffSec = (new Date - this.date) / 1000;
    if (diffSec < 60) {
        return 'few seconds ago';
    } else if (diffSec < 3600) {
        return p(Math.round(diffSec / 60), 'minute') + ' ago';
    } else if (diffSec < 86400) {
        return p(Math.round(diffSec / 3600), 'hour') + ' ago';
    } else if (diffSec < 86400 * 7) {
        return p(Math.round(diffSec / 86400), 'day') + ' ago';
    } else if (diffSec < 86400 * 30.4) {
        return p(Math.round(diffSec / (7 * 86400)), 'week') + ' ago';
    } else {
        return p(Math.round(diffSec / (30.4 * 86400)), 'month') + ' ago';
    }

    function p (n, word) {
        if (n > 1) {
            word += 's';
        }
        return n + ' ' + word;
    }
};

Comment.prototype.htmlContent = function () {
    return require('markdown-js').makeHtml(app.helpers.sanitize(this.text));
};
