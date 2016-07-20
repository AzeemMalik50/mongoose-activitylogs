var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ActivityLog = require('./model.activitylog');



function mongooseLogsPlugin(schema, options) {


    schema.add({
        modifiedBy: {
            
        }
    });

    schema.post('save', function(doc, next) {

        var AL = new ActivityLog({
            collectionType: options.schemaName,
            refereceDocument: this,
            action: options.createAction || 'created',
            loggedBy: this.modifiedBy,
            createdAt: Date.now()
        });
        AL.save(function(err, alog) {
            return next();
        });
    });

    schema.post('update', function(doc, next) {

        var activity = {
            collectionType: options.schemaName,
            refereceDocument: this._update.$set,
            action: options.updateAction || 'updated',
            loggedBy: this._update.$set.modifiedBy,
            createdAt: Date.now()
        };

        var AL = new ActivityLog(activity);
        AL.save(function(err, alog) {
            return next();
        });

    });


    schema.post('findOneAndUpdate', function(doc, next) {

        var activity = {
            collectionType: options.schemaName,
            refereceDocument: doc,
            action: options.updateAction || 'updated',
            loggedBy: doc.modifiedBy,
            createdAt: Date.now()
        };

        var AL = new ActivityLog(activity);
        AL.save(function(err, alog) {
            return next();
        });

    });


    schema.post('findOneAndRemove', function(doc, next) {
        var activity = {
            collectionType: options.schemaName,
            refereceDocument: this,
            action: options.deleteAction || 'deleted',
            loggedBy: this.modifiedBy,
            createdAt: Date.now()
        };

        var AL = new ActivityLog(activity);
        AL.save(function(err, alog) {
            return next();
        });
    });


    schema.post('remove', function(doc, next) {
        var activity = {
            collectionType: options.schemaName,
            refereceDocument: this,
            action: options.deleteAction || 'deleted',
            loggedBy: this.modifiedBy,
            createdAt: Date.now()
        };

        var AL = new ActivityLog(activity);
        AL.save(function(err, alog) {
            return next();
        });
    });
}

module.exports = mongooseLogsPlugin;