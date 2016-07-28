var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ActivityLog = require('./activity-model');



function mongooseLogsPlugin(schema, options) {

    schema.add({
        modifiedBy: {}
    });

    schema.post('save', function(doc, next) {
        var refrenceDocument = Object.assign({}, this._doc);
        delete refrenceDocument.modifiedBy;

        var AL = new ActivityLog({
            collectionType: options.schemaName,
            referenceDocument: refrenceDocument,
            action: options.createAction || 'created',
            loggedBy: this.modifiedBy,
            createdAt: Date.now()
        });
        AL.save(function(err, alog) {
            delete refrenceDocument.modifiedBy;
            return next();
        });
    });

    schema.post('update', function(doc, next) {

        var activity = {
            collectionType: options.schemaName,
            action: options.updateAction || 'updated',
            createdAt: Date.now()
        };
        if (this._update.$set && this._update.$set.modifiedBy) {
            var refrenceDocument = Object.assign({}, this._update.$set);
            delete refrenceDocument.modifiedBy;

            activity.loggedBy = this._update.$set.modifiedBy;
        } else if (this._update.$pushAll) {
            activity.referenceDocument = this._update.$pushAll;
        }


        var AL = new ActivityLog(activity);
        AL.save(function(err, alog) {

            return next();
        });

    });


    schema.post('findOneAndUpdate', function(doc, next) {
        var refrenceDocument = Object.assign({}, doc);
        delete refrenceDocument.modifiedBy;

        var activity = {
            collectionType: options.schemaName,
            referenceDocument: refrenceDocument,
            action: options.updateAction || 'updated',
            loggedBy: doc.modifiedBy,
            createdAt: Date.now()
        };

        var AL = new ActivityLog(activity);
        AL.save(function(err, alog) {
            delete refrenceDocument.modifiedBy;
            return next();
        });

    });


    schema.post('findOneAndRemove', function(doc, next) {
        var activity = {
            collectionType: options.schemaName,
            referenceDocument: refrenceDocument,
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
            referenceDocument: refrenceDocument,
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