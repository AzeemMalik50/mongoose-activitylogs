var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ActivityLog = require('./activity-model');



function mongooseLogsPlugin(schema, options) {


    schema.add({
        modifiedBy: {

        }
    });

    schema.post('save', function(doc, next) {

        var AL = new ActivityLog({
            collectionType: options.schemaName,
            referenceDocument: this,
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
            action: options.updateAction || 'updated',
            createdAt: Date.now()
        };
        if (this._update.$set && this._update.$set.modifiedBy) {
            activity.referenceDocument = this._update.$set;
            activity.loggedBy = this._update.$set.modifiedBy;
        }
        else if(this._update.$pushAll){
            activity.referenceDocument = this._update.$pushAll;
        }

        var AL = new ActivityLog(activity);
        AL.save(function(err, alog) {
            return next();
        });

    });


    schema.post('findOneAndUpdate', function(doc, next) {

        var activity = {
            collectionType: options.schemaName,
            referenceDocument: doc,
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
            referenceDocument: this,
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
            referenceDocument: this,
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