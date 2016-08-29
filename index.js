var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ActivityLog = require('./activity-model');


function mongooseLogsPlugin(schema, options) {

    schema.add({
        modifiedBy: {}
    });
    
    // create action logs
    schema.post('save', function(doc, next) {
        var refrenceDocument = Object.assign({}, this._doc);
        delete refrenceDocument.modifiedBy;
        var ALog = new ActivityLog({
            collectionType: options.schemaName,
            referenceDocument: refrenceDocument,
            action: options.createAction || 'created',
            loggedBy: this.modifiedBy,
            createdAt: Date.now()
        });
        ALog.save(function(err, aLog) {
            return next();
        });
    });
// update action logs
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
        } else if (this._update.$pushALogl) {
            activity.referenceDocument = this._update.$pushALogl;
        }

        var ALog = new ActivityLog(activity);
        ALog.save(function(err, aLog) {
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
        var ALog = new ActivityLog(activity);
        ALog.save(function(err, aLog) {
            return next();
        });
    });
 // create logs for delete action
    schema.post('findOneAndRemove', function(doc, next) {
        var activity = {
            collectionType: options.schemaName,
            referenceDocument: refrenceDocument,
            action: options.deleteAction || 'deleted',
            loggedBy: this.modifiedBy,
            createdAt: Date.now()
        };
        var ALog = new ActivityLog(activity);
        ALog.save(function(err, aLog) {
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
        var ALog = new ActivityLog(activity);
        ALog.save(function(err, aLog) {
            return next();
        });
    });
}

module.exports = mongooseLogsPlugin;