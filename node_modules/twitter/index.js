var oauth = require('oauth');
var sys = require('sys');

var _twitterConsumerKey;
var _twitterConsumerSecret;
var _host;
var _apiHost = 'http://twitter.com';
var _apiSecureHost = 'https://twitter.com';

function consumer () {
    return new oauth.OAuth(
        _apiHost + "/oauth/request_token", _apiSecureHost + "/oauth/access_token",
        _twitterConsumerKey, _twitterConsumerSecret, "1.0A", _host + "/twitter_callback", "HMAC-SHA1");
}

function redirectBack (req, res, flash) {
    var location = req.session && req.session.beforeTwitterAuth || '/';
    console.log('redirect to', location);
    delete req.session.beforeTwitterAuth;
    if (flash) {
        if (flash.error) {
            req.flash('error', flash.error);
        } else if (flash.info) {
            req.flash('info', flash.info);
        }
    }
    res.redirect(location);
}

exports.init = function () {
    try {
        var settings = require('yaml').eval(require('fs').readFileSync(app.root + '/config/twitter.yml').toString('utf8'))[app.settings.env];
    } catch (e) {
        console.log('Could not init twitter extension, env-specific settings not found in config/twitter.yml');
        console.log('Error:', e.message);
    }
    if (settings) {
        _twitterConsumerKey = settings.key;
        _twitterConsumerSecret = settings.secret;
        _host = settings.url;

        app.get('/twitter_connect', function (req, res) {
            console.log(req.headers);
            req.session.beforeTwitterAuth = req.headers.referer;
            console.log('save referer:', req.session.beforeTwitterAuth);
            delete req.session.twitter;
            consumer().getOAuthRequestToken(gotToken);

            function gotToken (error, oauthToken, oauthTokenSecret, results) {
                if (error) {
                    redirectBack(req, res, {error: "Error getting OAuth request token : " + sys.inspect(error)});
                } else {
                    req.session.twitter = {
                        oauthRequestToken: oauthToken,
                        oauthRequestTokenSecret: oauthTokenSecret
                    };
                    console.log('got new token');
                    res.redirect(_apiSecureHost + "/oauth/authorize?oauth_token=" + oauthToken);
                }
            }
        });

        app.get('/twitter_callback', function (req, res) {
            console.log('callback');
            consumer().getOAuthAccessToken(
                req.session.twitter.oauthRequestToken,
                req.session.twitter.oauthRequestTokenSecret,
                req.query.oauth_verifier,
                twitterCallback
            );

            function twitterCallback (error, oauthAccessToken, oauthAccessTokenSecret, results) {
                if (error) {
                    res.send("Error getting OAuth access token : " + sys.inspect(error), 500);
                    return;
                }
                consumer().get(
                    _apiHost + "/account/verify_credentials.json",
                    oauthAccessToken,
                    oauthAccessTokenSecret,
                    gotData);

                function gotData (error, data, response) {
                    if (error) {
                        redirectBack(req, res, {error: "Error getting twitter screen name : " + sys.inspect(error)});
                        console.log('gotData:', error);
                    } else {
                        if (typeof data === 'string') {
                            data = JSON.parse(data);
                        }
                        req.session.twitter = data;
                        req.session.twitter.oauthAccessToken = oauthAccessToken;
                        req.session.twitter.oauthAccessTokenSecret = oauthAccessTokenSecret;
                        console.log(req.session.twitter);
                        redirectBack(req, res);
                    }
                }
            }
        });
    }
};
