'use strict';

var connectOnce = require('connect-once');

var raven = require('raven');
var sentry = new raven.Client(process.env.SENTRY);
sentry.patchGlobal(function () {
    console.log('Bye, bye, world.');
    process.exit(1);
});

var db;

var MongoClient = require('mongodb').MongoClient;
var connection = new connectOnce({
    retries: 60,
    reconnectWait: 1000
}, (process.env.MONGODB ? MongoClient.connect : function (cs, cb) { }), process.env.MONGODB);

connection.when('available', function (err, _db) {
    if (err) {
        sentry.captureError(err, function (result) {
            console.log(sentry.getIdent(result));
        });
    } else {
        db = _db;
    }
});

module.exports = {
    log: function (message) {
        if (!db) {
            sentry.captureMessage('Not connected to mongodb, log message screwed', { level: 'info', extra: message }, function (result) {
                console.log(sentry.getIdent(result));
            });
            return;
        }

        message.date = new Date();
        message.id = message._id;
        delete message._id;

        db.collection('logs').insert(message, function (error) {
            if (error) {
                sentry.captureError(error, function (result) {
                    console.log(sentry.getIdent(result));
                });
            }
        });
    }
};
